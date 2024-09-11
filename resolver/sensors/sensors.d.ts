export interface SensorCreate {
	name: string;
	description: string;
	address: string;
	location: string;
	type: string;
	sensor_id: number;
	unit: string;
	status: boolean;
	building: string;
	up_limit: number;
	down_limit: number;
}

export interface SensorUpdate {
	_id: string;
	name: string;
	description: string;
	address: string;
	location: string;
	type: string;
	sensor_id: number;
	unit: string;
	status: boolean;
	building: string;
	up_limit: number;
	down_limit: number;
}
