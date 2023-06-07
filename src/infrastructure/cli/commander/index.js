#! /usr/bin/env node

// Using cli package.
import { Command } from 'commander'
const program = new Command()
import { exec } from 'child_process'

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

program
  .command('copyAndFill <destinationPath> <projectName> <entityName> [fields]') // parâmetros obrigatórios entre <> e opcionais entre [].
  .description('Add a todo') // útil quando utilizamos o --help para saber informações sobre o CLI.
  .action((destinationPath, projectName, entityName, fields) => {
    console.log(destinationPath + ' - destinationPath')
    console.log(projectName + ' - projectName')
    console.log(entityName + ' - entityName')
    console.log(fields + ' - fields')
    // console.log(__dirname + ' - dirname')
    console.log(__filename + ' - filename')


    const rootContainerFolder = process.cwd()
    
    exec(`npx ts-node ${rootContainerFolder}/src/infrastructure/useTemplate/cleanElixirTemplate/cli/commander/cleanElixirCommander.ts --destinationPath /${rootContainerFolder}/${destinationPath} --projectName ${projectName} --entityName ${entityName} --fields \"${fields}\"`, (error, stdout, stderr) => {
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

  })

program
  .command('copyAndFillPromotionType <destinationPath> <projectName> <entityName> [fields]') // parâmetros obrigatórios entre <> e opcionais entre [].
  .description('Add a todo') // útil quando utilizamos o --help para saber informações sobre o CLI.
  .action((destinationPath, projectName, entityName, fields) => {
    console.log(destinationPath + ' - destinationPath new')
    console.log(projectName + ' - projectName new')
    console.log(entityName + ' - entityName new')
    console.log(fields + ' - fields new')
    // console.log(__dirname + ' - dirname new')
    console.log(__filename + ' - filename new')


    const rootContainerFolder = process.cwd()
    
    exec(`npx ts-node ${rootContainerFolder}/src/infrastructure/useTemplate/promotionTypeElixirTemplate/cli/commander/promotionTypeElixirCommander.ts --destinationPath /${rootContainerFolder}/${destinationPath} --projectName ${projectName} --entityName ${entityName} --fields \"${fields}\"`, (error, stdout, stderr) => {
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

  })
program.parse(process.argv)