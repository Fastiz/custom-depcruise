export interface NodeAsync<Data> {
  getData: () => Promise<Data>
  getChildren: () => Promise<NodeAsync<Data>[]>
}
