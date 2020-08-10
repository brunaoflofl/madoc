
package br.gov.lexml.madoc.editor.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

public final class NumeracaoUtil {
	
	public enum TipoNumero {
	    ARABICO, ORDINAL_ATE_9, ROMANO, LETRA
	}	

    public static final Pattern NUMERICO = Pattern.compile("\\d+");
    public static final Pattern ROMANO = Pattern
            .compile("M{0,4}(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})", Pattern.CASE_INSENSITIVE);
    public static final Pattern ALFABETICO = Pattern.compile("[a-z]+", Pattern.CASE_INSENSITIVE);

    public static final Pattern PATTERN_ID_SIMPLES = Pattern.compile("^([a-z]+)(\\d+(?:-[\\d]+)*)?u?$");
    public static final Pattern PATTERN_ID_SIMPLES_ULTIMO = Pattern.compile("(\\d*)u?$"); 

    public static final String LETRAS_MAIUSCULAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    public static final String LETRAS_MINUSCULAS = LETRAS_MAIUSCULAS.toLowerCase();

    public static final int I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000;

    public static final String MARCA_DISPOSITIVO_UNICO = "u";

    /**
     * Converte algarismos romanos para número inteiro.
     */
    public static int romanToInt(String numeroRomano) {

        if (numeroRomano.equals("0")) {
            return 0; // Inclusão de inciso antes do primeiro
        }

        if (!NumeracaoUtil.isRomano(numeroRomano)) {
            throw new IllegalArgumentException("O valor '" + numeroRomano
                                               + "' não é um número em algarismos romanos.");
        }

        numeroRomano = numeroRomano.toLowerCase();
        int tot = 0;
        int mode = I;
        for (int i = numeroRomano.length() - 1; i >= 0; i--) {
            int value = NumeracaoUtil.numberCharToInt(numeroRomano.charAt(i));

            if (value > mode) {
                mode = value;
            }
            if (value < mode) {
                tot -= value;
            }
            else {
                tot += value;
            }
        }

        return tot;
    }

    private static int numberCharToInt(final char numeroRomano) {
        if (numeroRomano == 'i') {
            return I;
        }
        if (numeroRomano == 'v') {
            return V;
        }
        if (numeroRomano == 'x') {
            return X;
        }
        if (numeroRomano == 'l') {
            return L;
        }
        if (numeroRomano == 'c') {
            return C;
        }
        if (numeroRomano == 'd') {
            return D;
        }
        if (numeroRomano == 'm') {
            return M;
        }
        return 0;
    }

    /**
     * Converte número inteiro para algarismos romanos.
     */
    public static String intToRoman(int numeroDecimal) {

        if (numeroDecimal == 0) {
            return "0"; // Inclusão de inciso antes do primeiro
        }

        if (numeroDecimal < 1 || numeroDecimal > 3999) {
            return "" + numeroDecimal;
        }
        final StringBuilder buf = new StringBuilder();
        int mode = M;
        while (numeroDecimal > 0) {
            while (numeroDecimal < mode) {
                mode /= 10;
            }
            if (numeroDecimal >= 9 * mode && mode < M) {
                buf.append(NumeracaoUtil.intToRomanChar(mode));
                buf.append(NumeracaoUtil.intToRomanChar(mode * 10));
                numeroDecimal -= 9 * mode;
                continue;
            }
            if (numeroDecimal >= 4 * mode && mode < M) {
                if (numeroDecimal < 5 * mode) {
                    buf.append(NumeracaoUtil.intToRomanChar(mode));
                    numeroDecimal += mode;
                }
                buf.append(NumeracaoUtil.intToRomanChar(5 * mode));
                numeroDecimal -= 5 * mode;
            }
            while (numeroDecimal >= mode) {
                buf.append(NumeracaoUtil.intToRomanChar(mode));
                numeroDecimal -= mode;
            }
        }
        return buf.toString();
    }

    private static char intToRomanChar(final int i) {
        switch (i) {
            case M:
                return 'm';
            case D:
                return 'd';
            case C:
                return 'c';
            case L:
                return 'l';
            case X:
                return 'x';
            case V:
                return 'v';
            case I:
                return 'i';
            default:
                return ' ';
        }
    }

    /**
     * Converte a, aa, ab, ba em números
     */
    public static int alphaToInt(String s) {

        if (s.equals("0")) {
            return 0; // Inclusão de alínea antes da primeira
        }

        if (!NumeracaoUtil.isLetra(s)) {
            throw new IllegalArgumentException("O valor '" + s + "' não é uma sequência de letras.");
        }

        s = s.toLowerCase();

        int acumulador = 0;

        for (int i = 0; i < s.length(); i++) {
            acumulador = s.charAt(i) - 'a' + 1 + acumulador * 26;
        }

        return acumulador;
    }

    /**
     * Converte um número em a, aa, ab, ba...
     */
    public static String intToAlpha(int n) {

        if (n == 0) {
            return "0"; // Inclusão de alínea antes da primeira
        }

        StringBuilder sb = new StringBuilder();

        int d;
        while (n > 0) {
            d = (n - 1) % 26;
            n = (n - d - 1) / 26;
            sb.insert(0, (char) ('a' + d));
        }

        return sb.toString();
    }

    /**
     * Converte uma numeração no formato da URN para uma numeração no formato do rótulo.
     * 
     * @param numeracaoURN Numeração no formato da URN ex: 3-5
     * @param tipoNumero Tipo do número do resultado
     * @return número no formato do rótulo Ex: numeracaoURNToNumeracaoRotulo("3-5",
     *         TipoNumero.ROMANO) == "III-E"
     */
    public static String numeracaoURNToNumeracaoRotulo(final String numeracaoURN, final TipoNumero tipoNumero) {

        if (tipoNumero == null) {
            return numeracaoURN;
        }

        StringBuilder sb = new StringBuilder();

        String[] numeros = numeracaoURN.split("-");
        boolean primeiro = true;
        for (String numero : numeros) {

            if (!NumeracaoUtil.isNumerico(numero)) {
                throw new IllegalArgumentException("O valor '" + numero + "' não é um número arábico.");
            }

            int n = Integer.parseInt(numero);

            if (primeiro) {
                primeiro = false;

                switch (tipoNumero) {
                    case ARABICO:
                        // Mantém o valor atual
                        break;
                    case ORDINAL_ATE_9:
                        if (n < 10) {
                            numero += "º";
                        }
                        break;
                    case ROMANO:
                        numero = NumeracaoUtil.intToRoman(n).toUpperCase();
                        break;
                    case LETRA:
                        numero = NumeracaoUtil.intToAlpha(n);

                }

                sb.append(numero);
            }
            else {
                sb.append("-");
                sb.append(NumeracaoUtil.intToAlpha(n).toUpperCase());
            }

        }

        return sb.toString();
    }

    /**
     * Converte uma numeração no formato do rótulo para uma numeração no formato da URN.
     * <p>
     * O tipo do número é identificado de acordo com a seguinte regra: Letras minúsculas no início
     * indicam TiopNumero.LETRA; Letras maiúsculas indicam TipoNumero.ROMANO; No caso de algarismos
     * arábicos utilizamos TipoNumero.ARABICO. O caracter do ordinal 'º' é removido antes da
     * conversão.
     * </p>
     * 
     * @param rotulo Numeração no formato do rótulo ex: III-E
     * @return número no formato da URN Ex: numeracaoRotuloToNumeracaoURN("III-E") == "3-5"
     */
    public static String numeracaoRotuloToNumeracaoURN(final String rotulo) {
        StringBuilder sb = new StringBuilder();

        String[] numeros = rotulo.replace("º", "").split("-");
        boolean primeiro = true;
        for (String numero : numeros) {

            if (primeiro) {
                primeiro = false;

                if (!NumeracaoUtil.isNumerico(numero)) {
                    if (!NumeracaoUtil.isLetra(numero)) {
                        throw new IllegalArgumentException("O valor '" + numero + "' não pode ser convertido"
                                                           + " para algarismos arábicos.");
                    }

                    if (numero.equals(numero.toUpperCase())) {
                        // Considera número romano quando estiver em maiúsculas
                        numero = Integer.toString(NumeracaoUtil.romanToInt(numero));
                    }
                    else {
                        // Considera letras se estiver em minúsculas
                        numero = Integer.toString(NumeracaoUtil.alphaToInt(numero));
                    }
                }

                sb.append(numero);
            }
            else {
                if (!NumeracaoUtil.isLetra(numero)) {
                    throw new IllegalArgumentException("O valor '" + numero + "' não é uma sequência de letras.");
                }

                sb.append("-");
                sb.append(NumeracaoUtil.alphaToInt(numero));
            }

        }

        return sb.toString();
    }

    public static boolean isNumerico(final String numero) {
        return NUMERICO.matcher(numero).matches();
    }

    public static boolean isRomano(final String numero) {
        return ROMANO.matcher(numero).matches();
    }

    public static boolean isLetra(final String letra) {
        return ALFABETICO.matcher(letra).matches();
    }

    /**
     * Dado um ID de dispositivo retorna o tagId do mesmo.
     * 
     * @param idDispositivo Ex: art10 ou ali1-1
     * @return o identificador do tipo do dispositivo (para os exemplos acima "art" e "ali")
     */
    public static String getTagId(final String idDispositivo) {
        Matcher m = PATTERN_ID_SIMPLES.matcher(NumeracaoUtil.getUltimoDispositivo(idDispositivo));
        if (m.matches()) {
            return m.group(1);
        }
        throw new IllegalArgumentException("O valor '" + idDispositivo + "' não representa um id de dispositivo.");
    }

    /**
     * Dado um ID de dispositivo retorna sua numeração dentro do pai.
     * 
     * @param idDispositivo Ex: art10 ou ali1-1 ou art1u
     * @return o número do dispositivo no pai (para os exemplos acima "10" e "1-1" e "1")
     */
    public static String getNumeroURN(final String idDispositivo) {
        Matcher m = PATTERN_ID_SIMPLES.matcher(NumeracaoUtil.getUltimoDispositivo(idDispositivo));
        if (m.matches()) {
            return StringUtils.defaultString(m.group(2));
        }
        throw new IllegalArgumentException("O valor '" + idDispositivo + "' não representa um id de dispositivo.");
    }
    
    /**
     * Dado um ID de dispositivo retorna o último número de sua numeração dentro do pai.
     * @param idDispositivo Ex: art10 ou ali1-1
     * @return o último número do dispositivo no pai (para os exemplos acima "10" e "1")  
     */
    public static String getNumeroURNUltimo(final String idDispositivo) {
        Matcher m = PATTERN_ID_SIMPLES_ULTIMO.matcher(NumeracaoUtil.getUltimoDispositivo(idDispositivo));
        if (m.find()) {
            return StringUtils.defaultString(m.group(1), "0");
        }
        throw new IllegalArgumentException("O valor '" + idDispositivo + "' não representa um id de dispositivo.");
    }
    
    /**
     * Dado um ID de dispositivo, substitui o ultimo numero da URN pelo valor informado
     * @param idDispositivo Ex: art72_par4 ou art72_par4-1-2
     * @param numero o dispositivo com o ultimo numero substituido (para os exemplos: art72_parX ou art72_par4-1-X)
     * @return
     */
    public static String replaceNumeroURNUltimo(final String idDispositivo, final String numero){
    	if (numero== null || numero.equals("")){
    		return idDispositivo.replaceFirst("-?[\\du?]+$", "");
    	}
    	return idDispositivo.replaceFirst("[\\du?]+$", numero);
    }
    
    /**
     * Retorna o idDispositivo com o último dispositivo apenas com o número base
     * @param idDispositivo ex: art72_par4-1-2
     * @return ex: art72_par4
     */
    public static String getDispositivoUltimoNumeroURNBase(final String idDispositivo){
    	String id= idDispositivo;
    	
    	for (int i= 0; i< StringUtils.countMatches(getNumeroURN(id), "-"); i++){
    		id = id.replaceFirst("-\\d+$", "");
    	}
        
        return id;
    }
    
    
    public static String getUltimoDispositivo(final String idDispositivo) {
        int i = idDispositivo.lastIndexOf('_');
        return i == -1 ? idDispositivo : idDispositivo.substring(i + 1);
    }

    public static boolean temArtigoUnico(final String idDispositivo) {
        return idDispositivo.contains("art1" + MARCA_DISPOSITIVO_UNICO);
    }

    public static boolean temParagrafoUnico(final String idDispositivo) {
        return idDispositivo.contains("par1" + MARCA_DISPOSITIVO_UNICO);
    }

    public static String removeMarcasDispositivoUnico(final String idDispositivo) {
        return idDispositivo.replace("1" + MARCA_DISPOSITIVO_UNICO, "1");
    }

    /**
     * Dadas duas numerações de URN referente a dois dispositivos irmãos, verifica se deve existir
     * pelo menos um irmão entre eles.
     * <p>
     * Ex: entre o 1 e o 1-2 deve existir um 1-1, entre o 2-1 e o 3-1 deve existir pelo menos o 3.
     * </p>
     * <p>
     * Obs: numeracaoURN deve ser posterior à numeracaoURNAnterior
     * </p>
     * 
     * @param numeracaoURNAnterior
     * @param numeracaoURN
     */
    public static boolean existeIrmaoIntermediario(final String numeracaoURNAnterior, final String numeracaoURN) {
        String[] narray1 = numeracaoURNAnterior.split("-"), narray2 = numeracaoURN.split("-");

        int minLen = Math.min(narray1.length, narray2.length);

        int i = 0;
        for (i = 0; i < minLen; i++) {
            int diff = NumeracaoUtil.parseInt(narray2[i]) - NumeracaoUtil.parseInt(narray1[i]);
            if (diff > 1) {
                return true;
            }
            else if (diff == 1) {
                return narray2.length - 1 > i;
            }
        }

        int n1 = narray1.length > minLen ? NumeracaoUtil.parseInt(narray1[i]) : 0;
        int n2 = narray2.length > minLen ? NumeracaoUtil.parseInt(narray2[i]) : 0;
        return n2 - n1 > 1;
    }

    private static int parseInt(final String str) {
        return Integer.parseInt(StringUtils.defaultIfEmpty(str, "0"));
    }

    /**
     * Retorna a raiz comum de disp1 e disp2 limitado ao nível de especificação de disp2.  
     * 
     * @param disp1 Id do dispositivo a ser modificado
     * @param disp2 Id do dispositivo padrão de referência
     * @return Exemplo: dis1: art1_par11-1_aln2; disp2: art1_par8; retorno: art1_par11-1 
     */
    public static String getIdDispMesmoNivel(String disp1, String disp2){
        StringBuilder sb= new StringBuilder();
        
        int disp2_len= disp2.length();
        
        for (int i= 0; i< disp1.length(); i++){
            if (  ( (i>= disp2_len) && (disp1.charAt(i)!= '_') )
               || ( (i< disp2_len) && 
                       (disp1.charAt(i)== disp2.charAt(i) ||
                        "-0123456789".indexOf(disp1.charAt(i))> -1) )
                ){
                sb.append(disp1.charAt(i));
            } else {
                break;
            }
        }
        
        return sb.toString();
    }    
    
    /**
     * Retorna um novo ID que representa o dispositivo imediatamente posterior ao disp1.<br>
     * Caso não seja possível calcular ou não exista um próximo dispositivo, retorna null.<br>
     * Assume-se que disp1 é anterior a disp2. 
     * @param disp1
     * @param disp2
     */
    public static String getNovoIdDispositivoEntreDispositivosAposDisp1(final String id1, final String id2){
        
        if (id1== null){
            return null;
        }
        
        //casos que dependem de id2
        if (id2!= null){
            //casos em que NÃO É POSSÍVEL existir próximo:
            
            //caso exemplo:
            //id1= art72_par4
            //id2= art72_par4
            if (id1.equals(id2)){
                return null;
            }
                    
            //caso exemplo:
            //id1= art72_par4
            //id2= art72_par4-1
            if (id2.equals(id1+"-1")){
                return null;
            }
            
            //casos em que É POSSÍVEL existir próximo:
            
            //caso exemplo:
            //id1= art72_par4
            //id2= art72_par4-2
            //ret= art72_par4-1 (inserir "-1" no último)
            if ( (id2.length()>= id1.length())
                 && (getDispositivoUltimoNumeroURNBase(getIdDispMesmoNivel(id2, id1)).equals(id1)) 
                ){
                return id1+"-1"; 
            }
        }
        
        //caso exemplo:
        //id1= art72_par4-1 ou art72_par4 ou art72_par4-1
        //id2= art72_par4-3 ou art72_par6 ou art72_par4-3
        //ret= art72_par4-2 ,  art72_par5 ,  art72_par4-2 (somar +1 no último)

        //obtendo o ultimo numero no dispositivo
        String ultimoNumero = NumeracaoUtil.getNumeroURNUltimo(id1);
        String candidato;
        
        if ((ultimoNumero != null) && (!ultimoNumero.equals(""))) {
            candidato = NumeracaoUtil.replaceNumeroURNUltimo(id1, String.valueOf(Integer.parseInt(ultimoNumero)+1));
        } else {
            return null;
        }

        //testando casamento com id2
        
        //caso exemplo:
        //id1= art72_par4-1 ou art72_par4
        //id2= art72_par4-2 ou art72_par5
        //ret= art72_par4-1-1 , art72_par4-1 (inserir "-1" no último)
        if (id2!= null && candidato.equals(id2)){
            return id1.concat("-1");
        }
        
        return candidato;
    }
    
    /**
     * Retorna um novo ID que representa o dispositivo imediatamente anterior ao disp2.<br>
     * Caso não seja possível calcular ou não exista um dispositivo anterior, retorna null.<br>
     * Assume-se que disp1 é anterior a disp2. 
     * @param disp1
     * @param disp2
     */
    public static String getNovoIdDispositivoEntreDispositivosAntesDisp2(final String id1, final String id2){
        
        if (id2== null){
            return null;
        }
        
        //CASO 0 - NÃO EXISTE:
        //id1= INDIFERENTE
        //id2= art72_par1
        //ret= null
        String id2_numeroURN= NumeracaoUtil.getNumeroURN(id2);
        if (!id2_numeroURN.contains("-") && id2_numeroURN.equals("1")){
            return null;
        }
        
        //CALCULANDO CANDIDADO
        
        //obtendo o ultimo numero no dispositivo
        String ultimoNumero = NumeracaoUtil.getNumeroURNUltimo(id2);

        //encontrando o número anterior candidato
        String candidato;
        if ( (ultimoNumero!= null) && (!ultimoNumero.equals("")) ){
            if (ultimoNumero.equals("1")){
                candidato= NumeracaoUtil.replaceNumeroURNUltimo(id2, null);
            } else {
                candidato= NumeracaoUtil.replaceNumeroURNUltimo(id2, String.valueOf(Integer.parseInt(ultimoNumero)-1));
            }
            
        } else {
            return null;
        }  
        
        //casos que dependem de id1
        if (id1!= null){

            //CASO 1 - NÃO EXISTE:
            //id1= art72_par4
            //id2= art72_par4-1
            //ret= null
            if (id2.equals(id1+"-1")){
                return null;
            }
            
            //DEFININDO id1_anterior, id1_anterior_completo 
            
            //retorna o id1_anterior completo no mesmo nível de id2 
            //exemplo: 
            //id1= art72_par4-1_par1
            //id2= art72_par5
            //id1_anterior= art72_par4-1
            String id1_anterior_completo= getIdDispMesmoNivel(id1, id2);
            
            //definindo o id1 no mesmo nível do id2 (sem subdivisões)
            //exemplo: 
            //id1= art72_par4-1_par1
            //id2= art72_par5
            //id1_anterior= art72_par4
            String id1_anterior= getDispositivoUltimoNumeroURNBase(id1_anterior_completo);
            
            //VERIFICANDO CASOS

            //CASO 2 - PRÓXIMO DO ANTERIOR NO MESMO NÍVEL
            //id1= art72_par5-1 ou art72_par5-1_par1 ou art72_par5-5
            //id2= art72_par6
            //ret= art72_par5-2 ,  art72_par5-2      ,  art72_par5-4
            if (candidato.equals(id1_anterior) &&
                    (NumeracaoUtil.getNumeroURN(id1_anterior_completo).contains("-"))){
                return getNovoIdDispositivoEntreDispositivosAposDisp1(id1_anterior_completo, id2);
            }
            
            //CASO 3:
            //id1= art72_par3       ou art72_par1_ali1
            //id2= art72_par4       ou art72_par2
            //ret= art72_par3-1     ,  art72_par1-1
            //if (getNovoIdDispositivoEntreDispositivosAposDisp1(id1_anterior, null).equals(id2)){
            if (candidato.equals(id1_anterior_completo)){
                //return getNovoIdDispositivoEntreDispositivosAposDisp1(id1_anterior, id2);
                return id1_anterior_completo+"-1";
            }
                
            //CASO 4:
            //id1= art72_par1_ali1   ou art72_par1      ou art72            ou art1 ou art1
            //id2= art72_par5        ou art72_par1-5    ou art72_par2-1     ou art5 ou art1_par2
            //ret= art72_par4        ,  art72_par4-4    ,  art72_par2       ,  art4 ,  art1_par1
            if (!candidato.equals(id1)){
                return candidato;
            } 
        }

        return candidato; 
    }        
    
}
