#! /usr/bin/env node

// Commands maker.
import commandsCreator from './commandsCreator/commander/index.js'

// Answer grouper.
import answerGrouper from './answerGrouper/inquirer/index.js'


import promotionsMicroservice from '../promotionsMicroservice/index.js'


promotionsMicroservice.createCLI(commandsCreator, answerGrouper)