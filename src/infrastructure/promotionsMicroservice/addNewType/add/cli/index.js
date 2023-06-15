#! /usr/bin/env node

import { exec } from 'child_process'

const createCLI = (commandsCreator, answerGrouper) => {
  async function action () {
    // const options = program.opts();
    // console.log(options, options.doc)

    // if (options.doc) {
    //   console.log('SHOW DOC')
    //   return
    // }

    const entityName = await answerGrouper.ask('What is the promotion type name?');

    // TODO: pegar tipos disponíveis da camada de domínio.
    const options = [
      {
        name: 'string',
        value: 'string'
      },
      {
        name: 'integer',
        value: 'integer'
      },
      {
        name: 'boolean',
        value: 'boolean'
      }
    ]
    
    let fields = []
    let field = {}
    let addNewField = false

    do {
      field = {}
      field.name = await answerGrouper.ask('What is the field name?')
      field.type = await answerGrouper.uniqueOption('Select the field type:', options)
      field.default = await answerGrouper.ask('Type a default value:')
      field.validValue = await answerGrouper.ask('Type any valid value (how about a different value from defaul?):')
      field.diffRuleValidValue = await answerGrouper.ask('Type any valid value to a different rule:')
      field.invalidValue = await answerGrouper.ask('Now type any invalid value wiht correct type:')
      field.required = await answerGrouper.createConfirm('Is this field required?')
      field.invalidTypeValue = await answerGrouper.ask('Type any value with different type:')
      
      fields.push(field)

      addNewField = await answerGrouper.createConfirm('Add new field?')
    } while(addNewField)

    const destinationPath = await answerGrouper.ask("What is the project destination path?");

    const rootContainerFolder = process.cwd()

    const encodedFields = JSON
        .stringify(fields)
        .replace(/"/g, "double_quote")
        .replace(/'/g, "single_quote")

    exec(`npx ts-node ${rootContainerFolder}/src/infrastructure/useTemplate/promotionTypeElixirTemplate/cli/commander/promotionTypeElixirCommander.ts --destinationPath /${rootContainerFolder}/${destinationPath} --projectName promotions --entityName ${entityName} --fields ${encodedFields}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }

      console.log(`stdout in index commander:\n${stdout}`);
    });
  }

  commandsCreator.create(
    'add-promotion-type',
    'addNewPromotionType',
    'Add a new promotion type.\nAll needed files to implement a new promotion type are created and some files in the project folder is updated too.',
    action
  )
}

export default {
  createCLI
}