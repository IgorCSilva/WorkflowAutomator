#! /usr/bin/env node

// Using cli package.
import { Command, Argument } from 'commander'
const program = new Command()

const create = (name, command, description, action) => {
  program
    .name(name)
    .version('1.0.0')
    .option('--doc')
    .command(command) // parâmetros obrigatórios entre <> e opcionais entre [].
    .description(description) // útil quando utilizamos o --help para saber informações sobre o CLI.
    // .argument('<destinationPath>', 'Destination path where created files will be saved.')
    // .argument('<projectName>', 'Name of the project.')
    // .argument('<entityName>', 'Promotion type name.')
    // .argument('[fields]', 'New promotion type fields.')
    // .addArgument(new Argument('<drink-size>', 'drink cup size').choices(['small', 'medium', 'large']))

    .action(action)

  program.parse(process.argv)
}

export default {
  create
}

