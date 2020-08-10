package br.gov.lexml.madoc.server.schema.entity;

import br.gov.lexml.madoc.server.schema.entity.BaseOptionType;

public interface OptionableQuestionInterface <O extends BaseOptionInterface<? extends BaseOptionType>> {

	O getOptions();
	
	boolean isSetOptions();
	
	
}
