import CopyAndFillCleanElixirTemplateUsecase from "./copyAndFill.cleanElixirTemplate.usecase"


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
    const cleanElixirTemplateAutomator = MockWorkflowAutomator()

    const cleanElixirCopyAndFillUsecase = new CopyAndFillCleanElixirTemplateUsecase(cleanElixirTemplateAutomator)

    const result = await cleanElixirCopyAndFillUsecase.execute(input)

    expect(result).toBe('workflow automator response')
  })
})