import CopyAndFillPromotionTypeElixirTemplateUsecase from "./copyAndFill.promotionTypeElixirTemplate.usecase"


const input = {
  destinationPath: '../destination/path',
  projectName: 'project_name',
  entityName: 'entity_name',
  fields: 'name string, age integer'
}

const MockWorkflowAutomator = () => {
  return {
    copyAndFill: jest.fn(async () => { return 'workflow automator response'})
  }
}

describe('Unit test copy and fill clean elixir template', () => {
 
  it('should copy and fill clean elixir template', async () => {
    const promotionTypeElixirTemplateAutomator = MockWorkflowAutomator()

    const promotionTypeElixirTemplateCopyAndFillUsecase = new CopyAndFillPromotionTypeElixirTemplateUsecase(promotionTypeElixirTemplateAutomator)

    const result = await promotionTypeElixirTemplateCopyAndFillUsecase.execute(input)

    expect(result).toBe('workflow automator response')
  })
})