package br.gov.lexml.madoc.server.rendition;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.fop.apps.MimeConstants;
import org.w3c.dom.Element;

import br.gov.lexml.madoc.server.MadocException;
import br.gov.lexml.madoc.server.catalog.CatalogException;
import br.gov.lexml.madoc.server.catalog.CatalogService;
import br.gov.lexml.madoc.server.catalog.MadocSkeletonModelData;
import br.gov.lexml.madoc.server.execution.CatalogEventListenerExecution;
import br.gov.lexml.madoc.server.execution.hosteditor.HostEditor;
import br.gov.lexml.madoc.server.schema.entity.MadocAnswerType;
import br.gov.lexml.madoc.server.schema.entity.MadocDocumentType;
import br.gov.lexml.madoc.server.schema.entity.MadocSkeletonType;
import br.gov.lexml.madoc.server.util.BytesUtil;
import br.gov.lexml.madoc.server.util.XMLUtil;
import br.gov.lexml.pdfa.PDFAttachmentFile;

/**
 * Printing a MadocAnswerType and MadocDocumentType pair.
 *
 * @author lauro
 *
 */
public class Rendition {

	private final MadocDocumentType madocDocument;
	private final MadocAnswerType madocAnswer;
	private final CatalogService catalogService;
	protected CatalogEventListenerExecution catalogEventListenerExecution;
	private HostEditor hostEditor;

	private MadocSkeletonType madocSkeleton;

	private TemplateProcessor processor;

	private List<PDFAttachmentFile> attachments = new ArrayList<PDFAttachmentFile>();

	private static final Log log = LogFactory.getLog(Rendition.class);

	public Rendition(CatalogService catalogService, MadocAnswerType madocAnswer, MadocDocumentType madocDocument,
			MadocSkeletonType madocSkeleton) {
		this(catalogService, madocAnswer, madocDocument, madocSkeleton, null);
	}

	public Rendition(CatalogService catalogService, MadocAnswerType madocAnswer, MadocDocumentType madocDocument,
			MadocSkeletonType madocSkeleton, HostEditor hostEditor) {
		this.madocAnswer = madocAnswer;
		this.catalogService = catalogService;
		this.hostEditor = hostEditor;
		this.madocDocument = madocDocument;
		this.madocSkeleton = madocSkeleton;
	}

	@Override
	protected void finalize() throws Throwable {
		super.finalize();
		catalogService.removeCatalogEventListener(catalogEventListenerExecution);
		catalogEventListenerExecution = null;
	}

	public MadocDocumentType loadMadocDocumentFromAnswer(CatalogService catalogService, MadocAnswerType madocAnswer)
			throws CatalogException {
		try {
			String id = madocAnswer.getMadocReferences().getMadocDocument().getId();
			return catalogService.getMadocDocumentModel(id).getMadocDocument();
		} catch (NullPointerException e) {
			throw new CatalogException("MadocDocument not found in catalogService.", e);
		}
	}

	public void setHostEditor(HostEditor hostEditor) {
		this.hostEditor = hostEditor;
	}

	public void saveToPDF(File file) throws Exception {
		saveToFile(file, MimeConstants.MIME_PDF);
	}

	public void saveToPDF(OutputStream out) throws Exception {
		saveToStream(out, MimeConstants.MIME_PDF);
	}

	public void saveToTXT(File file) throws Exception {
		saveToFile(file, MimeConstants.MIME_PLAIN_TEXT);
	}

	public void saveToTXT(OutputStream out) throws Exception {
		saveToStream(out, MimeConstants.MIME_PLAIN_TEXT);
	}

	/**
	 * Returns the FOP template result
	 *
	 * @throws Exception
	 */
	public String getTemplateResult() throws Exception {
		if (processor == null) {
			processor = new TemplateProcessor(catalogService, madocAnswer, madocDocument, madocSkeleton, hostEditor);
		}
		return processor.getTemplateResult();
	}

	/**
	 * Returns the FOP template result as a DOM element
	 *
	 * @return
	 * @throws Exception
	 */
	public Element getTemplateResultAsDOMElement() throws Exception {
		return XMLUtil.convertXMLStringToDocument(getTemplateResult()).getDocumentElement();
	}

	/**
	 * @throws Exception Generate a file processed by Velocity and FOP
	 *
	 * @see http://xmlgraphics.apache.org/fop/1.0/embedding.html @param file @throws
	 */
	private void saveToFile(File file, String mimeConstantsMime) throws Exception {
		// process FOP
		try {
			saveToStream(new FileOutputStream(file), mimeConstantsMime);
		} catch (FileNotFoundException e) {
			log.error("FileNotFoundException saving rendition to file " + file.getPath() + ": " + e.getMessage(), e);
		}
	}

	private void saveToStream(OutputStream out, String mimeConstantsMime) throws Exception {

		if (madocSkeleton == null) {
			madocSkeleton = getMadocSkeletonFromRepository();
		}

		// doing replacements, expansions and process Velocity
		// templateResult is a FOP pure code
		String templateResult = getTemplateResult();
		templateResult = templateResult.replace("</fo:inline> </fo:inline>", "</fo:inline></fo:inline>");

		if (log.isDebugEnabled()) {
			log.debug("templateResult before FOPProcessor: " + templateResult);
		}

		// process FOP
		FOPProcessor fopp = new FOPProcessor();
		for (PDFAttachmentFile file : attachments) {
			fopp.addAttachment(file);
		}

		if (mimeConstantsMime == MimeConstants.MIME_PDF) {
			// Insere hash de verificação
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			fopp.processFOP(baos, mimeConstantsMime, templateResult, madocDocument, madocSkeleton, madocAnswer);

			byte[] bytearr = baos.toByteArray();
			int i = BytesUtil.lastIndexOf(bytearr,
					"<check:hash>00000000000000000000000000000000".getBytes(StandardCharsets.UTF_8));
			if(i >= 0) {
				String md5hex = DigestUtils.md5Hex(bytearr).toUpperCase();
				byte[] md5bytes = md5hex.getBytes(StandardCharsets.UTF_8);
				int openTagLen = "<check:hash>".getBytes(StandardCharsets.UTF_8).length;
				System.arraycopy(md5bytes, 0, bytearr, i + openTagLen, md5bytes.length);
			}
			out.write(bytearr);
			out.flush();
		} else {
			fopp.processFOP(out, mimeConstantsMime, templateResult, madocDocument, madocSkeleton, madocAnswer);
		}

	}

	public void addAttachment(PDFAttachmentFile file) {
		attachments.add(file);
	}

	private MadocSkeletonType getMadocSkeletonFromRepository() throws Exception {

		MadocSkeletonModelData modelData =
				catalogService.getMadocSkeletonModel(madocDocument.getTemplates().getMadocSkeletonId());

		if (modelData == null) {
			throw new MadocException("Madoc Skeleton does not exist or has not been found.");
		}

		return modelData.getMadocSkeleton();
	}

}