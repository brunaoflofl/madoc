package br.gov.lexml.madoc.server.schema.entity;

import java.util.List;

import br.gov.lexml.madoc.server.schema.entity.BaseOptionType;

public interface BaseOptionInterface <O extends BaseOptionType> {

	String getDataSetBind();
	
	boolean isSetDataSetBind();
	
	boolean isSetOption();
	
	List<O> getOption();
	
	boolean isSetSorted();
	
	boolean isSorted();
	
}
