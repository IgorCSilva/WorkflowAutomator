#! /usr/bin/env node

// Using cli package.
import { Command, Argument } from 'commander'
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
  .name('add-promotion-type')
  .version('1.0.0')
  .command('copyAndFillPromotionType') // parâmetros obrigatórios entre <> e opcionais entre [].
  .description('Add a new promotion type.\nAll needed files to implement a new promotion type are created and some files in the project folder is updated too.') // útil quando utilizamos o --help para saber informações sobre o CLI.
  .argument('<destinationPath>', 'Destination path where created files will be saved.')
  .argument('<projectName>', 'Name of the project.')
  .argument('<entityName>', 'Promotion type name.')
  .argument('[fields]', 'New promotion type fields.')
  // .addArgument(new Argument('<drink-size>', 'drink cup size').choices(['small', 'medium', 'large']))

  .action((destinationPath, projectName, entityName, fields) => {

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