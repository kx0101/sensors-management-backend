export interface AlarmCreate {
	address: string;
	sensor: number;
	reason: string;
}

export interface AlarmUpdate {
	_id: string;
	aknowledged: boolean;
}

export interface SensorInput {
	id: string;
}

export interface SensorID {
	sensor: string;
}
