import PromotionTypeElixirTemplate from "../../../../../domain/promotionTypeElixirTemplate/valueObject/promotionTypeElixirTemplate";
import PromotionTypeElixirTemplateWorkflowAutomatorInterface from "../../../../../domain/promotionTypeElixirTemplate/workflowAutomator/promotionTypeElixirTemplate.workflowAutomator.interface";

import { exec } from 'child_process'
const rootContainerFolder = process.cwd()

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default class PromotionTypeElixirTemplateWorkflowAutomator implements PromotionTypeElixirTemplateWorkflowAutomatorInterface {

  async copyAndFill(component: PromotionTypeElixirTemplate): Promise<string> {

    let fields = (component.fields).replace(/double_quote/g, '"').replace(/single_quote/g, "'").replace(/"/g, "\\\"")

    return new Promise<string>((resolve, reject) => {
      exec(`cd ${__dirname} && gulp mountEntity --templatePath /${rootContainerFolder}/${component.templatePath} --destinationPath ${component.destinationPath} --projectName ${component.projectName} --entityName ${component.entityName} --fields ${fields}`, async (error: any, stdout: any, stderr: any) => {
        if (error) {
            console.log(`error: ${error.message}`);
            reject(`error: ${error.message}`)
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            reject(`stderr: ${stderr}`)
        }
        console.log(`stdout: ${stdout}`);
  
        resolve('Successfully!')
      });
    })
  }
}