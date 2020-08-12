package br.gov.lexml.madoc.server.catalog.store;

import java.io.Serializable;
import java.net.URLConnection;

public interface ConnectionConfigurator extends Serializable {
	void configure(String docUri, URLConnection con);
}
