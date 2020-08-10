
package br.gov.lexml.madoc.editor.urn;


/**
 * Métodos utilitários para tratar a String da URN.
 */
public class UrnUtil {

    // Formato da urn nova
    // urn:lex:br:senado.federal:projeto.lei;plc:2010;7@2010-03-08;iniciativa

    // Formato da urn antiga da proposicao
    // urn:lex:br:camara.deputados:projeto.lei:2010-01-01;7:@200504040101

    private final static int AUTORIDADE = 3;
    private final static int TIPO = 4;
    private final static int DETALHES = 5;
    private final static int OUTROS = 6;
    
//    public static ReferenciaProposicao getReferenciaProposicao(UrnService svc, final String urn) {
//    	
//        // Quebra partes principais
//        String[] campos = urn.split(":");
//
//        String autoridade = campos[AUTORIDADE];
//        String tipo = campos[TIPO];
//        String detalhes = campos[DETALHES];
//        if (campos.length > 6) {
//            detalhes += campos[OUTROS];
//        }
//
//        // Obtém sigla
//        String sigla = UrnUtil.getSigla(svc, autoridade, tipo);
//
//        // Obtém versão e remove versão do campo detalhes
//        String versao = null;
//        int i = detalhes.indexOf("@");
//        if (i > -1) {
//            versao = detalhes.substring(i + 1);
//            detalhes = detalhes.substring(0, i);
//        }
//
//        // Obtém ano, numero e numeroComplemento
//        String[] camposDetalhes = detalhes.split(";");
//        String ano = camposDetalhes[0];
//        i = ano.indexOf("-");
//        if (i > -1) {
//            ano = ano.substring(0, i);
//        }
//        String numero = camposDetalhes[1].toUpperCase();
//        String numeroComplemento = null;
//        if (camposDetalhes.length > 2) {
//            numeroComplemento = camposDetalhes[2];
//        }
//
//        // Monta retorno
//        ReferenciaProposicao rp = new ReferenciaProposicao();
//
//        rp.setSigla(sigla);
//        rp.setAno(new Integer(ano));
//        rp.setNumero(numero);
//        if (numeroComplemento != null) {
//            rp.setNumeroComplemento(new Integer(numeroComplemento));
//        }
//        if (versao != null) {
//            rp.setVersao(versao);
//        }
//
//        return rp;
//    }

    /**
     * Retorna o nome do diretório da proposicao a partir de sua urn
     * 
     * @param urn
     * @return Diretorio O diretorio da proposicao
     */
//    public static String getNomeDiretorioProposicao(UrnService svc, final String urn) {
//        ReferenciaProposicao rp = UrnUtil.getReferenciaProposicao(svc, urn);
//        return UrnUtil.getNomeDiretorioProposicao(rp);
//    }

//    public static String getNomeDiretorioProposicao(final Proposicao p) {
//        return UrnUtil.getNomeDiretorioProposicao(new ReferenciaProposicao(p));
//    }

//    public static String getNomeDiretorioProposicao(final ReferenciaProposicao rp) {
//        // TODO - Voltar a considerar o timestamp após revisão do esquema de versões
//        String strVersao = UrnUtil.getVersaoParaNomeDiretorio(rp.getVersao());
//
//        return rp.getSigla() + "_" + rp.getNumero() + "_" + StringUtil.nullToEmpty(rp.getNumeroComplemento())
//               + "_" + rp.getAno() + "_" + strVersao;
//    }

//    private static String getVersaoParaNomeDiretorio(String versao) {
//        versao = StringUtil.nullToEmpty(versao);
//        Matcher m = Pattern.compile("([^;]+;[^;]+);.+").matcher(versao);
//        if (m.matches()) {
//            versao = m.group(1);
//        }
//        return versao.replace(';', '_');
//    }

    /**
     * Recupera a sigla de proposicao a partir da autoridade e do tipo de documento
     */
    private static String getSigla(UrnService svc, final String autoridade, final String tipo) {
        String[] camposTipo = tipo.split(";");
        if (camposTipo.length > 1) {
            return camposTipo[1].toUpperCase();
        }
        return svc.getSigla(autoridade, tipo);
    }

    public static String getTipoDocumento(final String urn) {
        String[] campos = urn.split(":");
        return campos[TIPO];
    }

	public static String getVersao(String urn) {
		int i = urn.indexOf("@");
		return i != -1? urn.substring(i + 1): "";
	}

	public static String getCampo(String str, int idxCampo) {
		return getCampo(str, idxCampo, ";");
	}
	
	public static String getCampo(String str, int idxCampo, String splitRegex) {
		String[] campos = str.split(splitRegex);
		if(idxCampo < campos.length) {
			return campos[idxCampo];
		}
		else {
			return "";
		}
	}
	
	public static String retiraFragmento(String urn) {
    	int i = urn.indexOf('!');
    	if(i != -1) {
    		return urn.substring(0, i);
    	}
    	return urn;
	}
	
	public static String getFragmento(String urn) {
    	int i = urn.indexOf('!');
    	if(i != -1) {
    		return urn.substring(i + 1);
    	}
    	return "";
	}

	public static String alteraEventoUrn(String urn, String eventoUrn) {
		int i = urn.indexOf("@");
		if(i != -1) {
			urn = urn.substring(0, i);
		}
		return urn + "@data.evento;" + eventoUrn;
	}
	
}
