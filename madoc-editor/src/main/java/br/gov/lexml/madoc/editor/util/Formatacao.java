
package br.gov.lexml.madoc.editor.util;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Utilitário para formatação de tipos de dados.
 * <p>
 * <a href="Formatacao.java.html"><i>Código Fonte</i></a>
 * </p>
 */
public class Formatacao {

    public static final Locale LOCALE_BR = new Locale("pt", "BR");

    /**
     * Retorna uma String vazia se o parâmetro String valor for nulo, caso contrario retorna o
     * conteúdo de valor, sem a formatação ("." e ",")
     * 
     * @param valor um objeto do tipo String.
     * @return String vazia se valor igual a null, caso contrario retorna o conteúdo de valor sem
     *         formatação.
     */
    public static String desformataString(String valor) {

        if (valor == null) {
            valor = "";
        }
        else {
            valor = valor.replace(".", "");
            valor = valor.replace(",", "");
        }

        return valor;
    }

    /**
     * Retorna uma String vazia se o parâmetro String valor for nulo, caso contrario retorna o
     * conteúdo de valor.
     * 
     * @param valor um objeto do tipo String.
     * @return String vazia se valor igual a null, caso contrario retorna o conteúdo de valor.
     */
    public static String formataString(final String valor) {
        return valor == null ? "" : valor;
    }

    /**
     * Formata um número inteiro (int).
     * 
     * @param valor um número do tipo int.
     * @return String com o valor interio formatado conforme a localização Português/Brasil.
     */
    public static String formataNumeroInteiro(final int valor) {
        NumberFormat nf = NumberFormat.getIntegerInstance(LOCALE_BR);
        return nf.format(valor);
    }

    /**
     * Formata um número inteiro (long).
     * 
     * @param valor um número do tipo long.
     * @return String com o valor interio formatado conforme a localização Português/Brasil.
     */
    public static String formataNumeroInteiro(final long valor) {
        NumberFormat nf = NumberFormat.getIntegerInstance(LOCALE_BR);
        return nf.format(valor);
    }

    /**
     * Formata um número de ponte flutuante (double).
     * 
     * @param valor um número do tipo double.
     * @return String com o valor de ponto flutuante formatado conforme a localização
     *         Português/Brasil.
     */
    public static String formataNumeroDecimal(final double valor) {
        NumberFormat nf = NumberFormat.getNumberInstance(LOCALE_BR);
        nf.setMaximumFractionDigits(2);
        return nf.format(valor);
    }

    /**
     * Formata um número de ponte flutuante (double).
     * 
     * @param valor um número do tipo double.
     * @param formato mascara de formatação a ser aplicada. Veja o javadoc da classe
     *        "java.text.DecimalFormat" para ver os formatos permitidos.
     * @return String com o valor de ponto flutuante formatado conforme o formato indicado pelo
     *         parâmetro "formato" e a localização Português/Brasil.
     * @see java.text.DecimalFormat
     */
    public static String formataNumeroDecimal(final double valor, final String formato) {
        DecimalFormat df = new DecimalFormat(formato, new DecimalFormatSymbols(LOCALE_BR));
        return df.format(valor);
    }

    /**
     * Formata uma data.
     * 
     * @param valor um objeto do tipo Date.
     * @return String com a data formatada usando o formato completo. Ex: Terça-feira, 18 de Abril
     *         de 2006
     */
    public static String formataDataLonga(final Date valor) {
        return Formatacao.formataData(valor, DateFormat.FULL);
    }

    /**
     * Formata uma data.
     * 
     * @param valor um objeto do tipo Date.
     * @return String com a data formatada usando o formato "dd/MM/YYYY" (dia/mês/ano).
     */
    public static String formataData(final Date valor) {
        return Formatacao.formataData(valor, "dd/MM/yyyy");
    }

    /**
     * Formata hora.
     * 
     * @param valor um objeto do tipo Date.
     * @return String com a hora formatada usando o formato "HH:mm" (hora:minuto).
     */
    public static String formataHora(final Date valor) {
        return Formatacao.formataData(valor, "HH:mm");
    }

    public static String formataDataHora(final Date valor) {
        return Formatacao.formataData(valor, "dd/MM/yyyy HH:mm");
    }
    
    /**
     * Formata uma data.
     * 
     * @param valor um objeto do tipo Date.
     * @param formato mascara de formatação a ser aplicada. Veja o javadoc da classe
     *        "java.text.SimpleDateFormat" para ver os formatos permitidos.
     * @return String com a hora formatada usando o formato "HH:mm:ss" (hora/minuto/segundo).
     * @see java.text.SimpleDateFormat
     */
    public static String formataData(final Date valor, final String formato) {
        SimpleDateFormat sdf = new SimpleDateFormat(formato, LOCALE_BR);
        return sdf.format(valor);
    }

    /**
     * Formata uma data.
     * 
     * @param valor um objeto do tipo Date.
     * @param tipoFormato tipo de formatação a ser aplicada. Veja o javadoc da classe
     *        "java.text.DateFormat" para ver os formatos permitidos.
     * @return String com a hora formatada usando o formato indicado no parâmetro "tipoFormato".
     * @see java.text.DateFormat
     */
    public static String formataData(final Date valor, final int tipoFormato) {
        DateFormat df = DateFormat.getDateInstance(tipoFormato, LOCALE_BR);
        return df.format(valor);
    }

    /**
     * Formata um inteiro longo que contém a uma quantidade de bytes. Usa a unidade de medida (KB,
     * MB, etc) mais adequada.
     * 
     * @param valor inteiro do tipo long que contém a quantidade em bytes.
     * @return String com o quantidade de bytes formatada.
     */
    public static String formataQtdeBytes(final long valor) {
        StringBuilder buffer = new StringBuilder(64);
        int x = 0;
        double qt = valor;

        for (x = 0; x < 4; x++) {
            if (qt < 1024) {
                break;
            }
            qt /= 1024;
        }

        buffer.append(Formatacao.formataNumeroDecimal(qt));

        switch (x) {
            case 0:
                buffer.append(" Bytes");
                break;
            case 1:
                buffer.append(" KB");
                break;
            case 2:
                buffer.append(" MB");
                break;
            case 3:
                buffer.append(" GB");
                break;
            default:
                buffer.append(" TB");
                break;
        }

        return buffer.toString();
    }

    public static String formataDataExtenso(final Date dt) {
        String str = Formatacao.formataData(dt, "d 'de' MMMM 'de' yyyy").toLowerCase();
        if (str.startsWith("1 ")) {
            return str.replace("1 ", "1º ");
        }
        return str;
    }
}