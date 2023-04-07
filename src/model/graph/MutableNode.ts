import { Node } from './Node'

export class MutableNode<Value> implements Node<Value> {
  readonly value: Value
  readonly children: Node<Value>[]

  constructor (value: Value, children: Node<Value>[]) {
    this.value = value
    this.children = children
  }

  getChildren = (): Node<Value>[] => {
    return this.children
  }

  addChild = (child: Node<Value>): void => {
    this.children.push(child)
  }

  getData = (): Value => {
    return this.value
  }
}
