package br.gov.lexml.madoc.server.catalog.store;

import java.io.InputStream;
import java.io.Serializable;

public interface DocumentStore extends Serializable {
	
	/**
	 * Returns a InputStream of a docUri
	 * @param docUri
	 * @return
	 * @throws Exception
	 */
	InputStream getDocument(String docUri) throws Exception;

}
