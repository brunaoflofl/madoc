package br.gov.lexml.madoc.server.catalog.store;

import java.io.Serializable;

public interface Rewriter extends Serializable {
	String rewriteUri(String docUri);
}
