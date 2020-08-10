package br.gov.lexml.madoc.editor.urn;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.gov.lexml.madoc.editor.util.NumeracaoUtil;

@Service
public class UrnTranslator {

	private static final Map<String, String> mapSigla = new HashMap<String, String>();
	private static final Pattern patternDataExtenso = Pattern.compile("nº (\\d+), de .+? de (\\d{4})");
	private static final Pattern patternFragmento = Pattern.compile("([a-z]{3})(\\d*(?:-\\d*)?)u?");

	static {
		mapSigla.put("Constituição Federal", "CF");
		mapSigla.put("Lei Complementar", "LCP");
		mapSigla.put("Regimento Interno do Senado Federal", "RISF");
		mapSigla.put("Regimento Comum do Congresso Nacional", "RCCN");
	}

	@Autowired
	private UrnService urnService;

	public String getNomeExtenso(String urn) {
		String nomeNorma = urnService.getNomeExtenso(urn);
		nomeNorma = aplicaSigla(nomeNorma);
		nomeNorma = simplificaData(nomeNorma);

		String fragmento = UrnUtil.getFragmento(urn);
		if(!StringUtils.isEmpty(fragmento)) {
			nomeNorma += fragmentoPorExtenso(fragmento);
		}

		return nomeNorma;
	}

	private static String aplicaSigla(String nomeNorma) {
		for(Map.Entry<String, String> e: mapSigla.entrySet()) {
			if(nomeNorma.contains(e.getKey())) {
				return nomeNorma.replace(e.getKey(), e.getValue());
			}
		}
		return nomeNorma;
	}

	private static String simplificaData(String nomeNorma) {
		Matcher m = patternDataExtenso.matcher(nomeNorma);
		if(m.find()) {
			return nomeNorma.replace(m.group(), m.group(1) + "/" + m.group(2));
		}
		return nomeNorma;
	}

	private static String fragmentoPorExtenso(String fragmento) {

		StringBuilder sb = new StringBuilder();

		String extenso;
		String sigla;
		String numero;
		boolean unico;
		Matcher m = patternFragmento.matcher(fragmento);
		while(m.find()) {
			sigla = m.group(1);
			numero = m.group(2);
			unico = m.group().endsWith("u");

			extenso = fragmentoPorExtenso(sigla, numero, unico);
			if(!extenso.equals("")) {
				sb.append(", ");
				sb.append(extenso);
			}
		}

		return sb.toString();
	}

	private static String fragmentoPorExtenso(String sigla, String numero,
			boolean unico) {

		StringBuilder sb = new StringBuilder();

		int n = numero.equals("")? 0: Integer.parseInt(numero.replaceAll("-.*$", ""));
		numero = numeroPorExtenso(numero);

		if(sigla.equals("art")) {
			sb.append("art. ");
			sb.append(numero);
			if(n < 10) {
				sb.append("º");
			}
		}
		else if(sigla.equals("par")) {
			if(unico) {
				sb.append("parágrafo único");
			}
			else {
				sb.append("§ ");
				sb.append(numero);
				if(n < 10) {
					sb.append("º");
				}
			}
		}
		else if(sigla.equals("inc")) {
			sb.append("inciso ");
			sb.append(NumeracaoUtil.intToRoman(n).toUpperCase());
		}
		else if(sigla.equals("ali")) {
			sb.append("alínea \"");
			sb.append(NumeracaoUtil.intToAlpha(n));
			sb.append("\"");
		}
		else if(sigla.equals("ite")) {
			sb.append("item ");
			sb.append(numero);
		}

		return sb.toString();
	}

	private static String numeroPorExtenso(String numero) {
		String[] tokens = numero.split("-");
		if(tokens.length > 1) {
			return tokens[0] + "-" + NumeracaoUtil.intToAlpha(
				Integer.parseInt(tokens[1])).toUpperCase();
		}
		return numero;
	}

}
