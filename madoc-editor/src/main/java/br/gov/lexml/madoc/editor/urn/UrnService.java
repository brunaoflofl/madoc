
package br.gov.lexml.madoc.editor.urn;

import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.stereotype.Service;

import br.gov.lexml.madoc.editor.util.Formatacao;
import br.gov.lexml.madoc.editor.util.genero.Genero;
import br.gov.lexml.madoc.editor.util.genero.GeneroFeminino;
import br.gov.lexml.madoc.editor.util.genero.GeneroMasculino;

/**
 * Implementação padrão do UrnService utilizando o arquivo conf/vocabulario.xml
 */
@Service
public class UrnService {

    private static final Log log = LogFactory.getLog(UrnService.class);

    // Urn da autoridade para nome por extenso
    private final Map<String , String> mapAutoridade = new HashMap<String , String>();

    // Urn da autoridade com gênero masculino (os demais são femininos)
    private final List<String> listAutoridadeMasculino = new ArrayList<String>();

    // Urn do tipo de documento para nome por extenso
    private final Map<String , String> mapTipoDocumento = new HashMap<String , String>();

    // Tipos de documento (e urns de atalho) com gênero masculino (os demais são femininos)
    private final List<String> listTipoDocumentoMasculino = new ArrayList<String>();

    // Urn autoridade:tipoDocumento para a URN
    private final Map<String , String> mapAtalho = new HashMap<String , String>();

    // Urn para o nome (obtido dos atalhos)
    private final Map<String , String> mapNome = new HashMap<String , String>();

    // autoridade;tipoDocumento para a sigla
    private final Map<Pair<String, String> , String> mapSiglas = new HashMap<>();

    // Evento para tipo do texto no processo legislativo
    private String eventoDefault;
    private final Map<String , String> mapEventoTipoTexto = new HashMap<String , String>();
    private final List<String> listEventosSubstitutivo = new ArrayList<String>();
    private final List<String> listEventosTextoMasculino = new ArrayList<String>();

    private static final Pattern PATTERN_URN = Pattern
            .compile("urn:lex:br:([^:]+):([^:]+):(\\d{4}(?:-\\d{2}-\\d{2}))(?:;(\\d+(?:-\\d+)?).*)");

    public String getNomeExtensoAutoridade(final String urnAutoridade) {
        String nome = mapAutoridade.get(urnAutoridade);
        return nome == null ? urnAutoridade : nome;
    }

    public Genero getGeneroAutoridade(final String urnAutoridade) {
    	boolean masculino = listAutoridadeMasculino.contains(urnAutoridade);
    	return masculino? GeneroMasculino.getInstance(): GeneroFeminino.getInstance();
    }

    public String getNomeExtensoTipoDocumento(final String urnTipoDocumento) {
        String nome = mapTipoDocumento.get(urnTipoDocumento);
        return nome == null ? urnTipoDocumento : nome;
    }

    public String getUrn(final String urnAutoridade, final String urnTipoDocumento, final Date dataRepresentativa,
                         final String numero) {

        String atalho = mapAtalho.get(urnAutoridade + ":" + urnTipoDocumento);
        if (atalho != null) {
            return atalho;
        }

        StringBuilder sb = new StringBuilder("urn:lex:br:");
        sb.append(urnAutoridade);
        sb.append(":");
        sb.append(urnTipoDocumento);

        if (dataRepresentativa != null) {
            sb.append(":");
            sb.append(new SimpleDateFormat("yyyy-MM-dd").format(dataRepresentativa));
            if (numero != null) {
                sb.append(";");
                sb.append(numero);
            }
        }

        return sb.toString();
    }

    public boolean precisaInformarDataENumero(final String urnAutoridade, final String urnTipoDocumento) {
        return mapAtalho.get(urnAutoridade + ":" + urnTipoDocumento) == null;
    }

    public String getNomeExtenso(String urn) {

        // "urn:lex:br:federal:decreto.lei:1943-05-01;5452"

    	// Retira referência para o fragmento
    	urn = UrnUtil.retiraFragmento(urn);

        // Verifica se existe atalho para o nome
        String nome = mapNome.get(urn);
        if (nome != null) {
            return nome;
        }

        Matcher m = PATTERN_URN.matcher(urn);

        if (m.matches()) {

            String autoridade = m.group(1);
            String tipoDocumento = m.group(2);
            String strData = m.group(3);
            String strNumero = m.groupCount() > 3 ? m.group(4) : null;

            StringBuilder sb = new StringBuilder();

            sb.append(getNomeExtensoTipoDocumento(tipoDocumento));

            if (!autoridade.equals("federal")) {
            	sb.append(" ");
            	sb.append(getGeneroAutoridade(autoridade).getPronomePossessivoSingular());
                sb.append(" ");
                sb.append(getNomeExtensoAutoridade(autoridade));
            }

            if (strNumero != null) {
                sb.append(" nº ");
                String sequencial = null;
                int i = strNumero.indexOf("-");
                if (i >= 0) {
                    sequencial = strNumero.substring(i);
                    strNumero = strNumero.substring(0, i);
                }
                sb.append(Formatacao.formataNumeroInteiro(Integer.parseInt(strNumero)));
                if (sequencial != null) {
                    sb.append(sequencial);
                }
            }

            sb.append(", de ");
            if (strData.contains("-")) {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                Date date;
                try {
                    date = sdf.parse(strData);
                }
                catch (ParseException e) {
                    return "!!! Data inválida na urn " + urn + " !!!";
                }
                sb.append(Formatacao.formataDataExtenso(date));
            }
            else {
                sb.append(strData);
            }

            return sb.toString();
        }

        return "!!! Falha ao obter nome da norma " + urn + " !!!";
    }

    public Genero getGenero(final String urn) {
        boolean masculino;
        if (mapNome.containsKey(urn)) {
            masculino = listTipoDocumentoMasculino.contains(urn);
        }
        else {
            String tipoDocumento = UrnUtil.getTipoDocumento(urn);
            masculino = listTipoDocumentoMasculino.contains(tipoDocumento);
        }
        return masculino ? GeneroMasculino.getInstance() : GeneroFeminino.getInstance();
    }

    @SuppressWarnings("unchecked")
    @PostConstruct
    private void init() {

        String fileName = "/vocabulario.xml";
        InputStream is = UrnService.class.getResourceAsStream(fileName);

        if (is == null) {
            log.error("Arquivio " + fileName + " não encontrado.");
        }
        else {
            try {
                Document doc = new SAXReader().read(is);
                Element root = doc.getRootElement();

                // Carrega autoridades
                elementStream(root, "autoridades/autoridade").forEach(e -> {
                	mapAutoridade.put(e.attributeValue("urn"), e.attributeValue("extenso"));
                    if (e.attributeValue("genero").equals("M")) {
                        listAutoridadeMasculino.add(e.attributeValue("urn"));
                    }
                });

                // Carrega tipos de documento
                elementStream(root, "tiposDocumento/tipoDocumento").forEach(e -> {
                    String urnTipoDocumento = e.attributeValue("urn");
                    mapTipoDocumento.put(urnTipoDocumento, e.attributeValue("extenso"));
                    if (e.attributeValue("genero").equals("M")) {
                        listTipoDocumentoMasculino.add(urnTipoDocumento);
                    }
                });

                // Carrega siglas
                elementStream(root, "siglas/sigla").forEach(e -> {
                    mapSiglas.put(Pair.of(e.attributeValue("urnAutoridade"), e.attributeValue("urnTipoDocumento")),
                    		e.attributeValue("sigla"));
                });

                // Carrega atalhos de URN
                elementStream(root, "atalhosUrn/atalhoUrn").forEach(e -> {
                    String urn = e.attributeValue("urn");
                    String urnTipoDocumento = e.attributeValue("urnTipoDocumento");
                    mapAtalho.put(e.attributeValue("urnAutoridade") + ":" + urnTipoDocumento, urn);
                    mapNome.put(urn, e.attributeValue("nome"));

                    String attrGenero = e.attributeValue("genero");
                    if (attrGenero != null && attrGenero.equals("M") || attrGenero == null
                        && listTipoDocumentoMasculino.contains(urnTipoDocumento)) {
                        listTipoDocumentoMasculino.add(urn);
                    }
                });

                // Evento para tipo do texto no processo legislativo
                elementStream(root, "eventos/evento").forEach(e -> {
                    String urn = e.attributeValue("urn");
                    String tipoTextoProcessoLegislativo = e.attributeValue("tipoTextoProcessoLegislativo");
                    if(eventoDefault == null) {
                    	eventoDefault = urn;
                    }
                    mapEventoTipoTexto.put(urn, tipoTextoProcessoLegislativo);

                    // Identifica eventos que indicam substitutivo
                    if(e.attributeValue("substitutivo", "n").equals("s")) {
                    	listEventosSubstitutivo.add(urn);
                    }

                    if (e.attributeValue("genero", "M").equals("M")) {
                        listEventosTextoMasculino.add(urn);
                    }
                });

            }
            catch (Exception e) {
                log.error("Falha ao carregar arquivo " + fileName + ".");
            }
        }

    }

    public CamposUrn getCamposUrn(final String urn) {

        if (mapAtalho.containsValue(urn)) {
            for (Entry<String , String> e : mapAtalho.entrySet()) {
                if (e.getValue().equals(urn)) {
                    CamposUrn campos = new CamposUrn();
                    String key = e.getKey();
                    int i = key.indexOf(":");
                    campos.setAutoridade(key.substring(0, i));
                    campos.setTipo(key.substring(i + 1));
                    return campos;
                }
            }
        }

        return new CamposUrn(urn);
    }

    public String getTipoTextoProcessoLegislativo(String urn) {
    	String evento = getEvento(urn);
    	return mapEventoTipoTexto.get(evento);
    }

    public Genero getGeneroTipoTextoProcessoLegislativo(String urn) {
    	String evento = getEvento(urn);
    	boolean masculino = listEventosTextoMasculino.contains(evento);
    	return masculino? GeneroMasculino.getInstance(): GeneroFeminino.getInstance();
    }

    public boolean isSubstitutivo(String urn) {
    	String versao = UrnUtil.getVersao(urn);
    	String evento = UrnUtil.getCampo(versao, 1);
    	return listEventosSubstitutivo.contains(evento);
    }

	private String getEvento(String urn) {
		String evento = null;

    	// Extrai evento da versão da URN
    	String versao = UrnUtil.getVersao(urn);
    	if(!versao.equals("")) {
    		String[] campos = versao.split(";");
    		if(campos.length > 1) {
    			evento = campos[1];
    		}
    	}

		return evento == null? eventoDefault: evento;
	}

	public String getSigla(String urnAutoridade, String urnTipoDocumento) {
		return mapSiglas.get(Pair.of(urnAutoridade, urnTipoDocumento));
	}

	private Stream<Element> elementStream(Element parent, String xPath) {
		return parent.selectNodes(xPath).stream().map(n -> (Element)n);
	}

}
