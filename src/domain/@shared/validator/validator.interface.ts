export default interface ValidatorInterface<T> {
  validate(component: T): void
}