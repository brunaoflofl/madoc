Mecanismo de processamento de XML e PDF do MADOC
=====

# Release e deploy do madoc-engine.jar no BinTray.com 

Adicionar credenciais no .m2/settings.xml. Deve ser usada a chave da API, não a senha do Bintray.

	<server>
		<id>bintray-lexml-lexml</id>
		<username>nome_de_usuario</username>
		<password>**********</password>
	</server>

Conferir se não há alteração no código em relação à origem

	git status

Rodar na raiz do projeto (fora do diretório madoc-engine)

	mvn release:prepare release:perform
	git push --tags
	
