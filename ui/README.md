# MADOC

> Se você deseja apenas utilizar a biblioteca em seu projeto, **não é necessário conhecer o framework angular**. Tudo o que você precisa, está contido no arquivo testeapi.html
>
> Para obter uma explicação detalhada de como funciona a interação entre sua aplicação e o madoc, leia as instruções disponíveis em [`api`](#API).


## Visão geral

Este projeto abrange:

- uma aplicação madoc-app, que se constitui em aplicação exemplo para aqueles que desejem desenvolver uma aplicação que utilize a biblioteca  madoc-ui;
- o engine madoc, que é utilizado pela aplicação exemplo para processar os arquivos madoc;
- a biblioteca madoc-ui, que permite editar documentos no formato madoc
- a biblioteca madoc-extras, que oferece componentes e serviços utilizados na aplicação madoc-app e que também podem ser utilizadas caso seja de interesse do desenvolvedor, embora não sejam requeridas pela biblioteca madoc-ui.

## Aplicação exemplo

### Dependências
- node
- npm
- angular-cli
- java
- maven


### Iniciando o projeto

Depois de baixar esse projeto, são necessárias algumas ações para deixá-lo pronto para ser executado.

Para facilitar essa configuração inicial, execute o script abaixo:

    setup.sh ou setup.bat

### Executando o projeto

Você tem <strong>duas opções</strong>.


#### para executar apenas

Em um terminal, execute:

    run.sh ou run.bat

    abra o browser e digite: http://localhost:8080/madoc/testeapi.html

#### para desenvolvimento

Em um terminal, execute o servidor no diretório <em>madoc-editor</em>:

    mvn exec:java

Em outra janela de terminal, preferencialmente no próprio editor, execute o cliente no diretório <em>ui</em>:

    npm start

    abra o browser e digite: http://localhost:4200/madoc/testeapi.html

### Atualizando o projeto

Sempre que for baixada uma nova versão, lembre-se de executar o passo "Iniciando o projeto"


