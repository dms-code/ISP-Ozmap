import type { CreateBoxDTO } from '@ozmap/ozmap-sdk/dist/index';

export class Box {
  static fromJson(data: any): Box {
    return new Box({
      id: data.id,
      name: data.name,
      type: data.type,
      lat: data.lat,
      lng: data.lng,
      ozmapData: data.ozmapData,
    });
  }
  public readonly __type? = 'Box';
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  ozmapData?: any;

  // Accepts a plain object, not a Box instance
  constructor(data: { id: number; name: string; type: string; lat: number; lng: number; ozmapData?: any }) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.lat = data.lat;
    this.lng = data.lng;
    this.ozmapData = data.ozmapData ?? null;
  }

  toOzmapBox(): CreateBoxDTO {
    return {
      name: this.name,
      boxType: this.type,
      hierarchyLevel: 1,
      implanted: false, 
      project: "", 
      external_id: this.id,
      coords: [this.lat, this.lng],
    };
  }
}
