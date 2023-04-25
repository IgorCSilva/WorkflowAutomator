export default interface UseTemplateWorkflowAutomatorInterface<T> {
  copyAndFill(component: T): Promise<string>
}