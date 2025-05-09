// Interface for DTOs with a static fromJson method
export interface IDTO<T> {
  fromJson(json: any): T;
}

