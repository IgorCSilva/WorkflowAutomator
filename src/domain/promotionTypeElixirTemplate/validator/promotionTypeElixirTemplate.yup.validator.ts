import ValidatorInterface from "../../@shared/validator/validator.interface";
import PromotionTypeElixirTemplate from "../valueObject/promotionTypeElixirTemplate";

import * as yup from 'yup'

export default class PromotionTypeElixirTemplateYupValidator implements ValidatorInterface<PromotionTypeElixirTemplate> {
  validate(component: PromotionTypeElixirTemplate): void {
    
    try {
      yup
        .object()
        .shape({
          templatePath: yup.string().required('template path is required'),
          destinationPath: yup.string().required('destination path is required'),
          projectName: yup.string().required('project name is required'),
          entityName: yup.string().required('entity name is required')
        })
        .validateSync(
          {
            templatePath: component.templatePath,
            destinationPath: component.destinationPath,
            projectName: component.projectName,
            entityName: component.entityName
          },
          {
            abortEarly: false
          }
        )

    } catch(errors) {
      const e = errors as yup.ValidationError

      e.errors.forEach((error) => {
        component.notification.addError({
          context: 'promotionTypeElixirTemplate',
          message: error
        })
      })
    }
  }
}