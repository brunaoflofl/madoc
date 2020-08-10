
package br.gov.lexml.madoc.editor.util.genero;

/**
 * Implementação da classe que reúne um conjunto de métodos que visam facilitar a redação de frases
 * envolvendo dispositivos, tal como ocorre na elaboração do comendo de emenda.
 * <p>
 * <a href="GeneroMasculino.java.html"><i>Código Fonte</i></a>
 * </p>
 */
public class GeneroMasculino implements Genero {

    private static final Genero instance = new GeneroMasculino();

    private GeneroMasculino() {
        //
    }

    public static Genero getInstance() {
        return instance;
    }

    @Override
    public String getPronomePossessivoSingular() {
        return " do ";
    }

    @Override
    public String getPronomePossessivoPlural() {
        return " dos ";
    }

    @Override
    public String getArtigoDefinidoSingular() {
        return " o ";
    }

    @Override
    public String getArtigoDefinidoPrecedidoPreposicaoASingular() {
        return " ao ";
    }

    @Override
    public String getArtigoDefinidoPrecedidoPreposicaoAPlural() {
        return " aos ";
    }

    @Override
    public String getArtigoDefinidoPlural() {
        return " os ";
    }

    @Override
    public String getArtigoIndefinidoSingular() {
        return " um ";
    }

    @Override
    public String getContracaoEmArtigoDefinidoSingular() {
        return " no ";
    }
}
