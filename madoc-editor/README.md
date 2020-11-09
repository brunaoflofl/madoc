# MADOC-Editor Exemplo

## Iniciando/Instalando o projeto

Se usou o start.sh ou start.bat na raiz do projeto, você já está pronto.

Se não, rode:

    mvn clean instal
    mvn clean package

## Executando o projeto

	cd madoc-editor
	mvn exec:java

A aplicação roda em http://localhost:8080

## API REST

Obter catálogo de modelos

	GET /madoc/api/modelos/<tipo-de-documento>

Obter dados de teste em Json

	GET /madoc/api/dados/json/<nome-do-arquivo>

Obter dados de teste em XML

	GET /madoc/api/dados/xml/<nome-do-arquivo>

Novo documento (obter modelo)

	GET /madoc/api/novo/<codigo-do-modelo>

Abrir

	GET /madoc/api/abrir?openUrl=<url para abrir o documento>

Salvar

	POST /madoc/api/salvar
	
	Exemplo de requisição em /dados/salvar-req.json

Gerar PDF (retorna nome do arquivo para download)

	POST /madoc/api/gerarpdf
	
	Exemplo de requisição em /dados/gerarpdf-req.json

Download/Obter PDF

	GET /madoc/api/getpdf/<nome do arquivo do gerarpdf>/<nome para download>


## Configuração (com valores default)

Diretório com os modelos

	madoc.editorExemplo.path.modelos=./modelos
	
Diretório com os dados de teste

	madoc.editorExemplo.path.dados=./dados

	