import { randomUUID } from 'crypto'

export class UniqueEntityID {
  constructor(private value?: string) {
    this.value = value ?? randomUUID()
  }

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }
}
