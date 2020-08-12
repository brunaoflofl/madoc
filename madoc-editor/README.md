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

	GET /api/modelos/<tipo-de-documento>

Obter dados de teste em Json

	GET /api/dados/json/<nome-do-arquivo>

Obter dados de teste em XML

	GET /api/dados/xml/<nome-do-arquivo>

Novo documento (obter modelo)

	GET /api/novo/<codigo-do-modelo>

Abrir

	GET /api/abrir?openUrl=<url para abrir o documento>

Salvar

	POST /api/salvar
	
	Exemplo de requisição em /dados/salvar-req.json

Gerar PDF (retorna nome do arquivo para download)

	POST /api/gerarpdf
	
	Exemplo de requisição em /dados/gerarpdf-req.json

Download/Obter PDF

	GET /api/getpdf/<nome do arquivo do gerarpdf>/<nome para download>


## Configuração (com valores default)

Diretório com os modelos

	madoc.editorExemplo.path.modelos=./modelos
	
Diretório com os dados de teste

	madoc.editorExemplo.path.dados=./dados

	