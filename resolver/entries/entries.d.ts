export interface EntryID {
	address: string;
	sensor: number;
	period: number;
}

export interface EntryCreate {
	address: string;
	sensor: number;
	value: number;
	sensor_id: string;
}
