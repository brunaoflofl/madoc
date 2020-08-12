package br.gov.lexml.madoc.server.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Pattern;

import javax.xml.bind.JAXBElement;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;

public class JsonUtil {
	
	private static final Log log = LogFactory.getLog(JsonUtil.class);

	public static Object deserializeToObject(String json) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readerFor(HashMap.class).readValue(json);
	}
	
	public static String serialize(Object obj) throws JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(obj);
	}
	
	public static class AnyTypeSerializer extends JsonSerializer<Object> {
		
		private TypeNameTransformer[] typeTransformers;
		private AttributeWriter[] attrWriters;

		
		public AnyTypeSerializer(TypeNameTransformer[] typeTransformers,
				AttributeWriter[] attrWriters) {
			super();
			this.typeTransformers = typeTransformers;
			this.attrWriters = attrWriters;
		}

		@Override
		public void serialize(Object value, JsonGenerator jgen, SerializerProvider provider)
				throws IOException, JsonProcessingException {
			
			if(value instanceof JAXBElement) {
				jgen.writeObject(((JAXBElement)value).getValue());
				return;
			}
			
			jgen.writeStartObject();

			String typeName = transformTypeName(value);
			if(!StringUtils.isEmpty(typeName)) {
				jgen.writeStringField("type", typeName);
			}
			
			for(AttributeWriter attrWriter: attrWriters) {
				try {
					attrWriter.write(value, jgen);
				} catch (Exception e) {
					log.error("Falha na conversão para json.", e);
				}
			}
			
			jgen.writeEndObject();
		}

		private String transformTypeName(Object value) {
			String typeName = value.getClass().getSimpleName();
			for(TypeNameTransformer transf: typeTransformers) {
				typeName = transf.transform(typeName);
			}
			return typeName;
		}

	}
	
	public static class TypeNameTransformer {
		
		private Pattern pattern;
		private String replacement;
		
		public TypeNameTransformer(String regex, String replacement) {
			pattern = Pattern.compile(regex);
			this.replacement = replacement;
		}
		
		public String transform(String typeName) {
			return pattern.matcher(typeName).replaceAll(replacement);
		}
		
	}
	
	public static class AttributeWriter {
		
		private String attributeName;
		private String[] paths;
		
		public AttributeWriter(String attributeName, String... paths) {
			this.attributeName = attributeName;
			this.paths = paths;
		}
		
		public AttributeWriter(String attributeName) {
			this(attributeName, attributeName);
		}
		
		public void write(Object bean, JsonGenerator jgen) throws Exception {
			
			for(String path: paths) {
				Object value = getPropertyValue(bean, path);
				if(value != null) {
					if(value instanceof Boolean) {
						jgen.writeBooleanField(attributeName, (Boolean)value);
					}
					else if(value instanceof String) {
						jgen.writeStringField(attributeName, (String)value);
					}
					else if(value instanceof List) {
						jgen.writeArrayFieldStart(attributeName);
						for(Object e: (List)value) {
							jgen.writeObject(e);
						}
						jgen.writeEndArray();
					}
					else {
						jgen.writeObjectField(attributeName, value);
					}
					break;
				}
			}
		}
		
		/**
		 * Retorna valor da propriedade ou null se a propriedade não existe 
		 */
		private Object getPropertyValue(Object bean, String path) throws Exception {
			
			Object value = bean;
			
			for(String p: path.trim().split("\\.")) {
				if(value != null && PropertyUtils.isReadable(value, p)) {
					value = PropertyUtils.getProperty(value, p);
				}
				else {
					return null;
				}
			}
			
			return value;
		}
		
	}

}


