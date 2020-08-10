package br.gov.lexml.madoc.server.execution;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.python.google.common.io.Files;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import br.gov.lexml.madoc.server.MadocException;
import br.gov.lexml.madoc.server.catalog.CatalogException;
import br.gov.lexml.madoc.server.catalog.CatalogService;
import br.gov.lexml.madoc.server.catalog.MadocDocumentModelData;
import br.gov.lexml.madoc.server.catalog.local.TempIDConverter;
import br.gov.lexml.madoc.server.execution.hosteditor.HostEditor;
import br.gov.lexml.madoc.server.schema.entity.DataSetMapType;
import br.gov.lexml.madoc.server.schema.entity.MadocAnswerType;
import br.gov.lexml.madoc.server.schema.entity.MadocDocumentType;
import br.gov.lexml.madoc.server.schema.entity.MadocReferencesAnswersType;
import br.gov.lexml.madoc.server.schema.entity.MadocSkeletonType;
import br.gov.lexml.madoc.server.schema.entity.ObjectFactory;
import br.gov.lexml.madoc.server.schema.entity.QuestionsAnswersType;
import br.gov.lexml.madoc.server.schema.parser.SchemaParser;
import br.gov.lexml.pdfa.PDFAttachmentHelper;

public abstract class AbstractWizardExecution implements WizardExecution {

	private static final Logger log = LoggerFactory.getLogger(AbstractWizardExecution.class);

	private final String uuid = UUID.randomUUID().toString();

	protected MadocAnswerType originalAnswer;

	private MadocDocumentType currentMadocDocument;
	private MadocDocumentType originalMadocDocument;

	private MadocSkeletonType madocSkeleton;

	protected HostEditor hostEditor;
	protected CatalogEventListenerExecution catalogEventListenerExecution;
	protected DataSetMapType answerMetadata;

	private QuestionsAnswersType questionsAnswersForChangedComparison;

	/**
	 * This constructor starts a new Madoc execution. No data are load.
	 * @param catalogService
	 * @param madocId
	 * @throws MadocException
	 */
	public AbstractWizardExecution(
			CatalogService catalogService,
			String madocId) throws MadocException {

		this.originalAnswer = null;

		// getting MadocDocument from CatalogService
		MadocDocumentModelData md = catalogService.getMadocDocumentModel(madocId);
		if(md == null) {
			throw new CatalogException("Document not found in catalog: id=" + madocId);
		}
		this.originalMadocDocument = md.getMadocDocument();

		// expanding options
		this.currentMadocDocument = cloneAndExpandMadocDocument(originalMadocDocument);

	}
	
	// TODO Verificar uso de MadocException
	public AbstractWizardExecution(
			CatalogService catalogService,
			File pdfFile) throws Exception {
		
		PdfAttachments attachments = getPdfAttachment(pdfFile, false);
		
		init(catalogService, getModel(attachments), getSkeleton(attachments), getAnswer(attachments));
		
	}

	/**
	 * This constructor starts a new Madoc execution based on an answer set.
	 * @param catalogService
	 * @param originalAnswer
	 * @throws MadocException
	 */
	public AbstractWizardExecution(
			CatalogService catalogService,
			MadocDocumentType madocDocument,
			MadocSkeletonType madocSkeleton,
			MadocAnswerType originalAnswer) throws MadocException {
		init(catalogService, madocDocument, madocSkeleton, originalAnswer);
	}
	
	private void init(
			CatalogService catalogService,
			MadocDocumentType madocDocument,
			MadocSkeletonType madocSkeleton,
			MadocAnswerType originalAnswer) throws MadocException {

		this.originalAnswer = originalAnswer;

		this.madocSkeleton = madocSkeleton;

		if(madocDocument != null) {
			this.originalMadocDocument = madocDocument;
		}
		else {
			log.warn("Documento sem modelo embutido. Buscando modelos do repositório.");
			// getting original MadocDocument
			this.originalMadocDocument =
					catalogService.getMadocDocumentModel(
							TempIDConverter.convert(originalAnswer.getMadocReferences().getMadocDocument().getId()))
					.getMadocDocument();
		}

		// expanding options
		this.currentMadocDocument = cloneAndExpandMadocDocument(originalMadocDocument);

		// setting answer metadata
		setAnswerMedatada(originalAnswer.getMetadata());
	}
	
	public MadocDocumentType getModel(PdfAttachments attachment) throws CatalogException {
		MadocDocumentType model = null;
		if(attachment.model != null) {
			try {
				model = SchemaParser.loadMadocDocument(new ByteArrayInputStream(attachment.model), null);
			} catch (Exception e) {
				throw new CatalogException("Erro ao abrir modelo do documento.", e);
			}
		}
		return model;
	}

	private MadocSkeletonType getSkeleton(PdfAttachments attachment) throws CatalogException {
		MadocSkeletonType skeleton = null;
		if(attachment.skeleton != null) {
			try {
				skeleton = SchemaParser.loadMadocSkeleton(new ByteArrayInputStream(attachment.skeleton), null);
			} catch (Exception e) {
				throw new CatalogException("Erro ao abrir o esqueleto do documento.", e);
			}
		}
		return skeleton;
	}
	
	public MadocAnswerType getAnswer(PdfAttachments attachment) throws CatalogException {
		MadocAnswerType answer = null;

		try {
			answer = SchemaParser.loadAnswer(new ByteArrayInputStream(attachment.answer));
		} catch (Exception e) {
			throw new CatalogException("Erro ao abrir documento de respostas. Provavelmente o arquivo aberto não é " +
					"compatível com os modelos disponíveis neste computador.", e);
		}

		return answer;
	}
	
	@Override
	public String getUUID() {
		return uuid;
	}
	
    public static class PdfAttachments {
    	public byte[] answer;
    	public byte[] model;
    	public byte[] skeleton;
    }
	
    
    // TODO - Criar classe utilitária
    public PdfAttachments getPdfAttachment(File pdf, boolean answerOnly) throws Exception {

    	PdfAttachments ret = new PdfAttachments();

		File dir = Files.createTempDir();

		try {
	    	File file = null;

			PDFAttachmentHelper.extractAttachments(pdf.getPath(), dir.getPath());

			file = new File(dir, "madoc-answer.xml");

			if(file.isFile()) {
				ret.answer = IOUtils.toByteArray(new FileInputStream(file));
			}

			if(!answerOnly) {
				file = new File(dir, "madoc-model.zip");
				if(file.isFile()) {
					ZipInputStream zis = new ZipInputStream(new FileInputStream(file));
					ZipEntry entry;
					while((entry = zis.getNextEntry()) != null) {
						if(entry.getName().equals("madoc-model.xml")) {
							ret.model = IOUtils.toByteArray(zis);
						}
						else if(entry.getName().equals("madoc-skeleton.xml")) {
							ret.skeleton = IOUtils.toByteArray(zis);
						}
					}
					zis.close();
				}
			}

		}
		catch (FileNotFoundException e) {
			log.warn("Arquivo " + pdf.getPath() + " não encontrado.");
		}
		catch (Exception e) {
			log.warn("Falha ao extrair documento do pdf.", e);
		}
		finally {
			if(dir != null) {
				FileUtils.forceDeleteOnExit(dir);
			}
		}

		return ret;
    }

	/**
	 * This constructor starts a new Madoc execution based on MadocReferences.
	 * @param catalogService
	 * @param madocReferences
	 * @throws MadocException
	 */
	public AbstractWizardExecution(
			CatalogService catalogService,
			MadocReferencesAnswersType madocReferences) throws MadocException {

		this.originalAnswer = null;

		// getting original MadocDocument
		this.originalMadocDocument =
				catalogService.getMadocDocumentModel(
						madocReferences.getMadocDocument().getId())
						.getMadocDocument();

		// expanding options
		this.currentMadocDocument = cloneAndExpandMadocDocument(originalMadocDocument);

//		controller.setCatalogService(catalogService);
	}

	/**
	 * Clone MadocDocumentType and expand options
	 * @param mdt
	 * @return
	 */
	private MadocDocumentType cloneAndExpandMadocDocument(MadocDocumentType mdt){
		return new OptionsExpansion().cloneAndExpandOptions(mdt);
	}

	/**
	 * Returns a QuestionsAnswersType from the PagesComponent (P)
	 * @param pages
	 * @return
	 */
	protected abstract QuestionsAnswersType getQuestionsAnswersFromPagesComponent();

	@Override
	public void setHostEditor(HostEditor hostEditor) {
		this.hostEditor = hostEditor;
	}

	@Override
	public HostEditor getHostEditor() {
		return hostEditor;
	}

	@Override
	public boolean isChanged() {
		return (questionsAnswersForChangedComparison== null) ? true : !questionsAnswersForChangedComparison.equals(getQuestionsAnswersFromPagesComponent());
	}

	@Override
	public void informMadocAnswer(MadocAnswerType madocAnswer) {
//		pagesComponent.informMadocAnswer(madocAnswer);

		if (madocAnswer!= null){
			questionsAnswersForChangedComparison = getQuestionsAnswersFromPagesComponent();
		}
	}

	@Override
	public MadocAnswerType createMadocAnswer() {

		ObjectFactory objFactory = new ObjectFactory();

		MadocAnswerType answer = objFactory.createMadocAnswerType();

		// setting QuestionsAnswers
		answer.setQuestionsAnswers(getQuestionsAnswersFromPagesComponent());

		// setting answer's metadata
		if (getAnswerMetadata()!= null){
			answer.setMetadata(getAnswerMetadata());
		}

//		if (catalogService!= null){
//
//			// preparing references
//
//			//   preparing MadocDocumentInfo
//			MadocInfoAnswersType madocDocInfo = objFactory.createMadocInfoAnswersType();
//			madocDocInfo.setId(currentMadocDocument.getMetadata().getId());
//
//			//   preparing MadocSkeletonInfo
//			MadocInfoAnswersType madocSkeletonInfo = objFactory.createMadocInfoAnswersType();
//			madocSkeletonInfo.setId(currentMadocDocument.getTemplates().getMadocSkeletonId());
//
//			//   preparing EmptyVersionItemsIncludedFromCatalog
//			EmptyVersionItemsIncludedFromCatalog eviifc = objFactory.createMadocReferencesAnswersTypeEmptyVersionItemsIncludedFromCatalog();
//			eviifc.getCatalogItem().addAll(catalogEventListenerExecution.getItemsVersionResolved());
//
//			//   setting References
//			MadocReferencesAnswersType references = objFactory.createMadocReferencesAnswersType();
//			references.setMadocDocument(madocDocInfo);
//			references.setMadocSkeleton(madocSkeletonInfo);
//			references.setEmptyVersionItemsIncludedFromCatalog(eviifc);
//			answer.setMadocReferences(references);
//		}

		return answer;
	}

	@Override
	public MadocDocumentType getCurrentMadocDocument() {
		return currentMadocDocument;
	}

	@Override
	public MadocDocumentType getOriginalMadocDocument(){
		return originalMadocDocument;
	}

	@Override
	public boolean isRequiredQuestionsAnswered() {
		return true;
	}

	@Override
	public void setAnswerMedatada(DataSetMapType metadata) {
		this.answerMetadata = metadata;
	}

	@Override
	public DataSetMapType getAnswerMetadata() {
		return answerMetadata;
	}

	@Override
	public MadocSkeletonType getMadocSkeleton() {
		return madocSkeleton;
	}

	@Override
	protected void finalize() throws Throwable {
		super.finalize();
		catalogEventListenerExecution = null;
	}

}
