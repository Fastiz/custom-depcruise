export interface Node<Data> {
  getData: () => Data
  getChildren: () => Node<Data>[]
}
