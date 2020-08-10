package br.gov.lexml.madoc.server.catalog;

import java.io.Serializable;
import java.util.List;

import javax.xml.transform.URIResolver;

import br.gov.lexml.madoc.server.MadocException;
import br.gov.lexml.madoc.server.catalog.sdleg.MadocUrnResolver;

public interface CatalogService extends MadocUrnResolver, Serializable {

	/**
	 * Returns the list of ModelInfo containing catalog's MadocDocumentType information.
	 * @return
	 * @throws MadocException
	 */
	List<ModelInfo> getAvailableMadocDocumentModels() throws MadocException;

	/**
	 * Fetch all items non-obsoletes from repository to cache.
	 */
	void fetchAll() throws MadocException;

	/**
	 * Fetch a model from repository to cache.
	 * @param modelId
	 * @throws MadocException
	 */
	void fetchModel(String modelId) throws CatalogException;

	MadocDocumentModelData getMadocDocumentModel(String modelId)
			throws CatalogException;

	MadocSkeletonModelData getMadocSkeletonModel(String modelId)
			throws CatalogException;

	MadocLibraryModelData getMadocLibraryModel(String modelId)
			throws CatalogException;

	ResourceEntityModelData getResourceModel(String modelId)
			throws CatalogException;

	/*
	 * URIResolver methods
	 */
	void setURIResolver(URIResolver uriResolver);

	URIResolver getURIResolver();

	/*
	 * Event Listener methods
	 */

	void addCatalogEventListener(CatalogEventListener cel);

	void removeCatalogEventListener(CatalogEventListener cel);

}
