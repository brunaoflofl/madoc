package br.gov.lexml.madoc.server.util;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.xml.bind.JAXBElement;

import org.apache.commons.lang.StringUtils;

import br.gov.lexml.madoc.server.data.CollectionValue;
import br.gov.lexml.madoc.server.data.DataSetUtil;
import br.gov.lexml.madoc.server.schema.entity.DataSetListType;
import br.gov.lexml.madoc.server.schema.entity.DataSetMapType;
import br.gov.lexml.madoc.server.schema.entity.ListEntryType;
import br.gov.lexml.madoc.server.schema.entity.MapEntryType;
import br.gov.lexml.madoc.server.schema.entity.MetadataType;
import br.gov.lexml.madoc.server.schema.entity.ObjectFactory;

public class MetadataUtil {

	private static final String ORDER_PREFIX = "__order__";

	// Metadados de MadocDocument
	public static final String KEY_TITULO = "Titulo";
	public static final String KEY_CATEGORIA = "Categoria";
	public static final String KEY_INDEXACAO = "Indexacao";
	public static final String KEY_FUNDAMENTACAO = "Fundamentacao";

	// Metadados de MadocAnswer
	public static final String KEY_TIPO_MODELO = "TipoModelo";
	public static final String KEY_ELABORADOR = "Elaborador";
	public static final String KEY_ANO_EPIGRAFE = "AnoEpigrafe";
	public static final String KEY_VALIDO = "Valido";

	public static String getTitulo(DataSetMapType metadata) {
		return queryString(metadata, "/Titulo");
	}

	public static String getIdListaDeAnexos(DataSetMapType metadata) {
		return queryString(metadata, "/ListaDeAnexos");
	}

	public static String getTipoModelo(DataSetMapType metadata) {
		return queryString(metadata, "/TipoModelo");
	}

	public static String getSituacao(DataSetMapType metadata) {
		return queryString(metadata, "/Valido");
	}

	public static boolean isValido(DataSetMapType metadata) {
		String resultado = StringUtils.defaultIfEmpty(queryString(metadata, "/Valido"), "true");
		return resultado.equals("true");
	}

	private static String queryString(DataSetMapType metadata, String query) {
		CollectionValue collectionValue = DataSetUtil.valueFromDataSetValue(metadata);
		return collectionValue.queryString(query);
	}

	public static Map<String, Object> getMap(DataSetMapType metadata) {
		return getMap(metadata, false);
	}

	public static Map<String, Object> getMap(DataSetMapType metadata, boolean addMapEntryOrder) {
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		int i = 0;
		for(MapEntryType e: metadata.getEntry()) {
			map.put(e.getKey(), getValue(e.getContent(), addMapEntryOrder));
			if(addMapEntryOrder) {
				map.put(getMapEntryOrderKey(e.getKey()), i++);
			}
		}
		return map;
	}

	private static Object getValue(List<Serializable> content, boolean addMapEntryOrder) {
		if(content != null && !content.isEmpty()) {
			Object c = getContent(content);
			if(c instanceof String) {
				return c;
			}
			else if(c instanceof DataSetListType) {
				List<Object> l = new ArrayList<Object>();
				for(ListEntryType e: ((DataSetListType)c).getEntry()) {
					l.add(getValue(e.getContent(), addMapEntryOrder));
				}
				return l;
			}
			else if(c instanceof DataSetMapType) {
				return getMap((DataSetMapType)c, addMapEntryOrder);
			}
		}
		return null;
	}

	private static Object getContent(List<Serializable> content) {
		for(Serializable s: content) {
			if(s instanceof JAXBElement) {
				return ((JAXBElement) s).getValue();
			}
		}
		return content.get(0);
	}

	public static DataSetMapType dataSetFromMap(Map<String, Object> map) {
		DataSetMapType metadata = new ObjectFactory().createDataSetMapType();
		setMap(metadata, map);
		return metadata;
	}

	public static void setMap(DataSetMapType metadata, Map<String, Object> map) {
		Map<String, Object> newMap = new HashMap<String, Object>(map);

		// Atualiza os existentes
		for(MapEntryType e: metadata.getEntry()) {
			String key = e.getKey();
			if(newMap.containsKey(key)) {
				e.getContent().clear();
				e.getContent().add(mapToJaxb(newMap.get(key)));
				newMap.remove(key);
			}
		}

		// Adiciona novos
		for(Map.Entry<String, Object> me: newMap.entrySet()) {
			MapEntryType e = new ObjectFactory().createMapEntryType();
			e.setKey(me.getKey());
			e.getContent().add(mapToJaxb(me.getValue()));
			metadata.getEntry().add(e);
		}

	}

	private static Serializable mapToJaxb(Object v) {
		if(v instanceof String) {
			return (String)v;
		}
		else if(v instanceof List) {
			DataSetListType ds = new ObjectFactory().createDataSetListType();
			for(Object item: (List<Object>)v) {
				ListEntryType e = new ObjectFactory().createListEntryType();
				e.getContent().add(mapToJaxb(item));
				ds.getEntry().add(e);
			}
			return ds;
		}
		else if(v instanceof Map) {
			DataSetMapType ds = new ObjectFactory().createDataSetMapType();
			for(Entry<String, Object> item: ((Map<String, Object>)v).entrySet()) {
				MapEntryType e = new ObjectFactory().createMapEntryType();
				e.setKey(item.getKey());
				e.getContent().add(mapToJaxb(item.getValue()));
				ds.getEntry().add(e);
			}
			return ds;
		}
		return null;

	}

	private static String getMapEntryOrderKey(String key) {
		return ORDER_PREFIX + key;
	}

	public static List<Map.Entry<String, ?>> entryList(Map<String, ?> map) {

		final Map<String, Integer> orderMap = getOrderMap(map);

		List<Map.Entry<String, ?>> ret = new ArrayList<Map.Entry<String, ?>>();
		for(Entry<String, ?> e: map.entrySet()) {
			if(!isEntryOrderKey(e.getKey())) {
				ret.add(e);
			}
		}

		Collections.sort(ret, new Comparator<Map.Entry<String, ?>>() {

			@Override
			public int compare(Entry<String, ?> o1, Entry<String, ?> o2) {
				Integer i1 = orderMap.get(getMapEntryOrderKey(o1.getKey()));
				Integer i2 = orderMap.get(getMapEntryOrderKey(o2.getKey()));
				return i1.compareTo(i2);
			}

		});

		return ret;
	}

	private static Map<String, Integer> getOrderMap(Map<String, ?> map) {
		Map<String, Integer> ret = new HashMap<String, Integer>();
		for(Map.Entry<String, ?> e: map.entrySet()) {
			if(isEntryOrderKey(e.getKey())) {
				ret.put(e.getKey(), (Integer)e.getValue());
			}
		}
		return ret;
	}

	private static boolean isEntryOrderKey(String key) {
		return key.startsWith(ORDER_PREFIX);
	}

	public static String getModeloForProperties(MetadataType metadata) {
		return metadata.getId() + " - " + getTitulo(metadata);
	}


}
