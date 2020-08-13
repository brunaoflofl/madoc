# MADOC-App

> Se você deseja apenas utilizar a biblioteca em seu projeto, **não é necessário conhecer o framework angular**. Tudo o que você precisa, está contido no arquivo testeapi.html
>
> Para obter uma explicação detalhada de como funciona a interação entre sua aplicação e o madoc, leia as instruções disponíveis em [`api`](#api).


## Visão geral

Este projeto abrange:
- o engine madoc, que é utilizado pela aplicação exemplo para processar os arquivos madoc;
- uma aplicação madoc-app, que se constitui em aplicação exemplo para aqueles que desejem desenvolver uma aplicação que utilize a biblioteca  madoc-ui;
- a biblioteca madoc-ui, que permite editar documentos no formato madoc
- a biblioteca madoc-extras, que oferece componentes e serviços utilizados na aplicação madoc-app e que também podem ser utilizadas caso seja de interesse do desenvolvedor, embora não sejam requeridas pela biblioteca madoc-ui.

## Aplicação exemplo

### Dependências obrigatórias
- node
- npm
- java
- maven
- angular-cli

### Iniciando o projeto

Depois de baixar esse projeto, são necessárias algumas ações para deixá-lo pronto para ser executado.

Para facilitar essa configuração inicial, execute o script abaixo:

    start.sh ou start.bat

### Executando o projeto

Você tem <strong>duas opções</strong>.

A primeira seria executar o servidor e o cliente em um único passo, através do comando abaixo no diretório <em>ui</em>:

    npm start

Já se você preferir executar o servidor e o cliente em janelas diferentes, basta proceder da seguinte maneira:

Em um janela de terminal, execute o cliente no diretório <em>ui</em>:

    npm run client

Em outro terminal, execute o servidor no diretório <em>madoc-editor</em>:

    mvn exec:java


### Atualizando o projeto

Sempre que foi baixada uma nova versão, lembre-se de executar o passo "Iniciando o projeto"


