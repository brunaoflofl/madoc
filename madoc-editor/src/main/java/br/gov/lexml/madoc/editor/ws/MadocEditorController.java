package br.gov.lexml.madoc.editor.ws;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.python.google.common.io.Files;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.annotation.SessionScope;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.gov.lexml.madoc.editor.service.HostIntegrationService;
import br.gov.lexml.madoc.editor.urn.UrnTranslator;
import br.gov.lexml.madoc.server.catalog.CatalogService;
import br.gov.lexml.madoc.server.catalog.ModelInfo;
import br.gov.lexml.madoc.server.execution.hosteditor.DefaultHostEditor;
import br.gov.lexml.madoc.server.execution.hosteditor.HostEditor;
import br.gov.lexml.madoc.server.javascript.CatalogIndexJsonBuilder;
import br.gov.lexml.madoc.server.javascript.WizardExecutionJavascript;
import br.gov.lexml.madoc.server.rendition.Rendition;
import br.gov.lexml.madoc.server.schema.entity.MetadataType;
import br.gov.lexml.madoc.server.util.JsonUtil;
import br.gov.lexml.madoc.server.util.MadocStringUtils;
import br.gov.lexml.madoc.server.util.MetadataUtil;

// TODO - Rever local da sessão
@RestController
@RequestMapping("/api")
@SessionScope
public class MadocEditorController {

	private static final Log log = LogFactory.getLog(MadocEditorController.class);

	@Value("${madoc.editor.path.modelos:./modelos}")
	private String pathModelos;

	@Value("${madoc.editor.path.dados:./dados}")
	private String pathDados;

	@Autowired
	private CatalogService catalogService;

	@Autowired
	private UrnTranslator urnTranslator;

	@Autowired
	private HostIntegrationService hostIntegrationService;

	private Map<String, WizardExecutionJavascript> executions = Collections.synchronizedMap(new HashMap<>());

	@GetMapping(path = "/modelos/{tipoDocumento}", produces = MediaType.APPLICATION_JSON_VALUE)
	public String getModelos(@PathVariable String tipoDocumento) throws Exception {

		List<ModelInfo> models = new ArrayList<ModelInfo>(catalogService.getAvailableMadocDocumentModels());

		// Deixa apenas os modelos que estão habilitados, não obsoletos e do
		// tipo de documento informado
		String docType = MadocStringUtils.retiraAcentos(tipoDocumento).toLowerCase();
		Iterator<ModelInfo> it = models.iterator();
		while (it.hasNext()) {
			ModelInfo mi = it.next();

			if (!mi.getMetadata().isEnabled() || mi.getCatalogItem().isObsolete()) {
				it.remove();
			} else {

				Map<String, Object> map = MetadataUtil.getMap(mi.getMetadata());

				String docTypeFromMetadata = (String) map.get(MetadataUtil.KEY_TIPO_MODELO);

				if (docTypeFromMetadata == null || !docType.toLowerCase().equals(MadocStringUtils.retiraAcentos(docTypeFromMetadata.toLowerCase()))) {
					it.remove();
				} else {

					// Traduz URN
					Object obj = map.get(MetadataUtil.KEY_FUNDAMENTACAO);
					if (obj != null) {
						Map<String, List<String>> mapFundamentacao = (Map<String, List<String>>) obj;
						for (String f : mapFundamentacao.keySet()) {
							List<String> urns = mapFundamentacao.get(f);
							if (urns != null) {
								List<String> nUrns = new ArrayList<String>(urns.size());
								for (String u : urns) {
									if(u.startsWith("urn:")) {
										nUrns.add(urnTranslator.getNomeExtenso(u));
									}
									else {
										nUrns.add(u);
									}
								}
								mapFundamentacao.put(f, nUrns);
								MetadataUtil.setMap(mi.getMetadata(), map);
							}
						}
					}

				}
			}
		}

		return new CatalogIndexJsonBuilder(models).build();

//		return getArquivo(pathModelos, "catalogo-" + tipoDocumento.toLowerCase() + ".json");
	}

	@GetMapping(path = "/dados/json/{nomeArquivo}", produces = MediaType.APPLICATION_JSON_VALUE)
	public String getDadosEmJson(@PathVariable String nomeArquivo) throws FileNotFoundException, IOException {
		return getArquivo(pathDados, nomeArquivo.replaceAll("(?i)\\.json$", "") + ".json");
	}

	@GetMapping(path = "/dados/xml/{nomeArquivo}", produces = MediaType.APPLICATION_XML_VALUE)
	public String getDadosEmXML(@PathVariable String nomeArquivo) throws FileNotFoundException, IOException {
		return getArquivo(pathDados, nomeArquivo.replaceAll("(?i)\\.xml$", "") + ".xml");
	}

	@GetMapping(path = "/novo/{codigoModelo}", produces = MediaType.APPLICATION_JSON_VALUE)
	public String novo(@PathVariable String codigoModelo) throws Exception {

		WizardExecutionJavascript execution = new WizardExecutionJavascript(catalogService, codigoModelo);
		executions.put(execution.getUUID(), execution);
		execution.setHostEditor(getHostEditor());

//		Map<String, Object> props = new HashMap<String, Object>();
//		props.put(MetadataUtil.KEY_TIPO_MODELO, tipoModelo);
//		props.put(MetadataUtil.KEY_ELABORADOR, lexeditService.hasUsuarioLogado() ? lexeditService.getUserLogin() : "Anônimo");
//		props.put(MetadataUtil.KEY_ANO_EPIGRAFE, new GregorianCalendar().get(Calendar.YEAR) + "");
//		props.put(MetadataUtil.KEY_VALIDO, false);
//		execution.setAnswerMedatada(MetadataUtil.dataSetFromMap(props));

		String jsonModel = execution.getFormModelJson();

		// Propriedades não persistidas como metadados. Apenas visualização
		MetadataType metadata = execution.getCurrentMadocDocument().getMetadata();
		String tipoModelo = MetadataUtil.getTipoModelo(metadata);
		String tituloModelo = MetadataUtil.getTitulo(metadata);

		Map<String, Object> props = new HashMap<String, Object>();
		props.put(MetadataUtil.KEY_TIPO_MODELO, tipoModelo);
		props.put("Nome", tituloModelo);

		return createJsonDocument(execution.getUUID(), new String[] { "properties", JsonUtil.serialize(props) },
				new String[] { "wizard", jsonModel });

//		return getArquivo(pathModelos, codigoModelo + ".json");
	}

	@GetMapping(path = "/abrir", produces = MediaType.APPLICATION_JSON_VALUE)
	public String abrir(@RequestParam String openUrl) throws Exception {

		File f = hostIntegrationService.open(openUrl);

		if(f == null) {
			throw new Exception("Documento não encontrado.");
		}

		WizardExecutionJavascript execution = new WizardExecutionJavascript(catalogService, f);
		executions.put(execution.getUUID(), execution);
		execution.setHostEditor(getHostEditor());

		MetadataType metadata = execution.getCurrentMadocDocument().getMetadata();
		String tipoModelo = MetadataUtil.getTipoModelo(metadata);
		String tituloModelo = MetadataUtil.getTitulo(metadata);

		Map<String, Object> props = new HashMap<String, Object>();
		props.put(MetadataUtil.KEY_TIPO_MODELO, tipoModelo);
//		props.put(MetadataUtil.KEY_ELABORADOR, autor);
		props.put("Nome", tituloModelo);
//		props.put("Modelo", MetadataUtil.getModeloForProperties(execution.getCurrentMadocDocument().getMetadata()));

//		session.addDocument(doc);

		String jsonModel = execution.getFormModelJson();

		return createJsonDocument(execution.getUUID(), new String[] { "properties", JsonUtil.serialize(props) },
				new String[] { "answers", JsonUtil.serialize(execution.getOriginalAnswerMap()) },
				new String[] { "wizard", jsonModel });

//		return getArquivo(pathDados, "abrir-resp.json");
	}

	@PostMapping(path = "/salvar", consumes = MediaType.APPLICATION_JSON_VALUE)
	public String save(@RequestBody String strParams) throws Exception {

		Map<String, Object> params = (Map<String, Object>) JsonUtil.deserializeToObject(strParams);

		String saveUrl = (String) params.get("saveUrl");

		String uuid = (String) params.get("uuid");

		if (uuid == null) {
			throw new Exception("Atributo 'uuid' deve ser preenchido.");
		}

		WizardExecutionJavascript execution = executions.get(uuid);
		if (execution == null) {
			throw new Exception("Documento não encontrado para o uuid informado.");
		}

//		doc.setValid((boolean) params.get("valido"));
//		String name = (String) params.get("name");

//		if (saveUrl == null && name == null) {
//			throw new Exception("Atributo 'name' deve ser preenchido.");
//		}

		Map<String, List<Object>> answers = (Map<String, List<Object>>) params.get("answers");

		if (answers == null) {
			throw new Exception("Atributo 'answers' deve ser preenchido.");
		}

		Map<String, Object> props = new HashMap<String, Object>();
		String tipoModelo = MetadataUtil.getTipoModelo(execution.getCurrentMadocDocument().getMetadata());

		props.put(MetadataUtil.KEY_TIPO_MODELO, tipoModelo);
	//	props.put(MetadataUtil.KEY_ELABORADOR, lexeditService.getUserLogin());
//		props.put(MetadataUtil.KEY_ANO_EPIGRAFE, new GregorianCalendar().get(Calendar.YEAR) + "");
		props.put(MetadataUtil.KEY_VALIDO, "" + (boolean)params.get("valido"));
		execution.setAnswerMedatada(MetadataUtil.dataSetFromMap(props));

		execution.setQuestionValues(answers);

		// TODO - Verificar se procede
		if (!execution.isRequiredQuestionsAnswered()) {
			throw new Exception("Todas as questões obrigatórias devem ser preenchidas.");
		}

		HostEditor hostEditor = getHostEditor();
		final Rendition rendition = new Rendition(catalogService, execution.createMadocAnswer(),
				execution.getCurrentMadocDocument(), execution.getMadocSkeleton(), hostEditor);

		File f = File.createTempFile("madoc-document", ".pdf");

		rendition.saveToPDF(f);

		hostIntegrationService.save(f, saveUrl);

		return "OK";
	}

	@PostMapping(path = "/gerarpdf", consumes = MediaType.APPLICATION_JSON_VALUE)
	public String generatePdf(@RequestBody String strParams) throws Exception {

		Map<String, Object> params = (Map<String, Object>) JsonUtil.deserializeToObject(strParams);

		String uuid = (String) params.get("uuid");

		if (uuid == null) {
			throw new Exception("Atributo 'uuid' deve ser preenchido.");
		}

		WizardExecutionJavascript execution = executions.get(uuid);
		if (execution == null) {
			throw new Exception("Documento não encontrado para o uuid informado.");
		}

//		doc.setValid((boolean) params.get("valido"));
//		String name = (String) params.get("name");

//		if (saveUrl == null && name == null) {
//			throw new Exception("Atributo 'name' deve ser preenchido.");
//		}

		Map<String, List<Object>> answers = (Map<String, List<Object>>) params.get("answers");

		if (answers == null) {
			throw new Exception("Atributo 'answers' deve ser preenchido.");
		}

		Map<String, Object> props = new HashMap<String, Object>();
		String tipoModelo = MetadataUtil.getTipoModelo(execution.getCurrentMadocDocument().getMetadata());

		props.put(MetadataUtil.KEY_TIPO_MODELO, tipoModelo);
	//	props.put(MetadataUtil.KEY_ELABORADOR, lexeditService.getUserLogin());
//		props.put(MetadataUtil.KEY_ANO_EPIGRAFE, new GregorianCalendar().get(Calendar.YEAR) + "");
		props.put(MetadataUtil.KEY_VALIDO, "" + (boolean)params.get("valido"));
		execution.setAnswerMedatada(MetadataUtil.dataSetFromMap(props));

		execution.setQuestionValues(answers);

		// TODO - Verificar se procede
		if (!execution.isRequiredQuestionsAnswered()) {
			throw new Exception("Todas as questões obrigatórias devem ser preenchidas.");
		}

		HostEditor hostEditor = getHostEditor();
		final Rendition rendition = new Rendition(catalogService, execution.createMadocAnswer(),
				execution.getCurrentMadocDocument(), execution.getMadocSkeleton(), hostEditor);

		File f = File.createTempFile("madoc-document", ".pdf");

		rendition.saveToPDF(f);

		return f.getName();
	}

	@GetMapping(path = "getpdf/{nomeArquivo}/{nomeDownload}", produces = MediaType.APPLICATION_PDF_VALUE)
	public void getPdf(@PathVariable String nomeArquivo, @PathVariable String nomeDownload,
			HttpServletResponse response) throws Exception {

		File f = new File(System.getProperty("java.io.tmpdir"), nomeArquivo);

		if(!f.isFile()) {
			throw new Exception("Arquivo " + nomeArquivo + " não encontrado.");
		}

		Files.copy(f, response.getOutputStream());
	}

	private String getArquivo(String dirPath, String fileName) throws FileNotFoundException, IOException {
		return IOUtils.toString(
				new FileInputStream(new File(dirPath, fileName)),
				"UTF-8");
	}

	private String createJsonDocument(String uuid, String[]... fields) throws IOException {

		ObjectMapper mapper = new ObjectMapper();

		StringWriter writer = new StringWriter();
		JsonGenerator json = mapper.getFactory().createGenerator(writer);

		json.writeStartObject();
		json.writeStringField("uuid", uuid);
		for (String[] field : fields) {
			json.writeFieldName(field[0]);
			json.writeRawValue(field[1]);
		}
		json.writeEndObject();

		json.flush();

		return writer.toString();
	}

	public HostEditor getHostEditor() throws Exception {

		Map<String, String> pMap = null;

		HostEditor he = new DefaultHostEditor();

		try {
//			inicializaPreferencias(he);
			byte[] sf = IOUtils.toByteArray(
					MadocEditorController.class.getResourceAsStream("/brasao.jpg"));
			byte[] cn = IOUtils.toByteArray(
					MadocEditorController.class.getResourceAsStream("/brasao_cn.jpg"));

			String sfBase64 = Base64.getEncoder().encodeToString(sf);
			String cnBase64 = Base64.getEncoder().encodeToString(cn);

			he.getProperties().put("brasao", sfBase64);
			he.getProperties().put("brasao_cn", cnBase64);

		} catch (Exception e) {
			log.error("erro ao carregar as preferências", e);
		}

		return he;
	}


}
