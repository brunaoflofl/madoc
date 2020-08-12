package br.gov.lexml.madoc.server.catalog;

import br.gov.lexml.madoc.server.schema.entity.MetadataType;
import br.gov.lexml.madoc.server.schema.entity.ResourceEntity;

public class ResourceEntityModelData extends ModelInfo {

	private final ResourceEntity resource;

	public ResourceEntityModelData(String docUri, String modelId, MetadataType metadata, ResourceEntity resource) {
		super(docUri, modelId, metadata);
		this.resource = resource;
	}

	public ResourceEntity getResourceEntity(){
		return resource;
	}

}
