import { IDTO } from '../IDTO';

export class CableDTO implements IDTO<CableDTO> {
  id!: number;
  name!: string;
  capacity!: number;
  boxes_connected!: number[];
  path!: { lat: number; lng: number }[];

  fromJson(json: any): CableDTO {
    this.id = Number(json.id);
    this.name = json.name;
    this.capacity = Number(json.capacity);
    this.boxes_connected = Array.isArray(json.boxes_connected) ? json.boxes_connected.map(Number) : [];
    this.path = Array.isArray(json.path) ? json.path.map((p: any) => ({ lat: Number(p.lat), lng: Number(p.lng) })) : [];
    return this;
  }
}
