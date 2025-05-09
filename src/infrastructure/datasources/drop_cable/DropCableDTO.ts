import { IDTO } from '../IDTO';

export class DropCableDTO implements IDTO<DropCableDTO> {
  id!: number;
  name!: string;
  box_id!: number;
  customer_id!: number;

  fromJson(json: any): DropCableDTO {
    this.id = Number(json.id);
    this.name = json.name;
    this.box_id = Number(json.box_id);
    this.customer_id = Number(json.customer_id);
    return this;
  }
}
