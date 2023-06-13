import { input } from '@inquirer/prompts';
import select, { Separator } from '@inquirer/select';
import confirm from '@inquirer/confirm';

const ask = (question) => {
  return input({ message: question })
}

const uniqueOption = (title, options) => {
  return select({
    message: title,
    choices: options,
  })
}

const createConfirm = (message) => {
  return confirm({ message: message });
}

export default {
  ask,
  uniqueOption,
  createConfirm
}