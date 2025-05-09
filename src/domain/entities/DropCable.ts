export class DropCable {
  
  public readonly __type? = 'DropCable';
  id: number;
  name: string;
  box_id: number;
  customer_id: number;
  ozmapData?: any;


  constructor(data: DropCable) {
    this.id = data.id;
    this.name = data.name;
    this.box_id = data.box_id;
    this.customer_id = data.customer_id;
    this.ozmapData = data.ozmapData ?? null;
  }

  static fromJson(data: any): DropCable {
    return new DropCable({
      id: data.id,
      name: data.name,
      box_id: data.box_id,
      customer_id: data.customer_id,
    });
  }
}
