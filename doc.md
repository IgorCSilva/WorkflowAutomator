# Inicializando projeto

- Inicializando:
`npm init`

- Instalando o typescript:
`npm i typescript --save-dev`

- Configurando o typescript:
`npx tsc --init`

No arquvo tsconfig.json gerado:
- descomentar o incremental: true
- "outDir": "./dist", 
- adicionar no final:
  ,
  "include": [
    "src/**/*.ts"
  ]

Instalando o tsling:
`npm install tslint --save-dev`

Gerar o arquivo tslint:
`npx tslint --init`

Instalando bibliotecas de typescript para testes e validação de sintaxe.
`npm install -D jest @types/jest ts-node --save-dev`

Instalando bibliotecas para compilar e se trabalhar com testes de forma mais rápida:
`npm install -D  @swc/jest @swc/cli @swc/core`

Inicializando o jest:
`npx jest --init`

Abaixo temos as perguntas respondidas para a criação do arquivo jest.config.ts:
✔ Would you like to use Jest when running "test" script in "package.json"? … yes
✔ Would you like to use Typescript for the configuration file? … yes
✔ Choose the test environment that will be used for testing › node
✔ Do you want Jest to add coverage reports? … no
✔ Which provider should be used to instrument code for coverage? › v8
✔ Automatically clear mock calls, instances, contexts and results before every test? … yes

Adicionar o transformer no arquivo jest.config.ts para pegar todos os arquivos ts, js, tsx e jsx para executar o jest:
```ts
  transform: {
    "^.+\.(t|j)sx?$": ["@swc/jest"]
  },
```

Alterando o package.json para compilação e execução dos testes:
```json
  "scripts": {
    "test": "npm run tsc -- --noEmit && jest",
    "tsc": "tsc"
  },
```


Instalando biblioteca para validações:
`npm install -S yup`

Após implementar algum código, compilar o projeto executando:
`npx tsc`

Neste momento a pasta dist deve ser criada.




## Comand example
`template copyAndFill result/output big_car seat "widht integer, height integer"`