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
	address: string;
	id: number;
}

export interface SensorID {
	sensor: string;
}
