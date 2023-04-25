export default interface UseTemplateInterface<> {

  _templatePath: string
  _destinationPath: string

  mountDestinationPath(destinationPath: string): string
}