import type { CreateCableDTO } from '@ozmap/ozmap-sdk/dist/index';

export interface CablePathPoint {
  lat: number;
  lng: number;
}

export interface CableProps {
  id: number;
  name: string;
  capacity: number;
  boxes_connected: number[];
  path: CablePathPoint[];
}

export class Cable {
  static fromJson(data: any): Cable {
    return new Cable({
      id: data.id,
      name: data.name,
      capacity: data.capacity,
      boxes_connected: data.boxes_connected,
      path: data.path,
      ozmapData: data.ozmapData,
    });
  }
  public readonly __type? = 'Cable';
  id: number;
  name: string;
  capacity: number;
  boxes_connected: number[];
  path: CablePathPoint[];
  ozmapData?: any;

  constructor(data: CableProps & { ozmapData?: any }) {
    this.id = data.id;
    this.name = data.name;
    this.capacity = data.capacity;
    this.boxes_connected = data.boxes_connected;
    this.path = data.path;
    this.ozmapData = data.ozmapData ?? null;
  }

}

