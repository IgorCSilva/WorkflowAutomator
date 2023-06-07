#! /usr/bin/env node

import PromotionTypeElixirTemplateWorkflowAutomator from '../../automator/gulp/promotionTypeElixirTemplate.automator.gulp';
import CopyAndFillPromotionTypeElixirTemplateUsecase from '../../../../../application/useTemplate/promotionTypeElixirTemplate/copyAndFill.promotionTypeElixirTemplate.usecase';

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

  // Criar automator e passar para o caso de uso.
  const automator = new PromotionTypeElixirTemplateWorkflowAutomator()
  const cleanElixirCopyAndFillUsecase = new CopyAndFillPromotionTypeElixirTemplateUsecase(automator)

  try {
    const result = await cleanElixirCopyAndFillUsecase.execute(params)
    console.log('USECASE RESULT: ', result)
  } catch (err) {
    console.log(err)
  }
}

execute()