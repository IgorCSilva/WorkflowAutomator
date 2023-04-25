import ValidatorInterface from "../../@shared/validator/validator.interface";
import UseCleanElixirTemplateYupValidator from "../validator/useCleanElixirTemplate.yup.validator";
import UseCleanElixirTemplate from "../valueObject/useCleanElixirTemplate";

export default class UseCleanElixirTemplateValidatorFactory {
  static create(): ValidatorInterface<UseCleanElixirTemplate> {
    return new UseCleanElixirTemplateYupValidator();
  }
}