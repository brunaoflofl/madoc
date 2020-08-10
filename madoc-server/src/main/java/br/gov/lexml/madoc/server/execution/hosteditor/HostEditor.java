package br.gov.lexml.madoc.server.execution.hosteditor;

import java.io.Serializable;
import java.util.Map;

public interface HostEditor extends Serializable {

	Map<String, String> getProperties();
	
}
