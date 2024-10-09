import { SerialPort } from "serialport";
import { logger } from "./logger";
import { AlarmRepo } from "../models/alarm";
import { BellRepo } from "../models/bell";

export class Alarmbell extends SerialPort {
	public status: boolean = false;
	public disabled: boolean = false;

	constructor() {
		super({
			path: "/dev/ttyS0",
			baudRate: 9600,
			autoOpen: false,
			lock: false,
		});

		this.on("open", () => {
			logger.info("Serial port opened successfully");
			this.registerListeners();
			this.checkAndWriteBellStatus();
		});

		this.on("error", (err) => {
			logger.error(`Serial port error: ${err.message}`);
		});

		this.open((err) => {
			if (err) {
				logger.error(`Failed to open serial port: ${err.message}`);
			}
		});
	}

	private checkAndWriteBellStatus() {
		if (this.status && !this.disabled) {
			this.write("ATR1 1\r\n");
			logger.info("Alarm bell is on");
		} else {
			this.write("ATR1 0\r\n");
			logger.info("Alarm bell is off");
		}
	}

	private registerListeners() {
		BellRepo.watch().on("change", async (data) => {
			if (data.operationType === "update") {
				this.disabled = data.updateDescription.updatedFields.status;
				logger.info(
					"Bell is " + (this.disabled ? "enabled" : "disabled"),
				);
			}
		});

		AlarmRepo.watch().on("change", async (data) => {
			if (this.disabled) return;

			if (data.operationType === "update") {
				if (data.updateDescription.updatedFields.aknowledged) {
					this.status = false;
				} else {
					this.status = true;
				}

				logger.info("Alarm is " + (this.status ? "closed" : "open"));
			}
		});
	}

	public testBell() {
		if (!this.isOpen) {
			logger.warn("Serial port is not open");
			return;
		}

		logger.info("Testing bell...");
		this.write("ATR1 1\r\n");
		setTimeout(() => {
			this.write("ATR1 0\r\n");
		}, 5000);
	}
}
