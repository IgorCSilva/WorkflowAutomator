
import PromotionTypeElixirTemplate from './promotionTypeElixirTemplate'

describe('Create by promotion type elixir template', () => {

  it('Should create component with valid params', () => {
    const component = new PromotionTypeElixirTemplate('../destination/path', 'project_name', 'entity_name', 'name string, age integer')

    expect(component.templatePath).toBe('src/domain/useCleanElixirTemplate/template')
    expect(component.destinationPath).toBe('../destination/path')
    expect(component.projectName).toBe('project_name')
    expect(component.entityName).toBe('entity_name')
    expect(component.fields).toBe('name string, age integer')
  })

  it('Should throw an error when required params are empty', () => {
    expect(() => {
      let component = new PromotionTypeElixirTemplate('', '', '', '')
    }).toThrowError('promotionTypeElixirTemplate: destination path is required,promotionTypeElixirTemplate: project name is required,promotionTypeElixirTemplate: entity name is required')
  })
})