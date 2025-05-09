// Generic DataSource interface for async operations
export interface IDataSource<T> {
  getData(): Promise<T[]>;
  save(data: T): Promise<boolean>;
  get(data: T): Promise<T | null>;
}
