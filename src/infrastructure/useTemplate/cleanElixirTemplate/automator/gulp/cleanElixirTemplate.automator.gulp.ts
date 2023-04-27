import UseCleanElixirTemplate from "../../../../../domain/useCleanElixirTemplate/valueObject/useCleanElixirTemplate";
import CleanElixirTemplateWorkflowAutomatorInterface from "../../../../../domain/useCleanElixirTemplate/workflowAutomator/cleanElixirTemplate.workflowAutomator.interface";

import { exec } from 'child_process'
const rootContainerFolder = process.cwd()

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default class CleanElixirTemplateWorkflowAutomator implements CleanElixirTemplateWorkflowAutomatorInterface {

  async copyAndFill(component: UseCleanElixirTemplate): Promise<string> {
    console.log('AUTOMATOR', component)
    return new Promise<string>((resolve, reject) => {
      exec(`cd ${__dirname} && gulp mountEntity --templatePath /${rootContainerFolder}/${component.templatePath} --destinationPath ${component.destinationPath} --projectName ${component.projectName} --entityName ${component.entityName} --fields "${component.fields}"`, async (error: any, stdout: any, stderr: any) => {
        if (error) {
            console.log(`error: ${error.message}`);
            reject('error')
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            reject('stderr')
        }
        console.log(`stdout: ${stdout}`);
  
        resolve('Successfully!')
      });
    })
  }
}