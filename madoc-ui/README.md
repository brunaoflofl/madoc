# MADOC-UI

> Se você deseja apenas utilizar a biblioteca em seu projeto, **não é necessário conhecer o framework angular**. Tudo o que você precisa, está contido no arquivo testeapi.html
>
> Para obter uma explicação detalhada de como funciona a interação entre sua aplicação e o madoc, leia as instruções disponíveis em [`api`](#api).


## Visão geral

Este projeto abrange:
- uma aplicação madoc-app, que se constitui em aplicação exemplo para aqueles que desejem desenvolver uma aplicação que utilize a biblioteca  madoc-ui;
- a biblioteca madoc-ui, que permite editar documentos no formato madoc
- a biblioteca madoc-extras, que oferece componentes e serviços utilizados na aplicação madoc-app e que também podem ser utilizadas caso seja de interesse do desenvolvedor, embora não sejam requeridas pela biblioteca madoc-ui.

## Rodando a aplicação exemplo

Dependências obrigatórias
- node
- npm

Dependências opcionais
- maven
- angular-click

## Iniciando/Instalando o projeto

Se usou o start.sh ou start.bat na raiz do projeto, você já está pronto.

Se não, rode:

    npm install
    npm run lib

## Executando o projeto

Você tem duas opções rodar só o projeto ui no terminal e em outro rodar o projeto madoc-editor, usando:

    npm run serverless

No outro terminal

    cd ../madoc-editor
    mvn exec:java

Ou você pode rodar tudo no mesmo terminal rodando:

    npm start

##Atualizando o projeto

    npm install