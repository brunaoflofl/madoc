package br.gov.lexml.madoc.server.util;

import java.text.Normalizer;
import java.util.List;

import org.apache.commons.lang.StringEscapeUtils;

public class MadocStringUtils {

	public static String unescapeHtmlKeepingXMLEntities(String html) {
		// Mantém escape de < e >
		html = html.replace("&#60;", "&lt;")
				.replace("&#62;", "&gt;").replaceAll("&([gl]t;)", "&amp;$1");
		// Retira demais escapes HTML
		return StringEscapeUtils.unescapeHtml(html);
	}

	public static String join(List<String> strings, String sep, String ultimoSep) {
		if(strings == null || strings.isEmpty()) {
			return "";
		}
		if(strings.size() == 1) {
			return strings.get(0);
		}
		return String.join(sep, strings.subList(0, strings.size() - 1)) + 
				ultimoSep + strings.get(strings.size() - 1);		
	}

	/**
	 * Retira todos os caracteres acentuados substituindo pelos correspondentes
	 * sem acento.
	 *
	 * @param string
	 *            objeto do tipo String.
	 * @return String sem caracteres acentuados.
	 */
	public static String retiraAcentos(String string) {
		if (string == null) {
			return "";
		}
		String ret = Normalizer.normalize(string, Normalizer.Form.NFD);
		return ret.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
	}

}
