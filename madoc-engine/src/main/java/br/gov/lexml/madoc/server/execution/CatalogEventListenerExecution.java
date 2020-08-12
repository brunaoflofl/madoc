package br.gov.lexml.madoc.server.execution;

import java.io.Serializable;
import java.util.Set;
import java.util.TreeSet;

import br.gov.lexml.madoc.server.catalog.DefaultCatalogEventListener;
import br.gov.lexml.madoc.server.schema.comparators.CatalogItemTypeComparator;
import br.gov.lexml.madoc.server.schema.entity.CatalogItemType;

public class CatalogEventListenerExecution extends DefaultCatalogEventListener implements Serializable {

	private final Set<CatalogItemType> items = new TreeSet<CatalogItemType>(new CatalogItemTypeComparator());

	public Set<CatalogItemType> getItemsVersionResolved(){
		return items;
	}

}
