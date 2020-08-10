
package br.gov.lexml.madoc.editor.urn;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CamposUrn {

    private final static Pattern URN_PATTERN = Pattern
            .compile("urn:lex:br:([^:]+):([^:]+):(\\d{4}(?:-\\d{2}-\\d{2})?);(.+)(@.+)?");

    private String autoridade;
    private String tipo;
    private String strDataRepresentativa;
    private String strNumero;
    private String versao;

    public CamposUrn() {
        //
    }

    public CamposUrn(final String urn) {
        Matcher m = URN_PATTERN.matcher(urn);
        if (m.matches()) {
            autoridade = m.group(1);
            tipo = m.group(2);
            strDataRepresentativa = m.group(3);
            strNumero = m.group(4);
            if (m.groupCount() > 4) {
                versao = m.group(5);
            }
        }
        else {
            throw new IllegalArgumentException("A URN '" + urn + "' não é uma URN válida.");
        }
    }

    public String getAutoridade() {
        return autoridade;
    }

    public void setAutoridade(final String autoridade) {
        this.autoridade = autoridade;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(final String tipo) {
        this.tipo = tipo;
    }

    public String getStrDataRepresentativa() {
        return strDataRepresentativa;
    }

    public void setStrDataRepresentativa(final String strDataRepresentativa) {
        this.strDataRepresentativa = strDataRepresentativa;
    }

    public String getStrNumero() {
        return strNumero;
    }

    public void setStrNumero(final String strNumero) {
        this.strNumero = strNumero;
    }

    public String getVersao() {
        return versao;
    }

    public void setVersao(final String versao) {
        this.versao = versao;
    }

    public Date getDataRepresentativa() throws ParseException {
        String str = strDataRepresentativa;

        if (str == null) {
            return null;
        }

        if (str.length() == 4) {
            str += "-01-01";
        }
        return new SimpleDateFormat("yyyy-MM-dd").parse(str);
    }

}
