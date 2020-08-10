package br.gov.lexml.madoc.server.catalog;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.gov.lexml.madoc.server.schema.entity.CatalogItemType;

public class CatalogEventLogger implements CatalogEventListener {

	private static final Logger log = LoggerFactory.getLogger(CatalogEventLogger.class);

	@Override
	public void itemRequested(CatalogItemType catalogItem) {
		log.debug("itemRequested: resourceName="+catalogItem.getResourceName()+"; modelVersion="+catalogItem.getVersion());
	}

}
