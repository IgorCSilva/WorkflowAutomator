import UseCleanElixirTemplate from "../../../../../domain/useCleanElixirTemplate/valueObject/useCleanElixirTemplate"
import CleanElixirTemplateWorkflowAutomator from "./cleanElixirTemplate.automator.gulp"

describe('Clean elixir template gulp automator', () => {

  it('should copy and fill clean elixir template', async () => {
    const workflowAutomator = new CleanElixirTemplateWorkflowAutomator()

    const component = new UseCleanElixirTemplate('./output/cleanElixirTemplate', 'Bulhufas', 'Cacildas', 'name boolean, age atom')

    const result = await workflowAutomator.copyAndFill(component)

    expect(result).toBe('Successfully!')
  }, 10000)
})