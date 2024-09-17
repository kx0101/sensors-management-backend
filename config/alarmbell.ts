import { SerialPort } from "serialport";
import { logger } from "./logger";
import { AlarmRepo } from "../models/alarm";
import { BellRepo } from "../models/bell";

/**
 * @class Alarmbell
 * @description Class for controlling the alarm bell
 * @param status - Status of the alarm bell
 * @method testBell - Method for testing the alarm bell
 */
export class Alarmbell extends SerialPort {
    public status: boolean = false;
    public disabled: boolean = false;

    constructor() {
        super(
            {
                path: "COM1",
                baudRate: 9600,
                autoOpen: true,
            },
            (err) => {
                if (err) {
                    logger.error("Cant find serial port");
                }
            },
        );

        this.registerListeners();

        if (this.status && !this.disabled) {
            this.write("ATR1 1\n");
            logger.info("Alarm bell is on");
        } else {
            this.write("ATR1 0\n");
            logger.info("Alarm bell is off");
        }
    }

    private registerListeners() {
        BellRepo.watch().on("change", async (data) => {
            switch (data.operationType) {
                case "insert":
                    break;
                case "update":
                    this.disabled =
                        data.updateDescription.updatedFields.status;
                    logger.info(
                        "Bell is ",
                        this.disabled ? "enabled" : "disabled",
                    );
                    break;
            }
        });

        AlarmRepo.watch().on("change", async (data) => {
            if (this.disabled) return;

            switch (data.operationType) {
                case "insert":
                    this.status = true;
                    break;
                case "update":
                    if (data.updateDescription.updatedFields.aknowledged) {
                        this.status = false;
                    }

                    logger.log("Alarm is ", this.status ? "closed" : "open");
                    break;
            }
        });
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
