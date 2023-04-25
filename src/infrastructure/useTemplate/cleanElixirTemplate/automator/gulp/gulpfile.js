const { src, dest, parallel } = require('gulp')
const rename = require('gulp-rename')
const replace = require('gulp-replace');

const argv = require('yargs').argv

const NEW_STRUCT_FIELD_MARKER = '# (NEW_STRUCT_FIELD_MARKER)'
const NEW_TYPE_DEFINITION_FIELD_MARKER = '# (NEW_TYPE_DEFINITION_FIELD_MARKER)'
const NEW_MODULE_FIELD_MARKER = '# (NEW_MODULE_FIELD_MARKER)'

function snakeToPascalCase(str) {
  console.log(str)
  const splitedString = str.split('_')
  const splitedPascalCase = splitedString.map((name) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  })
  const pascalCase = splitedPascalCase.join('')
  return pascalCase
}

function defaulFieldValue(name, type) {
  const types = {
    string: '\"\"',
    integer: 0,
    boolean: 'false',
    list: '[]',
    object: '%{}',
    atom: 'nil'
  }

  return `${name}: ${types[type]}` 
}

function typeDefinition(name, type) {
  const types = {
    string: 'String.t()',
    integer: 'integer()',
    boolean: 'boolean()',
    list: 'list()',
    object: 'map()',
    atom: 'atom()'
  }

  return `${name}: ${types[type]}`
}

function fillModuleField(name, type) {
  return `${name}: ${argv.entityName}.${name}`
}

function mountFields(fieldsData, conversionFunc) {
  let fields = fieldsData.split(',')
  console.log(conversionFunc('string'))
  let splitedField = []
  let result = ''

  fields.forEach((field, index) => {
    splitedField = field.trim().split(' ')

    result = result + (index ? '    ' : '') + conversionFunc(splitedField[0], splitedField[1]) + (index + 1 == fields.length ? '' : ',\n')
  });

  return result
}

function mountEntity() {
  const origin = `${argv.templatePath}/(project)/domain/(entity)/entity/(entity).ex`
  
  return src(origin)
    .pipe(replace('{ProjectName}', `${snakeToPascalCase(argv.projectName)}`))
    .pipe(replace('{EntityName}', `${snakeToPascalCase(argv.entityName)}`))
    .pipe(replace('{entity_name}', `${argv.entityName}`))
    .pipe(replace(NEW_STRUCT_FIELD_MARKER, mountFields(argv.fields, (name, type) => defaulFieldValue(name, type))))
    .pipe(replace(NEW_TYPE_DEFINITION_FIELD_MARKER, mountFields(argv.fields, (name, type) => typeDefinition(name, type))))
    .pipe(replace(NEW_MODULE_FIELD_MARKER, mountFields(argv.fields, (name, type) => fillModuleField(name, type))))
    .pipe(rename(function (path) {
      path.basename = argv.entityName
    }))
    .pipe(dest(`${argv.destinationPath}/${argv.projectName}/domain/${argv.entityName}/entity/`))
}

function mountEntityValidator() {
  const origin = `${argv.templatePath}/(project)/domain/(entity)/validator/(validator).ex`

  return src(origin)
    .pipe(replace('{ProjectName}', `${snakeToPascalCase(argv.projectName)}`))
    .pipe(replace('{EntityName}', `${snakeToPascalCase(argv.entityName)}`))
    .pipe(rename(function (path) {
      path.basename = argv.entityName + '_ecto_validator'
    }))
    .pipe(dest(`${argv.destinationPath}/${argv.projectName}/domain/${argv.entityName}/validator/`))
}

exports.mountEntity = parallel(mountEntity, mountEntityValidator)