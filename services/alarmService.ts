import { AlarmRepo } from "../models/alarm";
import { Alarmbell } from "../config/alarmbell";
import { BellRepo } from "../models/bell";
import { logger } from "../config/logger";

export const createAlarm = (alarmbell: Alarmbell) => {
	BellRepo.watch().on("change", async (data) => {
		switch (data.operationType) {
			case "insert":
				break;
			case "update":
				alarmbell.disabled =
					data.updateDescription.updatedFields.aknowledged;
				logger.info(
					"Bell is",
					alarmbell.disabled ? "enabled" : "disabled",
				);
				break;
		}
	});

	AlarmRepo.watch().on("change", async (data) => {
		if (alarmbell.disabled) return;
		switch (data.operationType) {
			case "insert":
				alarmbell.status = data.fullDocument.aknowledged;
				break;
			case "update":
				alarmbell.status =
					data.updateDescription.updatedFields.aknowledged;
				logger.log("Alarm is", alarmbell.status ? "closed" : "open");
				break;
		}
	});
};
