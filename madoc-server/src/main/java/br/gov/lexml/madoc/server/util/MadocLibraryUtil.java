package br.gov.lexml.madoc.server.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import br.gov.lexml.madoc.server.catalog.CatalogException;
import br.gov.lexml.madoc.server.catalog.CatalogService;
import br.gov.lexml.madoc.server.data.Value;
import br.gov.lexml.madoc.server.wrappers.MadocLibraryWrapper;

public class MadocLibraryUtil {

	private static final Log log = LogFactory.getLog(MadocLibraryUtil.class);

	public static List<Map<String, String>> loadOptions(
			CatalogService catalogService, String libraryId, String query) {
		return loadOptions(catalogService, libraryId, query, null, null);
	}

	public static List<Map<String, String>> loadOptions(
			CatalogService catalogService, String libraryId, String query, String valueQuery, String displayQuery) {

		List<Map<String, String>> list = new ArrayList<Map<String, String>>();

		try {
			MadocLibraryWrapper mlw = new MadocLibraryWrapper(catalogService, libraryId);

			for(Value v: mlw.getDataSetsWrapper().query(query)) {
				list.add(createOption(v, valueQuery, displayQuery));
			}

		} catch (CatalogException e) {
			log.warn("Falha ao consultar catálogo do Madoc.", e);
		}

		return list;
	}

	private static Map<String, String> createOption(Value v, String valueQuery, String displayQuery) {

		Map<String, String> map = new HashMap<String, String>();

		if(valueQuery == null) {
			map.put("value", v.toString());
		}
		else {
			map.put("value", v.queryString(valueQuery));
			map.put("display", v.queryString(displayQuery));
		}

		return map;

	}

	public static List<Map<String, String>> toOptionList(List<String> values) {
		return values.stream().map(s -> {
			Map<String, String> map = new HashMap<String, String>();
			map.put("value", s);
			return map;
		}).collect(Collectors.toList());
	}
}
