import { Node } from './Node'

export class ReadonlyNode<Value> implements Node<Value> {
  readonly value: Value
  readonly children: Node<Value>[]

  constructor (value: Value, children: Node<Value>[]) {
    this.value = value
    this.children = children
  }

  getChildren = (): Node<Value>[] => {
    return this.children
  }

  getData = (): Value => {
    return this.value
  }
}
