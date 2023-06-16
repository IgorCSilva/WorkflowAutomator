
import addPromotionType from './addNewType/add/cli/index.js'

const createCLI = (commandsCreator, answerGrouper) => {

  addPromotionType.createCLI(commandsCreator, answerGrouper)
}

export default {
  createCLI
}