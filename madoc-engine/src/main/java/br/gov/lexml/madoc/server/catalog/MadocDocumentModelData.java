package br.gov.lexml.madoc.server.catalog;

import br.gov.lexml.madoc.server.data.DataSets;
import br.gov.lexml.madoc.server.schema.entity.MadocDocumentType;
import br.gov.lexml.madoc.server.schema.entity.MetadataType;

public class MadocDocumentModelData extends ModelInfo {

	private final MadocDocumentType docBase;

	private final DataSets dataSets;

	public MadocDocumentModelData(String docUri, String modelId,
			MetadataType metadata, MadocDocumentType docBase) {
		super(docUri, modelId, metadata);
		this.docBase = docBase;
		this.dataSets = docBase.getDataSets() == null ? DataSets.EMPTY :
				DataSets.fromDataSets(docBase.getDataSets());
	}

	public MadocDocumentType getMadocDocument(){
		return docBase;
	}

	public DataSets getDataSets() {
		return dataSets;
	}

}
