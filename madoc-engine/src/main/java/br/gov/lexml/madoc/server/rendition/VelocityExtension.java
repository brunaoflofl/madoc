package br.gov.lexml.madoc.server.rendition;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.gov.lexml.madoc.server.schema.Constants;
import br.gov.lexml.madoc.server.schema.entity.QuestionType;
import br.gov.lexml.madoc.server.schema.entity.TextQuestionType;
import br.gov.lexml.madoc.server.util.MadocStringUtils;
import br.gov.lexml.madoc.server.util.Numerals;
import br.gov.lexml.madoc.server.util.XMLUtil;

public class VelocityExtension {

	private static final Log log = LogFactory.getLog(VelocityExtension.class);

	private final ContextCollection contextCollection;
	private final VelocityContext ctx;
	private VelocityEngine velocityEngine;

	public VelocityExtension(ContextCollection contextCollection, VelocityContext ctx) {
		this.contextCollection = contextCollection;
		this.ctx = ctx;
	}

	public void setVelocityEngine(VelocityEngine velocityEngine) {
		this.velocityEngine = velocityEngine;
	}

	public interface Getter {

		Object get(Object key);

	}

	/**
	 * Returns the first value of a question
	 * 
	 * @return
	 */
	public Getter getValueOf() {

		return new Getter() {

			@Override
			public Object get(Object key) {

				String value = VelocityExtensionQuestionsUtils.getValueOfId(contextCollection, key.toString());

				if (value == null) {
					return "";
				}
				return basicXmlEscape(value);
			}
		};
	}

	/**
	 * Returns the list value
	 * 
	 * @return
	 */
	public Getter getValueListOf() {

		return new Getter() {

			@Override
			public Object get(Object key) {

				List<String> values = VelocityExtensionQuestionsUtils.getValueListOf(contextCollection, key.toString());

				if (values == null) {
					return Collections.EMPTY_LIST;
				}

				return basicXmlEscape(values);

			}
		};
	}

	/**
	 * Returns a value of a question, option or variable not escaped
	 * 
	 * @return
	 */
	public Getter getRawValueOf() {

		return new Getter() {

			@Override
			public Object get(Object key) {

				String value = VelocityExtensionQuestionsUtils.getValueOfId(contextCollection, key.toString());

				if (value == null) {
					return "";
				}
				return value;
			}
		};
	}

	public Getter getDefaultValueOf() {
		return new Getter() {

			@Override
			public Object get(Object key) {

				QuestionType qt = contextCollection.getQuestionsMap().get(key.toString());
				if (qt != null && qt instanceof TextQuestionType) {
					return basicXmlEscape(((TextQuestionType) qt).getDefaultValue());
				} else {
					return "";
				}
			}

		};

	}

	/**
	 * Returns the first Map of a question which contains a json
	 * 
	 * @return
	 */
	public Getter getMapOf() {

		return new Getter() {

			@Override
			public Object get(Object key) {

				String json = VelocityExtensionQuestionsUtils.getValueOfId(contextCollection, key.toString());
				ObjectMapper mapper = new ObjectMapper();
				try {
					return basicXmlEscape(mapper.readValue(json, Map.class));
				} catch (Exception e) {
					return mapper;
				}
			}
		};
	}

	/**
	 * Returns the List Map of a question which contains a json
	 * 
	 * @return
	 */
	public Getter getMapListOf() {

		return new Getter() {

			@Override
			public List<Map<String, String>> get(Object key) {
				ArrayList<Map<String, String>> list = new ArrayList<Map<String, String>>();
				ObjectMapper mapper = new ObjectMapper();
				List<String> values = VelocityExtensionQuestionsUtils.getValueListOf(contextCollection, key.toString());

				if (values == null) {
					return Collections.EMPTY_LIST;
				}

				try {
					for (String json : values) {
						Map<String, String> map = basicXmlEscape(mapper.readValue(json, Map.class));
						list.add(map);
					}

				} catch (Exception e) {
					;
				}

				return list;

			}
		};
	}

	public Getter getRenderedTemplate() {

		return new Getter() {

			@Override
			public Object get(Object key) {
				String template = contextCollection.getTemplateReplacements().get(key);
				if (StringUtils.isEmpty(template)) {
					return "";
				}
				return VelocityExtensionUtils.render(template, ctx, velocityEngine);
			}

		};

	}

	public String render(String template) {
		return VelocityExtensionUtils.render(template, ctx, velocityEngine);
	}

	public String queryAnswerMetadata(String query) {
		return contextCollection.queryAnswerMetadata(query);
	}

	/**
	 * Return a size of something
	 * 
	 * @param o
	 * @return
	 */
	public int size(Object o) {

		if (o == null) {
			return 0;
		}

		if (o instanceof Object[]) {
			return ((Object[]) o).length;
		}

		if (o instanceof Collection) {
			return ((Collection<?>) o).size();
		}

		return o.toString().length();
	}

	public int parseInt(String s) {
		if (StringUtils.isEmpty(s)) {
			return 0;
		}
		return Integer.parseInt(s);
	}

	/**
	 * A generic method to format date.
	 * 
	 * @param format
	 * @param date
	 * @return
	 */
	public String formatDate(String format, String date) {
		if (!StringUtils.isEmpty(format) && !StringUtils.isEmpty(date)) {
			try {
				return new SimpleDateFormat(format, Constants.DEFAULT_LOCALE)
						.format(new SimpleDateFormat(Constants.DATE_FORMAT).parse(date));
			} catch (ParseException e) {
				return "* Data inválida *";
			}
		}
		return "";
	}

	/**
	 * Format a date link Constants.FULL_DATE_FORMAT
	 * 
	 * @param date
	 * @return
	 */
	public String formatDateFull(String date) {
		if (!StringUtils.isEmpty(date)) {

			String result = formatDate(Constants.FULL_DATE_FORMAT, date).toLowerCase();

			if (result != null) {
				return result.replaceAll("^1 ", "1&#186; ");
			}
		}

		return "";
	}

	public static String currentISO8601DateTime() {
		return ZonedDateTime.now(ZoneId.of("America/Sao_Paulo")).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
	}

	/**
	 * Write a number of days in words.
	 * 
	 * @param days
	 * @return
	 */
	public String writeDayInWords(String days) {
		return writeDayInWords(VelocityExtensionUtils.stringToDouble(days));
	}

	public String writeDayInWords(Number days) {
		return new Numerals(0, Numerals.UNIT_DAY).toString(BigDecimal.valueOf(days.longValue()), true);
	}

	/**
	 * Write a number in words.
	 * 
	 * @param days
	 * @return
	 */
	public String writeIntegerInWords(String integer) {
		return writeIntegerInWords(VelocityExtensionUtils.stringToDouble(integer));
	}

	public String writeIntegerInWords(Number integer) {
		return new Numerals(0, Numerals.UNIT_NOTHING).toString(BigDecimal.valueOf(integer.longValue()));
	}

	public String writeIntegerInWordsFem(String integer) {
		return writeIntegerInWordsFem(VelocityExtensionUtils.stringToDouble(integer));
	}

	public String writeIntegerInWordsFem(Number integer) {
		Numerals n = new Numerals(0, Numerals.UNIT_NOTHING);
		n.setNumeralsString(Numerals.NUMERALS_FEMININO);
		return n.toString(BigDecimal.valueOf(integer.longValue()));
	}

	/**
	 * Write a currency number in words.
	 * 
	 * @param days
	 * @return
	 */
	public String writeCurrencyNumberInWords(String value) {
		return new Numerals(2, Numerals.UNIT_REAL)
				.toString(BigDecimal.valueOf(VelocityExtensionUtils.stringToDouble(value)));
	}

	/**
	 * Write the value in a currency format
	 * 
	 * @param value
	 * @return
	 */
	public String formatCurrencyNumber(String value) {
		return VelocityExtensionUtils.formatCurrencyNumber(value);
	}

	/**
	 * Write a number in words.
	 * 
	 * @param days
	 * @return
	 */
	public String writeNumberInWords(String number, int decimal, String[][] unit) {
		return writeNumberInWords(Double.valueOf(VelocityExtensionUtils.stringToDouble(number)), decimal, unit);
	}

	public String writeNumberInWords(Number number, int decimal, String[][] unit) {
		return new Numerals(decimal, unit).toString(BigDecimal.valueOf(number.doubleValue()));
	}

	/*
	 * ROUND
	 */

	public double round(String n, int decimals) {
		return Math.round(VelocityExtensionUtils.stringToDouble(n) * (10 ^ decimals)) / (10 ^ decimals);
	}

	public long round(String n) {
		return Math.round(VelocityExtensionUtils.stringToDouble(n));
	}

	public long round(Number n) {
		return Math.round(n.doubleValue());
	}

	public double round(Number n, int decimals) {
		return Math.round(n.doubleValue() * (10 ^ decimals)) / (10 ^ decimals);
	}

	/*
	 * MARKUP HELPERS
	 */

	public String removeEntities(String code) {
		String replaced = XMLUtil.removeEntities(code);
		if (log.isDebugEnabled()) {
			log.debug("removeEntities from code '" + code + "': result = " + replaced);
		}
		return replaced;
	}

	public String normalizeSpaces(String code) {
		if (StringUtils.isEmpty(code)) {
			return "";
		}
		return code.replaceAll("\\s{2,}", " ");
	}

	public String lowercaseInitial(String html) {
		return VelocityExtensionUtils.lowercaseInitial(html);
	}

	public String removeFinalDot(String html) {
		return VelocityExtensionUtils.removeFinalDot(html);
	}
	
	public String join(List<String> strings, String sep) {
		return StringUtils.join(strings, sep);
	}
	
	public String join(List<String> strings, String sep, String ultimoSep) {
		return MadocStringUtils.join(strings, sep, ultimoSep);
	}
	
	public boolean isEmpty(Object obj) {
		return obj == null || (obj instanceof String && StringUtils.isEmpty((String) obj))
				|| (obj instanceof Collection && ((Collection)obj).isEmpty());
	}

	// HTML to XSL-FO
	public String html2fo(String html) {
		log.debug("html2fo - ANTES: " + html);
		VelocityExtensionHTML2FO h2fo = VelocityExtensionHTML2FO.getInstance();
		String s = h2fo.html2fo(html, ctx, velocityEngine);
		log.debug("html2fo - DEPOIS: " + s);
		return s;
	}

	public String html2fo(String html, @SuppressWarnings("rawtypes") Map conf) {
		log.debug("html2fo - ANTES: " + html);
		VelocityExtensionHTML2FO h2fo = new VelocityExtensionHTML2FO(conf);
		String s = h2fo.html2fo(html, ctx, velocityEngine);
		log.debug("html2fo - DEPOIS: " + s);
		return s;
	}
	
	public String removeTrailingEmptyLinesFromFO(String html) {
		String s =  html.replaceAll("(?s)(?:<fo:block[^>]+>[\\s ]+</fo:block>\\s*?)+$", "");
		return s;
	}
	
	public String add(List<Object> list, Object element) {
		list.add(element);
		return "";
	}

	/*
	 * DIGEST
	 */

	public String sha1(String text) {
		return DigestUtils.sha1Hex(text);
	}

	public String basicXmlEscape(String str) {
		return str.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'",
				"&apos;");
	}

	public List<String> basicXmlEscape(List<String> list) {
		return list.stream().map(s -> basicXmlEscape(s)).collect(Collectors.toList());
	}
	
	public Map<String, Object> basicXmlEscape(Map<String, Object> map) {
		Map<String, Object> ret = new HashMap<String, Object>(map.size());
		for(Map.Entry<String, Object> entry: map.entrySet()) {
			Object value = entry.getValue();
			if (value != null && value instanceof String) {
				value = basicXmlEscape((String)value);
			}
			ret.put(entry.getKey(), value);
		}
		return ret;
	}
	

	public String basicXmlUnescape(String str) {
		return str.replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", "\"").replace("&apos;", "'")
				.replace("&amp;", "&");
	}

}