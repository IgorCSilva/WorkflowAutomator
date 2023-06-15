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

const VALID_ATTR_FIELDS_MARKER = '(VALID_ATTR_FIELDS_MARKER)'
const VALID_FIELD_VALUE_MARKER = '(VALID_FIELD_VALUE_MARKER)'
const DEFAULT_FIELDS_VALUE_MARKER = '(DEFAULT_FIELDS_VALUE_MARKER)'
const NIL_FIELDS_MARKER = '(NIL_FIELDS_MARKER)'
const INLINE_NIL_FIELDS_MARKER = '(INLINE_NIL_FIELDS_MARKER)'
const INLINE_INVALID_FIELDS_MARKER = '(INLINE_INVALID_FIELDS_MARKER)'
const NIL_KEYS_FIELDS_MARKER = '(NIL_KEYS_FIELDS_MARKER)'
const INVALID_FIELDS_VALUES_MARKER = '(INVALID_FIELDS_VALUES_MARKER)'


// Editions markers.
const EDIT_FILE_ADD_BLOCK_MARKER = '#(ADD_BLOCK_MARKER)'
const EDIT_ADD_INLINE_CONTENT_MARKER = '#(EDIT_ADD_INLINE_CONTENT_MARKER)'

function snakeToPascalCase(str) {
  const splitedString = str.split('_')
  const splitedPascalCase = splitedString.map((name) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  })
  const pascalCase = splitedPascalCase.join('')
  return pascalCase
}

// Function to mount fields with their default values.
// attr1: default_value1,
// attr2: default_value2
function defaulFieldsValue(fields) {
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

// Function to mount a list of attrs using prefix and suffix. Example with prefix data. and suffix .name.
// data.attr1.name,
// data.attr2.name
function listOfFields(fields, key, value, prefix, between, suffix, separator) {
  return fields
    .map((field, index) => { return `${prefix}${key ? field[key] : ''}${between}${value ? field[value] : ''}${suffix}${index + 1 == fields.length ? '' : separator}`})
    .join('')
}

// Function to mount a list of ecto schema fields.
// field :attr1, :integer
// field :attr2, :string
function ectoSchemaFields(fields) {
  const types = {
    string: 'string',
    integer: 'integer',
    boolean: 'boolean',
    list: 'to be defined',
    object: 'to be defined',
    atom: 'string'
  }

  return fields.map((field, index) => {return `field :${field.name}, :${types[field.type]}${index + 1 == fields.length ? '' : '\n'}`}).join('')
}

function ectoValidationRequiredFields(fields) {
  let result = fields.filter((field) => {return field.required})
  return listOfFields(result, 'name', '', ':', '', '', ', ')
}

// Function to mount fields with their default values.
// attr1: attr1,
// attr2: attr2
function fillFields(fields) {
  return fields.map((field, index) => { return `${field.name}: ${field.name} || %__MODULE__{}.${field.name}${index + 1 == fields.length ? '' : ',\n'}`}).join('')
}

function useSpecifiedDefaulValue(value) {
  return !value || value === '-' ? false : value
}

function prepareFields(fieldsData) {
  let fields = JSON.parse(fieldsData)
  let parseStringMarkers = fields.map((v) => {
    let parsed = v

    for (let key in parsed) {
      if (typeof parsed[key] === 'string') {
        parsed[key] = parsed[key].replace(/_dq_/g, '"').replace(/_sq_/g, "'").replace(/_cq_/g, "`")
      }
    }

    return parsed
  })
  
  return parseStringMarkers.map(field => {
    return {
      name: useSpecifiedDefaulValue(field.name) || '',
      type: useSpecifiedDefaulValue(field.type) || 'string',
      default: useSpecifiedDefaulValue(field.default) || undefined,
      required: useSpecifiedDefaulValue(field.required),
      validValue: useSpecifiedDefaulValue(field.validValue) || '',
      diffRuleValidValue: useSpecifiedDefaulValue(field.diffRuleValidValue) || '',
      invalidTypeValue: useSpecifiedDefaulValue(field.invalidTypeValue) || '',
      invalidValue: useSpecifiedDefaulValue(field.invalidValue) || '',
    }
  })
}


// ================================================================
// ----------------------- MOUNTING -------------------------------
// ================================================================

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
    .pipe(replace(NEW_STRUCT_FIELD_MARKER, defaulFieldsValue(preparedFields)))
    .pipe(replace(NEW_CREATE_FUNCTION_ARGS_MARKER, listOfFields(preparedFields, 'name', '', '', '', ',', ' ')))
    .pipe(replace(NEW_MODULE_FIELD_MARKER, fillFields(preparedFields)))
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
    .pipe(replace(NEW_RULE_ENTITY_FACTORY_FIELD_MARKER, listOfFields(preparedFields, 'name', '', 'rule.', '', '', ',\n')))
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
    .pipe(replace(NEW_ECTO_VALIDATOR_SCHEMA_FIELD_MARKER, ectoSchemaFields(preparedFields)))
    .pipe(replace(NEW_ECTO_VALIDATOR_CAST_FIELD_MARKER, listOfFields(preparedFields, 'name', '', ':', '', '', ',\n')))
    .pipe(replace(NEW_ECTO_VALIDATOR_REQUIRED_FIELD_MARKER, ectoValidationRequiredFields(preparedFields)))
    .pipe(rename(function (path) {
      path.basename = argv.entityName + '_rule_ecto_validator'
    }))
    .pipe(gulp.dest(`${argv.destinationPath}/lib/${argv.projectName}/domain/${argv.entityName}/validator/`))
}

function mountRuleEntityTestFile() {
  const origin = `${argv.templatePath}/test/(project)/domain/(entity)/entity/(entity)_rule_test.exs`
  
  let preparedFields = prepareFields(argv.fields)

  return gulp.src(origin)
    .pipe(replace('{ProjectName}', `${snakeToPascalCase(argv.projectName)}`))
    .pipe(replace('{EntityName}', `${snakeToPascalCase(argv.entityName)}`))
    .pipe(replace('{entity_name}', `${argv.entityName}`))
    .pipe(replace(VALID_ATTR_FIELDS_MARKER, listOfFields(preparedFields, 'name', '', 'ctx.valid_attrs.', '', ',', '\n')))
    .pipe(replace(VALID_FIELD_VALUE_MARKER, listOfFields(preparedFields, 'name', 'validValue', '', ': ', ',', '\n')))
    .pipe(replace(NIL_FIELDS_MARKER, listOfFields(preparedFields, '', '', 'nil', '', ',', '\n')))
    .pipe(replace(DEFAULT_FIELDS_VALUE_MARKER, listOfFields(preparedFields, 'name', 'default', '', ': ', ',', '\n')))
    .pipe(replace(INLINE_NIL_FIELDS_MARKER, listOfFields(preparedFields, '', '', 'nil', '', ',', ' ')))
    .pipe(replace(INLINE_INVALID_FIELDS_MARKER, listOfFields(preparedFields, '', 'invalidTypeValue', '', '', ',', ' ')))
    .pipe(replace(NIL_KEYS_FIELDS_MARKER, listOfFields(preparedFields, 'name', '', '', '', ': nil,', '\n')))
    .pipe(replace(INVALID_FIELDS_VALUES_MARKER, listOfFields(preparedFields, '', 'invalidValue', '', '', ',', '\n')))
    
    .pipe(rename(function (path) {
      path.basename = argv.entityName + '_rule_test'
    }))
    .pipe(gulp.dest(`${argv.destinationPath}/test/${argv.projectName}/domain/${argv.entityName}/entity/`))
}

function mountPromotionEntityTestFile() {
  const origin = `${argv.templatePath}/test/(project)/domain/(entity)/entity/(entity)_promotion_test.exs`

  return gulp.src(origin)
    .pipe(replace('{ProjectName}', `${snakeToPascalCase(argv.projectName)}`))
    .pipe(replace('{EntityName}', `${snakeToPascalCase(argv.entityName)}`))
    .pipe(replace('{entity_name}', `${argv.entityName}`))
    .pipe(rename(function (path) {
      path.basename = argv.entityName + '_promotion_test'
    }))
    .pipe(gulp.dest(`${argv.destinationPath}/test/${argv.projectName}/domain/${argv.entityName}/entity/`))
}

// ================================================================
// ----------------------- EDITIONS -------------------------------
// ================================================================
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
          let data = p.split('=')
          let attr = data[0]
          let value = data[1]
          
          if (['L', 'P'].includes(attr)) {
            value = Number(value)
          }

          acc[attr] = value
          return acc
        }, {marker: marker})
  } catch (e) {
    console.error('ERROR GETTING MARKER PARAMETERS', e)
  }
  return parameters
}

function editLine(fileContent, newContents, markerSeparator) {
  
  const inlineMarker = EDIT_ADD_INLINE_CONTENT_MARKER
  const blockMarker = EDIT_FILE_ADD_BLOCK_MARKER
  
  let lines = fileContent.split('\n')
  let result = lines

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf(inlineMarker) >= 0) {
      let parameters = getMarkerParameters(lines[i], inlineMarker)
      result[i + parameters.L] = (lines[i + parameters.L].slice(0, parameters.P) + newContents[0] + lines[i + parameters.L].slice(parameters.P))
      newContents = newContents.slice(1)

    } else if (lines[i].indexOf(blockMarker) >= 0) {
      let markerIndentation = getMarkerIndentation(lines[i], blockMarker)
      let minSpaceIndentation = getMinSpaceIndentation(newContents[0])
      let indentedContent = indentContent(newContents[0], markerIndentation, minSpaceIndentation)

      newContents = newContents.slice(1)

      result[i] = (lines[i].replace(blockMarker, indentedContent + markerSeparator + indent(markerIndentation) + blockMarker))
    }
  }

  return result.join('\n')
}

function editFile(folderPath, filename, modifierFunction) {
  return gulp.src(folderPath + filename)
    .pipe(
      modifier(modifierFunction)
    )
    .pipe(gulp.dest(folderPath))
}

function editIPromotionFactory() {
  const folderPath = `${argv.destinationPath}/lib/${argv.projectName}/domain/promotion/factory/`
  const filename = 'i_promotion_factory.ex'

  const modifierFunction = (contents, path) => {
    let pascalEntityName = snakeToPascalCase(argv.entityName)

    let newInlineContents = 
      [
        `${pascalEntityName}.Entity.${pascalEntityName}Promotion,
    ${pascalEntityName}.Entity.${pascalEntityName}Rule,
    `,
        `${pascalEntityName}Promotion | `,
        `${pascalEntityName}Rule | `
      ]

    let contentEdited = editLine(contents, newInlineContents, '\n')
      
    return contentEdited
  }

  return editFile(folderPath, filename, modifierFunction)
}

function editStorePromotionsEntity() {
  
  const folderPath = `${argv.destinationPath}/lib/${argv.projectName}/domain/store_promotions/entity/`
  const filename = 'store_promotions.ex'

  const modifierFunction = (contents, path) => {
    let newInlineContents = [
      `
      alias ${snakeToPascalCase(argv.projectName)}.Domain.${snakeToPascalCase(argv.entityName)}.Entity.${snakeToPascalCase(argv.entityName)}Promotion`,
      `
    @spec set_${argv.entityName}(%__MODULE__{}, ${snakeToPascalCase(argv.entityName)}Promotion.t()) :: %__MODULE__{}
    def set_${argv.entityName}(store_promotions, ${argv.entityName}), do: %{store_promotions | ${argv.entityName}: ${argv.entityName}}
`
    ]

    let contentEdited = editLine(contents, newInlineContents, '\n')
    return contentEdited
  }

  return editFile(folderPath, filename, modifierFunction)
}

function editStorePromotionsFactory() {
  
  const folderPath = `${argv.destinationPath}/lib/${argv.projectName}/domain/store_promotions/factory/`
  const filename = 'store_promotions_factory.ex'

  const modifierFunction = (contents, path) => {
    let newInlineContents = [
      `
      alias ${snakeToPascalCase(argv.projectName)}.Domain.${snakeToPascalCase(argv.entityName)}.Entity.${snakeToPascalCase(argv.entityName)}Promotion`,
      `
      alias ${snakeToPascalCase(argv.projectName)}.Domain.${snakeToPascalCase(argv.entityName)}.Factory.${snakeToPascalCase(argv.entityName)}Factory`,
      `
      |> set_promotion(params, :${argv.entityName})`
    ]

    let contentEdited = editLine(contents, newInlineContents, '\n')
    return contentEdited
  }

  return editFile(folderPath, filename, modifierFunction)
}

function editTestHelper() {
  
  const folderPath = `${argv.destinationPath}/test/support/`
  const filename = 'test_helper.ex'

  const modifierFunction = (contents, path) => {

    let preparedFields = prepareFields(argv.fields)

    let newInlineContents = [
      `
      def valid_${argv.entityName}_promotion_attrs do
        %{
          id: "ca0f4590-246c-11ed-861d-0242ac120000",
          active: false,
          rules: ${argv.entityName}_rules_list(),
          inserted_at: "3022-10-10T13:24:25Z",
          updated_at: "3022-10-11T13:24:25Z"
        }
      end
      `,
      `
defp ${argv.entityName}_rules_list do
  [
    valid_${argv.entityName}_rule_attrs(),
    %{valid_${argv.entityName}_rule_attrs() |
      id: "ca0f4590-246c-11ed-861d-0242ac120000",
      description: "Payment method promotion for Christmas.",
      min_price_value: 10000,
      ${listOfFields(preparedFields, 'name', 'diffRuleValidValue', '', ': ', ',', '\n')}
      apply_to: :specific_products,
      products_id: ["ca0f4590-246c-11ed-861d-0242ac120000", "ca0f4590-246c-11ed-861d-0242ac120001"],
      categories_id: [],
      remaining_quantity: nil,
      quantity_used: 5,
      active: true,
      start_date: "3022-10-10T13:24:25Z",
      end_date: "3022-10-11T13:24:25Z",
      inserted_at: "3022-10-10T13:24:25Z",
      updated_at: "3022-10-11T13:24:25Z"
    }
  ]
end
`,
      `
def valid_${argv.entityName}_rule_attrs do
  %{
    id: "ba0f4590-246c-11ed-861d-0242ac120001",
    description: "Promotion for Carnaval.",
    min_price_value: 10000,
    ${listOfFields(preparedFields, 'name', 'validValue', '', ': ', ',', '\n')}
    apply_to: :specific_categories,
    products_id: [],
    categories_id: ["ba0f4590-246c-11ed-861d-0242ac120000", "ba0f4590-246c-11ed-861d-0242ac120001"],
    remaining_quantity: 10,
    quantity_used: 0,
    active: true,
    start_date: "3022-10-10T13:24:25Z",
    end_date: "3022-10-11T13:24:25Z",
    inserted_at: "3022-10-10T13:24:25Z",
    updated_at: "3022-10-11T13:24:25Z"
  }
end
`
    ]

    let contentEdited = editLine(contents, newInlineContents, '\n')
    return contentEdited
  }

  return editFile(folderPath, filename, modifierFunction)
}

export const mountEntity = gulp.parallel(
  mountPromotionEntityFile,
  mountRuleEntityFile,
  mountPromotionEntityFactoryFile,
  mountPromotionEntityValidatorFactoryFile,
  mountRuleEntityValidatorFactoryFile,
  mountPromotionEntityEctoValidatorFile,
  mountRuleEntityEctoValidatorFile,
  mountPromotionEntityTestFile,
  mountRuleEntityTestFile,
  editTestHelper,
  editIPromotionFactory,
  editStorePromotionsEntity,
  editStorePromotionsFactory 
)