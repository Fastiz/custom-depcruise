export type Observer<T> = {
  next: (input: T) => void
}
