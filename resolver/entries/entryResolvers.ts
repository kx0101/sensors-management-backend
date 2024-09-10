import {EntryRepo , type Entry } from "../../models/entry";
import type { EntryCreate, EntryID } from "./ientries";

export const entriesResolvers = {
    Query: {
        entries: async ( sensor :Entry) => {
            const res = await EntryRepo.find({sensor: sensor.sensor, address: sensor.address  }).catch((err:Error) => {
                console.log(err.message)
            })
            if(!res) return []
            return res 
        },
    },
    Mutation: {
        createEntry: async (entryInput: EntryCreate ) => {
            const entry = await EntryRepo.create({address:entryInput.address, sensor: entryInput.sensor, value: entryInput.value, expireAt: Date.now()}).catch((err:Error) => {
                console.log(err.message)
            })
            return entry
        },
        deleteEntries: async (entryInput: EntryID ) =>{
            let date = new Date()
            let pastDate = new Date(date.getDate() - entryInput.period)
            await EntryRepo.find({sensor: entryInput.sensor, address: entryInput.address}).where({createdAt: {$lt: pastDate}}).deleteMany()
            return `Deleted all entries older than ${entryInput.period} days`
        },
    }
};