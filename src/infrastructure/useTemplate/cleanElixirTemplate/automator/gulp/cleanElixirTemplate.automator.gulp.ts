import UseCleanElixirTemplate from "../../../../../domain/useCleanElixirTemplate/valueObject/useCleanElixirTemplate";
import CleanElixirTemplateWorkflowAutomatorInterface from "../../../../../domain/useCleanElixirTemplate/workflowAutomator/cleanElixirTemplate.workflowAutomator.interface";

const { exec } = require('child_process')
const rootContainerFolder = process.cwd()

export default class CleanElixirTemplateWorkflowAutomator implements CleanElixirTemplateWorkflowAutomatorInterface {

  async copyAndFill(component: UseCleanElixirTemplate): Promise<string> {
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