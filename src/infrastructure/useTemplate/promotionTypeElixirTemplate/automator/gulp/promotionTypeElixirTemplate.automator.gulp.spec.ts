import PromotionTypeElixirTemplate from "../../../../../domain/promotionTypeElixirTemplate/valueObject/promotionTypeElixirTemplate"
import PromotionTypeElixirTemplateWorkflowAutomator from "./promotionTypeElixirTemplate.automator.gulp"

describe('Promotion type elixir template gulp automator', () => {

  it('should copy and fill clean elixir template', async () => {
    const workflowAutomator = new PromotionTypeElixirTemplateWorkflowAutomator()

    const component = new PromotionTypeElixirTemplate('./output/promotionTypeElixirTemplate', 'Bulhufas', 'Cacildas', 'name boolean, age atom')

    const result = await workflowAutomator.copyAndFill(component)

    expect(result).toBe('Successfully!')
  }, 10000)
})