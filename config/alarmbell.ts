import { SerialPort } from "serialport";
import { logger } from "./logger";
import { AlarmRepo } from "../models/alarm";
import { BellRepo } from "../models/bell";
import { bellResolvers } from "../resolver/bell/bellResolvers";

export class Alarmbell extends SerialPort {
	public alarmAknowledge: boolean = false;
	public status: boolean = false;

	constructor() {
		super({
			path: "/dev/ttyS0",
			baudRate: 9600,
			autoOpen: false,
			lock: false,
		});

		this.on("open", async () => {
			logger.info("Serial port opened successfully");

			await this.getAlarmBell().then((status: boolean) => {
				logger.info("status of the bell from db: ", status);
				console.log("status of the bell from db: ", status);

				this.setStatus(status);
				this.registerListeners();
				this.setAlarmAknowledge(true);
				this.checkAndWriteBellStatus();
			});
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
		if (!this.alarmAknowledge && this.status) {
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
				this.status = data.updateDescription.updatedFields.status;
				logger.info("Bell is " + (this.status ? "enabled" : "status"));
			}
		});
	}

	private async getAlarmBell() {
		try {
			const bell = await bellResolvers.Query.bell();
			const { status } = bell;

			return status;
		} catch (error) {
			logger.error("getAlarmBell error: ", error);
			console.log(error);
			return false;
		}
	}

	private setAlarmAknowledge(alarmAknowledge: boolean) {
		this.alarmAknowledge = alarmAknowledge;
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

	public setStatus(status: boolean) {
		this.status = status;
	}
}
