package br.gov.lexml.madoc.server.catalog;

import java.io.Serializable;

import br.gov.lexml.madoc.server.schema.entity.CatalogItemType;

public interface CatalogEventListener extends Serializable {

	void itemRequested(CatalogItemType catalogItem);

}
