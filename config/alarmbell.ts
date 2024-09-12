import { SerialPort } from "serialport";
import { logger } from "./logger";

/**
 * @class Alarmbell
 * @description Class for controlling the alarm bell
 * @param status - Status of the alarm bell
 * @method testBell - Method for testing the alarm bell
 */
export class Alarmbell extends SerialPort {
	public status: boolean = false;

	constructor() {
		super(
			{
				path: "COM1",
				baudRate: 9600,
				autoOpen: false,
			},
			(err) => {
				if (err) {
					logger.error("Cant find serial port");
				}
			},
		);

		switch (this.status) {
			case true:
				this.write("ATR1 1\n");
				logger.info("Alarm bell is on");
				break;
			case false:
				this.write("ATR1 0\n");
				logger.info("Alarm bell is off");
				break;
		}
	}

	public testBell() {
		if (this.isOpen) {
			logger.warn("Serial port is not open");
			return;
		}
		logger.info("Testing bell...");
		this.write("ATR1 1\n");
		setTimeout(() => {
			this.write("ATR1 0\n");
		}, 5000);
	}
}
