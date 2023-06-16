#! /usr/bin/env node

import PromotionTypeElixirTemplateWorkflowAutomator from '../../automator/gulp/promotionTypeElixirTemplate.automator.gulp';
import CopyAndFillPromotionTypeElixirTemplateUsecase from '../../../../../application/useTemplate/promotionTypeElixirTemplate/copyAndFill.promotionTypeElixirTemplate.usecase';

import yargs from 'yargs/yargs';
const argv = yargs(process.argv).argv;

const execute = async () => {
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
    console.info('USECASE RESULT: ', result)
  } catch (err) {
    console.error(err)
  }
}

execute()