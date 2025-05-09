export interface IRepository<T> {
  getData(): Promise<T[]>;
  save(data: T): Promise<boolean>;
  get(obj: T): Promise<T | null>;
}
