
package br.gov.lexml.madoc.editor.util.genero;

/**
 * Implementação da classe que reúne um conjunto de métodos que visam facilitar a redação de frases
 * envolvendo dispositivos, tal como ocorre na elaboração do comendo de emenda.
 * <p>
 * <a href="GeneroFeminino.java.html"><i>Código Fonte</i></a>
 * </p>
 */
public class GeneroFeminino implements Genero {

    private static final Genero instance = new GeneroFeminino();

    private GeneroFeminino() {
        //
    }

    public static Genero getInstance() {
        return instance;
    }

    @Override
    public String getPronomePossessivoSingular() {
        return " da ";
    }

    @Override
    public String getPronomePossessivoPlural() {
        return " das ";
    }

    @Override
    public String getArtigoDefinidoSingular() {
        return " a ";
    }

    @Override
    public String getArtigoDefinidoPlural() {
        return " as ";
    }

    @Override
    public String getArtigoIndefinidoSingular() {
        return " uma ";
    }

    @Override
    public String getArtigoDefinidoPrecedidoPreposicaoASingular() {
        return " à ";
    }

    @Override
    public String getArtigoDefinidoPrecedidoPreposicaoAPlural() {
        return " às ";
    }

    @Override
    public String getContracaoEmArtigoDefinidoSingular() {
        return " na ";
    }

}
