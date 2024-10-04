interface SensorBase {
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

type SensorBatchInput = {
    address: string;
    sensor_id: number;
};

interface AverageData {
    averages: number[];
    counts: number[];
    address: string;
}

export interface SensorCreate extends Omit<SensorBase, "_id"> { }

export interface SensorUpdate extends SensorBase {
    _id: string;
}
