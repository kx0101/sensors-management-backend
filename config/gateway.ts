import { Socket } from 'node:net';
import { logger } from './logger';
import { Parser } from 'binary-parser';
import { createEntry } from '../services/gatewayService';

const GATEWAY_PORT = parseInt(process.env.GATEWAY_PORT ?? '10001');
const GATEWAY_URI = process.env.GATEWAY_URI ?? '192.168.1.7';
const MAX_RETRIES = 10;
const RETRY_INTERVAL_MS = 5000;

class GatewayClient {
    private tcpClient: Socket;
    private retries: number;

    constructor() {
        this.tcpClient = new Socket();
        this.retries = 0;

        this.tcpClient.on('error', this.handleError);
        this.tcpClient.on('timeout', this.handleTimeout);
        this.tcpClient.once('close', this.handleClose);
    }

    connect() {
        logger.info('Attempting to connect to gateway');
        this.attemptConnection();
    }

    private attemptConnection = () => {
        this.tcpClient.connect(GATEWAY_PORT, GATEWAY_URI);

        this.tcpClient.once('connect', () => {
            logger.info(`Connected to gateway on port: ${GATEWAY_URI}:${GATEWAY_PORT}`);
            this.retries = 0;

            this.tcpClient.on('data', this.handleData);
            this.tcpClient.once('data', () => {
                logger.info('Gateway started receiving data');
            });
        });
    };

    private handleData = (data: Buffer) => {
        createEntry(data);
    };

    private handleError = (error: Error) => {
        logger.error(`Gateway Connection Error: ${error.message}`);
    };

    private handleTimeout = () => {
        logger.warn('Connection timed out. Destroying socket.');
        this.handleRetry();
    };

    private handleClose = () => {
        logger.warn('Gateway connection closed.');
        this.handleRetry();
    };

    private handleRetry = () => {
        this.tcpClient.removeAllListeners();
        this.tcpClient.destroy();
        this.tcpClient = new Socket();

        if (this.retries >= MAX_RETRIES) {
            logger.error('Max retries reached. Could not connect to the gateway.');
            return;
        }

        this.retries++;
        logger.info(`Retrying connection in ${RETRY_INTERVAL_MS / 1000} seconds... (Attempt ${this.retries}/${MAX_RETRIES})`);
        setTimeout(this.attemptConnection, RETRY_INTERVAL_MS);
    };
}

export const gatewayClient = new GatewayClient();
export const sensorCache = new Map<string, number>();

export const binaryParser = new Parser()
    .endianness('big')
    .skip(6)
    .array('address', {
        type: 'uint8',
        length: 8,
        formatter: (arr: any) => arr.map((num: { toString: (arg0: number) => string; }) => num.toString(16).padStart(2, '0')).join('')
    })
    .uint8('type')
    .uint8('order')
    .skip(1)
    .uint8('id')
    .floatbe('value');

