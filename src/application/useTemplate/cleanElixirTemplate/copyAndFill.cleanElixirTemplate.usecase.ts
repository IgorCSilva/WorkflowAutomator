import UseCleanElixirTemplate from "../../../domain/useCleanElixirTemplate/valueObject/useCleanElixirTemplate";
import CleanElixirTemplateWorkflowAutomatorInterface from "../../../domain/useCleanElixirTemplate/workflowAutomator/cleanElixirTemplate.workflowAutomator.interface";
import { InputCopyAndFillCleanElixirTemplateDTO } from "./copyAndFill.cleanElixirTemplate.dto";

export default class CopyAndFillCleanElixirTemplateUsecase {
  private workflowAutomator: CleanElixirTemplateWorkflowAutomatorInterface

  constructor(workflowAutomator: CleanElixirTemplateWorkflowAutomatorInterface) {
    this.workflowAutomator = workflowAutomator;
  }

  async execute(input: InputCopyAndFillCleanElixirTemplateDTO): Promise<string> {
    console.log('USECASE: execute', input)
    const component = new UseCleanElixirTemplate(input.destinationPath, input.projectName, input.entityName, input.fields)

    console.log('USECASE', component)
    const result = await this.workflowAutomator.copyAndFill(component)

    return result
  }
}