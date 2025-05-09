import { IDTO } from '../IDTO';

export class CustomerDTO implements IDTO<CustomerDTO> {
  id!: number;
  code!: string;
  name!: string;
  address!: string;
  box_id!: number;

  fromJson(json: any): CustomerDTO {
    this.id = Number(json.id);
    this.code = json.code;
    this.name = json.name;
    this.address = json.address;
    this.box_id = Number(json.box_id);
    return this;
  }
}
