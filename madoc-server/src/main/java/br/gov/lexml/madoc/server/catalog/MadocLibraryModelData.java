package br.gov.lexml.madoc.server.catalog;

import br.gov.lexml.madoc.server.schema.entity.MadocLibraryType;
import br.gov.lexml.madoc.server.schema.entity.MetadataType;

public class MadocLibraryModelData extends ModelInfo {

	private final MadocLibraryType docBase;

	public MadocLibraryModelData(String docUri, String modelId,
			MetadataType metadata, MadocLibraryType docBase) {
		super(docUri, modelId, metadata);
		this.docBase = docBase;
	}

	public MadocLibraryType getMadocLibrary(){
		return docBase;
	}


}
