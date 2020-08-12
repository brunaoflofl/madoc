package br.gov.lexml.madoc.server.catalog;



public interface CatalogServiceFactory {
	
	CatalogService createCatalogService() throws CatalogException;
	
}
