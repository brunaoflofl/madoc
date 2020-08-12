package br.gov.lexml.madoc.server.javascript;

import java.io.IOException;
import java.io.Serializable;
import java.util.List;

import javax.xml.bind.JAXBElement;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import br.gov.lexml.madoc.server.schema.entity.BaseDataSetEntryType;
import br.gov.lexml.madoc.server.schema.entity.DataSetListType;
import br.gov.lexml.madoc.server.schema.entity.DataSetMapType;
import br.gov.lexml.madoc.server.schema.entity.DataSetValueType;
import br.gov.lexml.madoc.server.schema.entity.ListEntryType;
import br.gov.lexml.madoc.server.schema.entity.MapEntryType;
import br.gov.lexml.madoc.server.catalog.ModelInfo;
import br.gov.lexml.madoc.server.util.JsonUtil.AnyTypeSerializer;
import br.gov.lexml.madoc.server.util.JsonUtil.AttributeWriter;
import br.gov.lexml.madoc.server.util.JsonUtil.TypeNameTransformer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class CatalogIndexJsonBuilder {
	
	private static final Log log = LogFactory.getLog(CatalogIndexJsonBuilder.class);
	
	private static final TypeNameTransformer[] typeTransformers = {
		new TypeNameTransformer(".*", "")
	};
	
	private static final AttributeWriter[] attrWriters = {
		new AttributeWriter("id", "modelId"),
		new AttributeWriter("version", "modelVersion"),
//		new AttributeWriter("uri"),
//		new AttributeWriter("enabled", "metadata.enabled"),
//		new AttributeWriter("obsolete", "catalogItem.obsolete"),
		new AttributeWriter("metadata")
	};
	
	private List<ModelInfo> models;
	
	public CatalogIndexJsonBuilder(List<ModelInfo> models) {
		this.models = models;
	}

	public String build() throws Exception {
		ObjectMapper mapper = new ObjectMapper();

		mapper.enable(SerializationFeature.INDENT_OUTPUT);
		
		AnyTypeSerializer serializer = new AnyTypeSerializer(typeTransformers, attrWriters);
		
		MetadataSerializer mdSerializer = new MetadataSerializer();
		
		SimpleModule module = new SimpleModule();
		module.addSerializer(JAXBElement.class, serializer);
		module.addSerializer(ModelInfo.class, serializer);
		module.addSerializer(DataSetValueType.class, mdSerializer);
		module.addSerializer(BaseDataSetEntryType.class, mdSerializer);
		mapper.registerModule(module);
		
		return mapper.writeValueAsString(models);
	}
	
	public static class MetadataSerializer extends JsonSerializer<Object> {

		@Override
		public void serialize(Object value, JsonGenerator jgen, SerializerProvider privider) 
				throws IOException, JsonProcessingException {
			
			if(value instanceof DataSetMapType) {
				DataSetMapType dsmap = (DataSetMapType)value;
				jgen.writeStartObject();
				for(MapEntryType entry: dsmap.getEntry()) {
					jgen.writeObjectField(entry.getKey(), entry);
				}
				jgen.writeEndObject();
			}
			else if(value instanceof DataSetListType) {
				DataSetListType dslist = (DataSetListType)value;
				jgen.writeStartArray();
				for(ListEntryType entry: dslist.getEntry()) {
					jgen.writeObject(entry);
				}
				jgen.writeEndArray();
			}
			else if(value instanceof BaseDataSetEntryType) {
				BaseDataSetEntryType entry = (BaseDataSetEntryType)value;
				// Considerando que o conteúdo é apenas uma String ou um DataSetMapType ou um DataSetListType
				List<Serializable> content = entry.getContent();
				if(content.size() == 1 && content.get(0) instanceof String) {
					jgen.writeString((String)content.get(0));
				}
				else {
					for(Serializable s: content) {
						// Desconsiderando quebras de linha do conteúdo misto 
						if(!(s instanceof String)) {
							jgen.writeObject(s);
							break;
						}
					}
				}
			}
			
			
		}
		
	}
	
}
