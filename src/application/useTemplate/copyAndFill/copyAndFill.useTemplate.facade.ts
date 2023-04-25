import UseCleanElixirTemplate from "../../../domain/useCleanElixirTemplate/valueObject/useCleanElixirTemplate";
import { InputCopyAndFillUseTemplateDTO, OutputCopyAndFillUseTemplateDTO } from "./copyAndFill.useTemplate.dto";

export default class CreateUseTemplateFacade {

  execute(input: InputCopyAndFillUseTemplateDTO): OutputCopyAndFillUseTemplateDTO {

    switch(input.template) {
      case 'cleanElixir':
        let component = new UseCleanElixirTemplate('oi', 'asdf', 'fdsa', 'asas')

        console.log(component)

        // let component = new UseCleanElixirTemplateFactory(input.createParams)


      default: throw new Error(`Invalid template: ${input.template}`)
    }
  }
}