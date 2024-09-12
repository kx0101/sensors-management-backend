import { bellType } from "../resolver/bell/bellSchema";
import { entryType } from "../resolver/entries/entrySchema";
import { sensorType } from "../resolver/sensors/sensorSchema";
import { userType } from "../resolver/users/userSchema";
import { alarmType } from "../resolver/alarms/alarmSchema";
import { alarmResolvers } from "../resolver/alarms/alarmResolvers";
import { bellResolvers } from "../resolver/bell/bellResolvers";
import { entriesResolvers } from "../resolver/entries/entryResolvers";
import { sensorsResolvers } from "../resolver/sensors/sensorResolvers";
import { userResolvers } from "../resolver/users/userResolves";

const typeDefs = [alarmType, bellType, entryType, sensorType, userType];
const resolvers = [
	alarmResolvers,
	bellResolvers,
	entriesResolvers,
	sensorsResolvers,
	userResolvers,
];

export { typeDefs, resolvers };
