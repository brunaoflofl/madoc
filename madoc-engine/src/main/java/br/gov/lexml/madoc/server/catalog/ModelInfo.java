package br.gov.lexml.madoc.server.catalog;

import java.io.Serializable;

import org.apache.commons.lang3.builder.ToStringBuilder;

import br.gov.lexml.madoc.server.schema.entity.CatalogItemType;
import br.gov.lexml.madoc.server.schema.entity.MetadataType;

public class ModelInfo implements Serializable {

	private final String modelId;
	private final MetadataType metadata;
	private final String docUri;
	private CatalogItemType catalogItem;

	public ModelInfo(String docUri, String modelId, MetadataType metadata) {
		super();
		this.modelId = modelId;
		this.metadata = metadata;
		this.docUri = docUri;
	}

	public ModelInfo(String docUri, String modelId, MetadataType metadata, CatalogItemType catalogItem) {
		super();
		this.modelId = modelId;
		this.metadata = metadata;
		this.docUri = docUri;
		this.catalogItem = catalogItem;
	}

	public String getModelId() {
		return modelId;
	}

	public MetadataType getMetadata() {
		return metadata;
	}

	public String getUri(){
		return docUri;
	}

	public void setCatalogItem(CatalogItemType catalogItem) {
		this.catalogItem = catalogItem;
	}

	public CatalogItemType getCatalogItem() {
		return catalogItem;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

}
