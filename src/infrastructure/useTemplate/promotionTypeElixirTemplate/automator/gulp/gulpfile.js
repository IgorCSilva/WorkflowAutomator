import gulp from 'gulp'
import rename from 'gulp-rename'
import replace from 'gulp-replace';
import modifier from 'gulp-modifier'

import yargs from 'yargs/yargs';

const argv = yargs(process.argv).parseSync();

const NEW_STRUCT_FIELD_MARKER = '# (NEW_STRUCT_FIELD_MARKER)'
const NEW_CREATE_FUNCTION_ARGS_MARKER = '(NEW_CREATE_FUNCTION_ARGS_MARKER)'
const NEW_MODULE_FIELD_MARKER = '# (NEW_MODULE_FIELD_MARKER)'
const NEW_RULE_ENTITY_FACTORY_FIELD_MARKER = '(NEW_RULE_ENTITY_FACTORY_FIELD_MARKER)'
const NEW_ECTO_VALIDATOR_SCHEMA_FIELD_MARKER = '(NEW_ECTO_VALIDATOR_SCHEMA_FIELD_MARKER)'
const NEW_ECTO_VALIDATOR_CAST_FIELD_MARKER = '(NEW_ECTO_VALIDATOR_CAST_FIELD_MARKER)'
const NEW_ECTO_VALIDATOR_REQUIRED_FIELD_MARKER = '(NEW_ECTO_VALIDATOR_REQUIRED_FIELD_MARKER)'

// Editions markers.
const EDIT_FILE_NEW_FUNCTION_MARKER = '#(NEW_FUNCTION_MARKER)'
const EDIT_ADD_I_PROMOTION_ALIAS_MARKER = '#(EDIT_ADD_I_PROMOTION_ALIAS_MARKER)'
const EDIT_ADD_I_PROMOTION_PROMOTION_TYPE_MARKER = '#(EDIT_ADD_I_PROMOTION_PROMOTION_TYPE_MARKER)'
const EDIT_ADD_I_PROMOTION_RULE_TYPE_MARKER = '#(EDIT_ADD_I_PROMOTION_RULE_TYPE_MARKER)'

function snakeToPascalCase(str) {
  const splitedString = str.split('_')
  const splitedPascalCase = splitedString.map((name) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  })
  const pascalCase = splitedPascalCase.join('')
  return pascalCase
}

function defaulFieldValue(fields) {
  const types = {
    string: '\"\"',
    integer: 0,
    boolean: 'false',
    list: '[]',
    object: '%{}',
    atom: 'nil'
  }

  return fields.map((field, index) => { return `${field.name}: ${field.default || types[field.type]}${index + 1 == fields.length ? '' : ',\n'}` }).join('')
}

function ectoValidationFields(fields) {
  const types = {
    string: 'string',
    integer: 'integer',
    boolean: 'boolean',
    list: 'to be defined',
    object: 'to be defined',
    atom: 'atom'
  }

  return fields.map((field, index) => {return `field :${field.name}, :${types[field.type]}${index + 1 == fields.length ? '' : '\n'}`}).join('')
}

function ectoValidationRequiredFields(fields) {

  let fieldResult = ''

  let result = fields.map((field) => {
    fieldResult = `${field.required ? ':' + field.name + ', ': ''}`
    return fieldResult
  })

  return result
    .join('')
    .slice(0, -2);
}

function fillModuleField(fields) {
  return fields.map((field, index) => { return `${field.name}: ${field.name}${index + 1 == fields.length ? '' : ',\n'}`}).join('')
}

function useSpecifiedDefaulValue(value) {
  return !value || value === '-' ? false : value
}

function prepareFields(fieldsData) {
  let fields = fieldsData.split(',')
  return fields.map(field => {
    let fieldSpecifications = field.trim().split(' ')
    return {
      name: useSpecifiedDefaulValue(fieldSpecifications[0]) || '',
      type: useSpecifiedDefaulValue(fieldSpecifications[1]) || 'string',
      default: useSpecifiedDefaulValue(fieldSpecifications[2]) || undefined,
      required: useSpecifiedDefaulValue(fieldSpecifications[3]) === 'true' ? true : false 
    }
  })
}

// Task functions. =================================================================

function mountPromotionEntityFile() {
  const origin = `${argv.templatePath}/lib/(project)/domain/(entity)/entity/(entity)_promotion.ex`
  
  return gulp.src(origin)
    .pipe(replace('{ProjectName}', `${snakeToPascalCase(argv.projectName)}`))
    .pipe(replace('{EntityName}', `${snakeToPascalCase(argv.entityName)}`))
    .pipe(replace('{entity_name}', `${argv.entityName}`))
    .pipe(rename(function (path) {
      path.basename = argv.entityName + '_promotion'
    }))
    .pipe(gulp.dest(`${argv.destinationPath}/lib/${argv.projectName}/domain/${argv.entityName}/entity/`))
}

function mountRuleEntityFile() {
  const origin = `${argv.templatePath}/lib/(project)/domain/(entity)/entity/(entity)_rule.ex`
  
  let preparedFields = prepareFields(argv.fields)
  
  return gulp.src(origin)
    .pipe(replace('{ProjectName}', `${snakeToPascalCase(argv.projectName)}`))
    .pipe(replace('{EntityName}', `${snakeToPascalCase(argv.entityName)}`))
    .pipe(replace('{entity_name}', `${argv.entityName}`))
    .pipe(replace(NEW_STRUCT_FIELD_MARKER, defaulFieldValue(preparedFields)))
    .pipe(replace(NEW_CREATE_FUNCTION_ARGS_MARKER, () => { return preparedFields.map((field, index) => { return `${field.name}${index + 1 == preparedFields.length ? '' : ', '}`}).join('')}))
    .pipe(replace(NEW_MODULE_FIELD_MARKER, fillModuleField(preparedFields)))
    .pipe(rename(function (path) {
      path.basename = argv.entityName + '_rule'
    }))
    .pipe(gulp.dest(`${argv.destinationPath}/lib/${argv.projectName}/domain/${argv.entityName}/entity/`))
}

function mountPromotionEntityFactoryFile() {
  const origin = `${argv.templatePath}/lib/(project)/domain/(entity)/factory/(entity)_factory.ex`
  
  let preparedFields = prepareFields(argv.fields)
  
  return gulp.src(origin)
    .pipe(replace('{ProjectName}', `${snakeToPascalCase(argv.projectName)}`))
    .pipe(replace('{EntityName}', `${snakeToPascalCase(argv.entityName)}`))
    .pipe(replace(NEW_RULE_ENTITY_FACTORY_FIELD_MARKER, () => { return preparedFields.map((field, index) => { return `rule.${field.name}${index + 1 == preparedFields.length ? '' : ',\n'}`}).join('')}))
    .pipe(rename(function (path) {
      path.basename = argv.entityName + '_factory'
    }))
    .pipe(gulp.dest(`${argv.destinationPath}/lib/${argv.projectName}/domain/${argv.entityName}/factory/`))
}

function mountPromotionEntityValidatorFactoryFile() {
  const origin = `${argv.templatePath}/lib/(project)/domain/(entity)/factory/(entity)_promotion_validator_factory.ex`
  
  return gulp.src(origin)
    .pipe(replace('{ProjectName}', `${snakeToPascalCase(argv.projectName)}`))
    .pipe(replace('{EntityName}', `${snakeToPascalCase(argv.entityName)}`))
    .pipe(rename(function (path) {
      path.basename = argv.entityName + '_promotion_validator_factory'
    }))
    .pipe(gulp.dest(`${argv.destinationPath}/lib/${argv.projectName}/domain/${argv.entityName}/factory/`))
}

function mountRuleEntityValidatorFactoryFile() {
  const origin = `${argv.templatePath}/lib/(project)/domain/(entity)/factory/(entity)_rule_validator_factory.ex`
  
  return gulp.src(origin)
    .pipe(replace('{ProjectName}', `${snakeToPascalCase(argv.projectName)}`))
    .pipe(replace('{EntityName}', `${snakeToPascalCase(argv.entityName)}`))
    .pipe(rename(function (path) {
      path.basename = argv.entityName + '_rule_validator_factory'
    }))
    .pipe(gulp.dest(`${argv.destinationPath}/lib/${argv.projectName}/domain/${argv.entityName}/factory/`))
}

function mountPromotionEntityEctoValidatorFile() {
  const origin = `${argv.templatePath}/lib/(project)/domain/(entity)/validator/(entity)_promotion_ecto_validator.ex`
  
  return gulp.src(origin)
    .pipe(replace('{ProjectName}', `${snakeToPascalCase(argv.projectName)}`))
    .pipe(replace('{EntityName}', `${snakeToPascalCase(argv.entityName)}`))
    .pipe(rename(function (path) {
      path.basename = argv.entityName + '_promotion_ecto_validator'
    }))
    .pipe(gulp.dest(`${argv.destinationPath}/lib/${argv.projectName}/domain/${argv.entityName}/validator/`))
}

function mountRuleEntityEctoValidatorFile() {
  const origin = `${argv.templatePath}/lib/(project)/domain/(entity)/validator/(entity)_rule_ecto_validator.ex`
  
  let preparedFields = prepareFields(argv.fields)

  return gulp.src(origin)
    .pipe(replace('{ProjectName}', `${snakeToPascalCase(argv.projectName)}`))
    .pipe(replace('{EntityName}', `${snakeToPascalCase(argv.entityName)}`))
    .pipe(replace(NEW_ECTO_VALIDATOR_SCHEMA_FIELD_MARKER, ectoValidationFields(preparedFields)))
    .pipe(replace(NEW_ECTO_VALIDATOR_CAST_FIELD_MARKER, () => { return preparedFields.map((field, index) => { return `:${field.name}${index + 1 == preparedFields.length ? '' : ',\n'}`}).join('')}))
    .pipe(replace(NEW_ECTO_VALIDATOR_REQUIRED_FIELD_MARKER, ectoValidationRequiredFields(preparedFields)))
    .pipe(rename(function (path) {
      path.basename = argv.entityName + '_rule_ecto_validator'
    }))
    .pipe(gulp.dest(`${argv.destinationPath}/lib/${argv.projectName}/domain/${argv.entityName}/validator/`))
}

function getMarkerIndentation(content, marker) {

  let indentation = 0

  try {
    indentation =
      content
        .split('\n')
        .find((line) => {
          return line.indexOf(marker) >= 0
        })
        .indexOf(marker)
  } catch (e) {
    console.error('ERROR CALCULATING MARKER INDENTATION', e)
  }
  return indentation
}

function getMinSpaceIndentation(content) {

  let minIndentation = 0
  let currentMinIndentation = 50

  try {
    minIndentation =
      content
        .split('\n')
        .map((line) => {
          return (line.trim() == '\n' ? line.trim() : line)
        })
        .reduce((min, line) => {
          currentMinIndentation = line.search(/\S/)
          currentMinIndentation = currentMinIndentation === -1 ? 0 : currentMinIndentation

          return line.trim() !== '' && currentMinIndentation < min ? currentMinIndentation : min
        }, 50)
  } catch (e) {
    console.error('ERROR CALCULATING MINIMUM INDENTATION', e)
  }

  return minIndentation
}

function indentContent(newContent, markerIndentation, minSpaceIndentation) {
  return newContent
    .split('\n')
    .slice(1)
    .map((line, index) => { 
      if (line.search(/\S/) === -1) {
        return line.trim()
      } else {
        return (index ? indent(markerIndentation) : '') + line.slice(minSpaceIndentation)
      }
    })
    .join('\n')
}

function indent(number) {
  return ' '.repeat(number)
}

function getMarkerParameters(content, marker) {

  let parameters = []

  try {
    parameters =
      content
        .split('\n')
        .find((line) => {
          return line.indexOf(marker) >= 0
        })
        .split('|')
        .slice(1)[0]
        .split(';')
        .reduce((acc, p) => {
          acc[p.split('=')[0]] = p.split('=')[1]
          return acc
        }, {marker: marker})
  } catch (e) {
    console.error('ERROR GETTING MARKER PARAMETERS', e)
  }
  return parameters
}

function editLine(newContents, newInlineContent, parameters) {
  let lines = newContents.split('\n')
  let markerLine = lines
    .findIndex((line) => {
      return line.indexOf(parameters.marker) >= 0
    })

  let lineToEdit = lines[markerLine + Number(parameters.L)]
  lineToEdit = lineToEdit.slice(0, parameters.P) + newInlineContent + lineToEdit.slice(parameters.P)

  lines[markerLine + Number(parameters.L)] = lineToEdit
  return lines.join('\n')
}

function addIPromotionTypes() {
  const origin = `${argv.destinationPath}/lib/${argv.projectName}/domain/promotion/factory/`
  const file = 'i_promotion_factory.ex'

  return gulp.src(origin + file)
    .pipe(
      modifier((contents, path) => {
        let pascalEntityName = snakeToPascalCase(argv.entityName)
        // ADD ALIAS

        let newInlineContent = `${pascalEntityName}.Entity.${pascalEntityName}Promotion,
    ${pascalEntityName}.Entity.${pascalEntityName}Rule,
    `
        let parameters = getMarkerParameters(contents, EDIT_ADD_I_PROMOTION_ALIAS_MARKER)
        let contentEdited = editLine(contents, newInlineContent, parameters)

        // ADD PROMOTION TYPE
        newInlineContent = `${pascalEntityName}Promotion | `
        parameters = getMarkerParameters(contents, EDIT_ADD_I_PROMOTION_PROMOTION_TYPE_MARKER)
        contentEdited = editLine(contentEdited, newInlineContent, parameters)

        // ADD RULE TYPE
        newInlineContent = `${pascalEntityName}Rule | `
        parameters = getMarkerParameters(contents, EDIT_ADD_I_PROMOTION_RULE_TYPE_MARKER)
        contentEdited = editLine(contentEdited, newInlineContent, parameters)
          
        return contentEdited
      })
    )
    .pipe(gulp.dest(origin))
}

function addFunctionStorePromotionsEntity() {
  const origin = `${argv.destinationPath}/lib/${argv.projectName}/domain/store_promotions/entity/`
  const file = 'store_promotions.ex'

  return gulp.src(origin + file)
    .pipe(
      modifier((contents, path) => {

        // NEW FUNCTION.
        let newContent = `
        @spec set_${argv.entityName}(%__MODULE__{}, ${snakeToPascalCase(argv.entityName)}Promotion.t()) :: %__MODULE__{}
        def set_${argv.entityName}(store_promotions, ${argv.entityName}), do: %{store_promotions | ${argv.entityName}: ${argv.entityName}}
        `

        let markerIndentation = getMarkerIndentation(contents, EDIT_FILE_NEW_FUNCTION_MARKER)
        let minSpaceIndentation = getMinSpaceIndentation(newContent)
        let indentedContent = indentContent(newContent, markerIndentation, minSpaceIndentation)

        // let newContents = contents
        let newContents = contents.replace(
          EDIT_FILE_NEW_FUNCTION_MARKER,
          indentedContent + '\n' + indent(markerIndentation) + EDIT_FILE_NEW_FUNCTION_MARKER
        );

        return newContents
      })
    )
    .pipe(gulp.dest(origin))
}

export const mountEntity = gulp.parallel(
  mountPromotionEntityFile,
  mountRuleEntityFile,
  mountPromotionEntityFactoryFile,
  mountPromotionEntityValidatorFactoryFile,
  mountRuleEntityValidatorFactoryFile,
  mountPromotionEntityEctoValidatorFile,
  mountRuleEntityEctoValidatorFile,
  addIPromotionTypes,
  addFunctionStorePromotionsEntity
)