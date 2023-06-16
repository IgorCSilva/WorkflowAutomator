import promotionTypeElixirTemplate from "../../../domain/promotionTypeElixirTemplate/valueObject/promotionTypeElixirTemplate";
import PromotionTypeElixirTemplateWorkflowAutomatorInterface from "../../../domain/promotionTypeElixirTemplate/workflowAutomator/promotionTypeElixirTemplate.workflowAutomator.interface";
import { InputCopyAndFillPromotionTypeElixirTemplateDTO } from "./copyAndFill.promotionTypeElixirTemplate.dto";

export default class CopyAndFillPromotionTypeElixirTemplateUsecase {
  private workflowAutomator: PromotionTypeElixirTemplateWorkflowAutomatorInterface

  constructor(workflowAutomator: PromotionTypeElixirTemplateWorkflowAutomatorInterface) {
    this.workflowAutomator = workflowAutomator;
  }

  async execute(input: InputCopyAndFillPromotionTypeElixirTemplateDTO): Promise<string> {
    const component = new promotionTypeElixirTemplate(input.destinationPath, input.projectName, input.entityName, input.fields)

    const result = await this.workflowAutomator.copyAndFill(component)

    return result
  }
}