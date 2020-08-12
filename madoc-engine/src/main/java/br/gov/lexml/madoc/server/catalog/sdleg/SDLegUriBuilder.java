package br.gov.lexml.madoc.server.catalog.sdleg;

import br.gov.lexml.madoc.server.catalog.UriBuilder;

public class SDLegUriBuilder implements UriBuilder {

	@Override
	public String buildUri(String modelId, String baseId) {
		if(baseId == null) {
			return null;
		}
		return "urn:sf:sistema;sdleg:id;" + baseId;
	}

}
