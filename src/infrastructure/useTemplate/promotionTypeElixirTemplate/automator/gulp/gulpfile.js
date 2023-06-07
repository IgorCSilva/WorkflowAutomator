import gulp from 'gulp'
import rename from 'gulp-rename'
import replace from 'gulp-replace';

import yargs from 'yargs/yargs';

const argv = yargs(process.argv).parseSync();

const NEW_STRUCT_FIELD_MARKER = '# (NEW_STRUCT_FIELD_MARKER)'
const NEW_CREATE_FUNCTION_ARGS_MARKER = '(NEW_CREATE_FUNCTION_ARGS_MARKER)'
const NEW_MODULE_FIELD_MARKER = '# (NEW_MODULE_FIELD_MARKER)'
const NEW_RULE_ENTITY_FACTORY_FIELD_MARKER = '(NEW_RULE_ENTITY_FACTORY_FIELD_MARKER)'
const NEW_ECTO_VALIDATOR_SCHEMA_FIELD_MARKER = '(NEW_ECTO_VALIDATOR_SCHEMA_FIELD_MARKER)'
const NEW_ECTO_VALIDATOR_CAST_FIELD_MARKER = '(NEW_ECTO_VALIDATOR_CAST_FIELD_MARKER)'
const NEW_ECTO_VALIDATOR_REQUIRED_FIELD_MARKER = '(NEW_ECTO_VALIDATOR_REQUIRED_FIELD_MARKER)'

function snakeToPascalCase(str) {
  console.log(str)
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

  return fields.map((field, index) => { return `${field.name}: ${types[field.type]}${index + 1 == fields.length ? '' : ',\n'}` }).join('')
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

function useDefaulFieldValue(value) {
  return !value || value === '-' ? false : value
}

function prepareFields(fieldsData) {
  let fields = fieldsData.split(',')
  return fields.map(field => {
    let fieldSpecifications = field.trim().split(' ')
    return {
      name: useDefaulFieldValue(fieldSpecifications[0]) || '',
      type: useDefaulFieldValue(fieldSpecifications[1]) || 'string',
      default: useDefaulFieldValue(fieldSpecifications[2]) || '',
      required: useDefaulFieldValue(fieldSpecifications[3]) === 'true' ? true : false 
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

export const mountEntity = gulp.parallel(
  mountPromotionEntityFile,
  mountRuleEntityFile,
  mountPromotionEntityFactoryFile,
  mountPromotionEntityValidatorFactoryFile,
  mountRuleEntityValidatorFactoryFile,
  mountPromotionEntityEctoValidatorFile,
  mountRuleEntityEctoValidatorFile
)