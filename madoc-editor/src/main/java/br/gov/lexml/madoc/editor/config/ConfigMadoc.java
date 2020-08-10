package br.gov.lexml.madoc.editor.config;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.gov.lexml.madoc.server.catalog.CatalogException;
import br.gov.lexml.madoc.server.catalog.CatalogService;
import br.gov.lexml.madoc.server.catalog.CatalogServiceFactory;
import br.gov.lexml.madoc.server.catalog.local.LocalCatalogServiceBuilder;

@Configuration
public class ConfigMadoc {

	@Value("${madoc.editor.path.modelos:./modelos}")
	private String pathModelos;

	@Bean
	public CatalogService createCatalogService() throws CatalogException {
		File dirModelos = new File(pathModelos);
		CatalogServiceFactory f = new LocalCatalogServiceBuilder(dirModelos, "urn:sf:sistema;madoc:id;local-catalog");
		return f.createCatalogService();
	}

}
