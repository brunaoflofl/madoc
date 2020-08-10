package br.gov.lexml.madoc.editor.ws;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/exemplo-integracao")
public class ExemploIntegracaoApiController {
	
	private File f = new File(System.getProperty("java.io.tmpdir"), "documento-madoc.pdf");

	@GetMapping(path = "/abrir", produces = MediaType.APPLICATION_PDF_VALUE)
	public void abrir(HttpServletResponse resp) throws Exception {
		
		if(!f.isFile()) {
			throw new Exception("Arquivo não encontrado!");
		}
		
		IOUtils.copy(new FileInputStream(f), resp.getOutputStream());
		
	}

	@PostMapping(path = "/salvar", consumes = MediaType.APPLICATION_PDF_VALUE)
	public String salvar(InputStream is) throws Exception {
		IOUtils.copy(is, new FileOutputStream(f));
		return "OK";
	}

}
