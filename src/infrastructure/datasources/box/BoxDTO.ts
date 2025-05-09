import { IDTO } from '../IDTO';

export class BoxDTO implements IDTO<BoxDTO> {
  id!: number;
  name!: string;
  type!: string;
  lat!: number;
  lng!: number;

  fromJson(json: any): BoxDTO {
    this.id = Number(json.id);
    this.name = json.name;
    this.type = json.type;
    this.lat = Number(json.lat);
    this.lng = Number(json.lng);
    return this;
  }
}
