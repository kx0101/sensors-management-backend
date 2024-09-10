import { binaryParser, sensorCache } from "../config/gateway"
import { logger } from "../config/logger";
import { entriesResolvers } from "../resolver/entries/entryResolvers";

export interface IData {
    address: string;
    type: number;
    order: number;
    id: number;
    value: number;
}

export const createEntry = (data: Buffer) => {
    const parsedData = binaryParser.parse(data) as unknown as IData;

    let key = JSON.stringify(parsedData)
    let currentDate = Date.now()

    let lastAdded = sensorCache.get(key)!;
    if (currentDate - lastAdded <= 60000) {
        return
    }

    sensorCache.set(key, currentDate)

    const entry = entriesResolvers.Mutation.createEntry({
        address: parsedData.address,
        sensor: parsedData.id,
        value: parsedData.value,
    })

    logger.info(entry);
}
