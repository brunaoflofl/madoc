package br.gov.lexml.madoc.server.catalog.store.policy;

import java.io.Serializable;

public interface CachePolicy extends Serializable {
	PolicyDecision choosePolicy(String docUri, Long ageMillis);
}
