import Component from "../../@shared/component/component.abstract";
import UseTemplateInterface from "../../@shared/useTemplate/useTemplate.interface";
import NotificationError from "../../@shared/notification/notification.error";
import UseCleanElixirTemplateValidatorFactory from "../factory/useCleanElixirTemplate.validator.factory";

export default class UseCleanElixirTemplate extends Component implements UseTemplateInterface {

  _templatePath: string = 'src/domain/useCleanElixirTemplate/template';
  _destinationPath: string;

  _projectName: string
  _entityName: string
  _fields: string // TODO: transform in a list of value objects.

  constructor(destinationPath: string, projectName: string, entityName: string, fields: string) {
    super()
    this._destinationPath = destinationPath
    this._projectName = projectName
    this._entityName = entityName
    this._fields = fields

    this.validate()
  }

  validate() {
    UseCleanElixirTemplateValidatorFactory.create().validate(this)

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }

  mountDestinationPath(destinationPath: string): string {
    return destinationPath
  }

  get templatePath(): string { return this._templatePath }
  get destinationPath(): string { return this._destinationPath }
  get projectName(): string { return this._projectName }
  get entityName(): string { return this._entityName }
  get fields(): string { return this._fields }
}