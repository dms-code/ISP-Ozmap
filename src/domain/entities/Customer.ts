export class Customer {
  public readonly __type? = 'Customer';
  
  id: number;
  code: string;
  name: string;
  address: string;
  box_id: number;
  ozmapData?: any;

  constructor(data: Customer & { ozmapData?: any }) {
    this.id = data.id;
    this.code = data.code;
    this.name = data.name;
    this.address = data.address;
    this.box_id = data.box_id;
    this.ozmapData = data.ozmapData ?? null;
  }

  static fromJson(data: any): Customer {
    return new Customer({
      id: data.id,
      code: data.code,
      name: data.name,
      address: data.address,
      box_id: data.box_id,
      ozmapData: data.ozmapData,
    });
  }
}
