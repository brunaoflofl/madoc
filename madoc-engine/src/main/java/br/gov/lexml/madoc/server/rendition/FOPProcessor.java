package br.gov.lexml.madoc.server.rendition;

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.time.ZonedDateTime;

import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXResult;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.fop.apps.FOUserAgent;
import org.apache.fop.apps.Fop;
import org.apache.fop.apps.FopConfParser;
import org.apache.fop.apps.FopFactory;
import org.apache.fop.apps.FopFactoryBuilder;
import org.apache.fop.apps.MimeConstants;
import org.apache.fop.pdf.PDFAMode;
import org.apache.xmlgraphics.io.Resource;
import org.apache.xmlgraphics.io.ResourceResolver;
import org.dom4j.io.DocumentSource;

import br.gov.lexml.madoc.server.schema.entity.MadocAnswerType;
import br.gov.lexml.madoc.server.schema.entity.MadocDocumentType;
import br.gov.lexml.madoc.server.schema.entity.MadocSkeletonType;
import br.gov.lexml.madoc.server.schema.Constants;
import br.gov.lexml.madoc.server.util.FOHelper;
import br.gov.lexml.madoc.server.util.XMLUtil;
import br.gov.lexml.pdfa.PDFA;
import br.gov.lexml.pdfa.PDFAttachmentFile;

public class FOPProcessor {

	private static final Log log = LogFactory.getLog(FOPProcessor.class);
	
	private static FopFactory fopFactory;
	
	static {
		try {
			InputStream xconf = FOPProcessor.class.getResourceAsStream("/fop.xconf");
			ResourceResolver resolver = new ClasspathUriResolver();
			FopConfParser parser = new FopConfParser(xconf, new URI("file://."), resolver);
			FopFactoryBuilder builder = parser.getFopFactoryBuilder();
			fopFactory = builder.build();
		} catch (Exception e) {
			log.fatal("Não foi possível configurar o FOP.", e);
		}  
	}
	
	private List<PDFAttachmentFile> attachments = new ArrayList<PDFAttachmentFile>();
	
	static class ClasspathUriResolver implements ResourceResolver {
		
		@Override
		public OutputStream getOutputStream(URI arg0) throws IOException {
			return null;
		}

		@Override
		public Resource getResource(URI uri) throws IOException {
			
			String strUri = uri.toString().replaceAll("^file://\\.", "");

			InputStream inputStream = FOPProcessor.class
					.getResourceAsStream("/pdfa-fonts/" + strUri);
			if (inputStream != null) {
				return new Resource(MimeConstants.MIME_AFP_TRUETYPE, inputStream);
			}
			return null;
		}
		
	}

	public FOPProcessor() {
		
	}

	/**
	 * Process FOP
	 * 
	 * @see http://xmlgraphics.apache.org/fop/quickstartguide.html
	 * @see http
	 *      ://svn.apache.org/viewvc/xmlgraphics/fop/trunk/examples/embedding
	 *      /java/embedding/ExampleFO2PDF.java?view=markup
	 * @param file
	 * @param mimeConstantsMime
	 * @param templateResult
	 */
	@SuppressWarnings("unchecked")
	public void processFOP(OutputStream outputStream, String mimeConstantsMime, String templateResult, 
			MadocDocumentType madocDocument, MadocSkeletonType madocSkeleton, MadocAnswerType madocAnswer) {

		try {
			// Setup output stream. Note: Using BufferedOutputStream
			// for performance reasons (helpful with FileOutputStreams).
			OutputStream out = null;
			try {

				// configure foUserAgent as desired
				FOUserAgent foUserAgent = fopFactory.newFOUserAgent();

				// helper
				FOHelper helper = new FOHelper(templateResult);
				
				//fonte de dados
				Source src = new DocumentSource(helper.getFOPDocumentWithoutXmpmeta());

				if (!mimeConstantsMime.equals(MimeConstants.MIME_PDF) || (helper.getXmpmeta() == null)) { // if it isn't PDF
					out = new BufferedOutputStream(outputStream);
					
				} else { 
					out = new ByteArrayOutputStream();

					// PDF-A additional information
					if (helper.isPDFAMode()) {
						
						foUserAgent.getRendererOptions().put("pdf-a-mode", PDFAMode.PDFA_3B.getName());
						foUserAgent.setAccessibility(true);

						// set createDate
						String cmpCreateDate = helper.getCmpCreateDate();
						if (cmpCreateDate == null) {
							log.info("cmpCreateDate is null");
						} else {
							 Date date = Date.from(ZonedDateTime.parse(cmpCreateDate).toInstant());
							 foUserAgent.setCreationDate(date);
							 
						}
					}
				}
				

				// Construct fop with desired output format
				Fop fop = fopFactory.newFop(mimeConstantsMime, foUserAgent, out);

				// Resulting SAX events (the generated FO) must be piped
				// through to FOP
				Result res = new SAXResult(fop.getDefaultHandler());

				// Start XSLT transformation and FOP processing
				// Setup JAXP using identity transformer
				Transformer transformer = TransformerFactory.newInstance().newTransformer(); // identity transformer
				transformer.transform(src, res);
				//IOUtils.closeQuietly(out);

				// putting XMPmeta, if it is a PDF
				if (out instanceof ByteArrayOutputStream) {
					byte[] data = ((ByteArrayOutputStream) out).toByteArray();
					
					//PDF/A:
					PDFA pdfa = PDFA.getNewInstance(outputStream, new ByteArrayInputStream(data), helper.getPDFAPart(), helper.getPDFAConformance());
					if (pdfa == null){
						log.error("Could not find a PDF/A part "+helper.getPDFAPart()+", conformance "+helper.getPDFAConformance()+" constructor on PDFA class.");
					} else {
						pdfa.addXMP(helper.getXmpmeta().getBytes());
											
						//adding madoc-fo
						pdfa.addAttachments(
								new PDFAttachmentFile(
									templateResult.getBytes(), 
									"fo.xml",
									"text/xml", 
									helper.getCmpCreateDate(), 
									PDFAttachmentFile.AFRelationShip.SOURCE));
						
						//adding madoc-answer
						pdfa.addAttachments(
								new PDFAttachmentFile(
										XMLUtil.convertObjectToXMLString(MadocAnswerType.class, madocAnswer, 
												Constants.MADOC_ANSWER_ROOT_ELEMENT).getBytes("UTF-8"), 
										"madoc-answer.xml",
										"application/zip", 
										helper.getCmpCreateDate(), 
										PDFAttachmentFile.AFRelationShip.DATA));
						
						//adding zipped madoc-model and madoc-skeleton
						ByteArrayOutputStream baos = new ByteArrayOutputStream();
						ZipOutputStream zos = new ZipOutputStream(baos);
						// Model
						zos.putNextEntry(new ZipEntry("madoc-model.xml"));
						zos.write(XMLUtil.convertObjectToXMLString(MadocDocumentType.class, madocDocument, 
								Constants.MADOC_DOCUMENT_ROOT_ELEMENT).getBytes("UTF-8"));
						zos.closeEntry();
						// Skeleton
						zos.putNextEntry(new ZipEntry("madoc-skeleton.xml"));
						zos.write(XMLUtil.convertObjectToXMLString(MadocSkeletonType.class, madocSkeleton, 
								Constants.MADOC_SKELETON_ROOT_ELEMENT).getBytes("UTF-8"));
						zos.closeEntry();
						zos.flush();
						zos.close();
						pdfa.addAttachments(
								new PDFAttachmentFile(
										baos.toByteArray(), 
										"madoc-model.zip",
										"text/xml", 
										helper.getCmpCreateDate(), 
										PDFAttachmentFile.AFRelationShip.DATA));
						
						// Extra attachments
						for(PDFAttachmentFile attachment: attachments) {
							pdfa.addAttachment(attachment);
						}
						
						//adding RTF representation
						byte[] rtfOutput = generateRTF(templateResult);
						if (rtfOutput != null){
							pdfa.addAttachments(
								new PDFAttachmentFile(
									rtfOutput, 
									"documento.rtf",
									MimeConstants.MIME_RTF, 
									helper.getCmpCreateDate(), 
									PDFAttachmentFile.AFRelationShip.ALTERNATIVE));
						}
						
						//setting version
						pdfa.setVersion(PDFA.PDFVersion.PDF_VERSION_1_7);
						pdfa.close();
					}
				}
				
			} catch (Exception e) {
				throw new RuntimeException("Error processing FOP. " + e.getMessage(), e);
			} finally {
				if (out != null) {
					out.close();
				}
			}
		} catch (IOException e) {
			throw new RuntimeException("I/O error when processing FOP. " + e, e);
		}
	}
	
	private byte[] generateRTF(String templateResult) {
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		
		processFOP(out, MimeConstants.MIME_RTF, templateResult, null, null, null);
		
		return out.toByteArray();
	}
	
	public void addAttachment(PDFAttachmentFile file) {
		attachments.add(file);
	}
	
}
