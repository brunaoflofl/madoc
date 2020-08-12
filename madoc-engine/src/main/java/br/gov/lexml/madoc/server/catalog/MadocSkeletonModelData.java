package br.gov.lexml.madoc.server.catalog;

import br.gov.lexml.madoc.server.schema.entity.MadocSkeletonType;
import br.gov.lexml.madoc.server.schema.entity.MetadataType;

public class MadocSkeletonModelData extends ModelInfo {

	private final MadocSkeletonType docBase;

	public MadocSkeletonModelData(String docUri, String modelId,
			MetadataType metadata, MadocSkeletonType docBase) {
		super(docUri, modelId, metadata);
		this.docBase = docBase;
	}

	public MadocSkeletonType getMadocSkeleton(){
		return docBase;
	}

}
