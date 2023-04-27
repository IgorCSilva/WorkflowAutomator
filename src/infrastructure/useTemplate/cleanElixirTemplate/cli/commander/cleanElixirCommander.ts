#! /usr/bin/env node

import CleanElixirTemplateWorkflowAutomator from '../../automator/gulp/cleanElixirTemplate.automator.gulp';
import CopyAndFillCleanElixirTemplateUsecase from '../../../../../application/useTemplate/cleanElixirTemplate/copyAndFill.cleanElixirTemplate.usecase';

import yargs from 'yargs/yargs';
const argv = yargs(process.argv).parseSync();

const execute = async () => {
  console.log(argv.destinationPath + ' - destinationPath')
  console.log(argv.projectName + ' - projectName')
  console.log(argv.entityName + ' - entityName')
  console.log(argv.fields + ' - fields')

  const params = {
    destinationPath: <string>argv.destinationPath,
    projectName: <string>argv.projectName,
    entityName: <string>argv.entityName,
    fields: <string>argv.fields
  }

  const automator = new CleanElixirTemplateWorkflowAutomator()
  console.log('AUTOMATOR:', automator)

  // Criar automator e passar para o caso de uso.
  const cleanElixirCopyAndFillUsecase = new CopyAndFillCleanElixirTemplateUsecase(automator)
  console.log('USECASE: ', cleanElixirCopyAndFillUsecase)

  console.log('USECASE RESULT: start')
  try {
    const result = await cleanElixirCopyAndFillUsecase.execute(params)
    console.log('USECASE RESULT: ', result)
  } catch (err) {
    console.log(err)
  }
}

execute()