import ValidatorInterface from "../../@shared/validator/validator.interface";
import PromotionTypeElixirTemplateYupValidator from "../validator/promotionTypeElixirTemplate.yup.validator";
import PromotionTypeElixirTemplate from "../valueObject/promotionTypeElixirTemplate";

export default class PromotionTypeElixirTemplateValidatorFactory {
  static create(): ValidatorInterface<PromotionTypeElixirTemplate> {
    return new PromotionTypeElixirTemplateYupValidator();
  }
}