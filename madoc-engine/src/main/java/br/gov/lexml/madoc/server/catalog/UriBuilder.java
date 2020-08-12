package br.gov.lexml.madoc.server.catalog;

import java.io.Serializable;

public interface UriBuilder extends Serializable {

	String buildUri(String modelId, String resourceName);

}
