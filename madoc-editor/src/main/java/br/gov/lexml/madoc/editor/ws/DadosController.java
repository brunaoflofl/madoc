package br.gov.lexml.madoc.editor.ws;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dados")
public class DadosController {

	private static final Log log = LogFactory.getLog(DadosController.class);

	@Value("${madoc.editor.path.dados:./dados}")
	private String pathDados;

	@GetMapping(path = "/materia/get", produces = MediaType.TEXT_XML_VALUE)
	public String get(@RequestParam("materia") String materia) throws Exception {
		return getArquivo(pathDados, "detalhes-materia.xml");
	}

	@GetMapping(path = "/materia/search", produces = MediaType.APPLICATION_JSON_VALUE)
	public String search(@RequestParam("materia") String materia) throws Exception {
		return getArquivo(pathDados, "materias.json");
	}

    @GetMapping(path = "/vetos",produces = MediaType.APPLICATION_JSON_VALUE)
    public String veto() throws Exception {
        return getArquivo(pathDados, "vetos.json");
    }

	private String getArquivo(String dirPath, String fileName) throws FileNotFoundException, IOException {
		return IOUtils.toString(
				new FileInputStream(new File(dirPath, fileName)),
				"UTF-8");
	}

}
