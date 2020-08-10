package br.gov.lexml.madoc.server.rendition;

import java.util.HashMap;
import java.util.Map;

import br.gov.lexml.madoc.server.schema.entity.BaseOptionType;
import br.gov.lexml.madoc.server.schema.entity.BaseWizardRestrictType;
import br.gov.lexml.madoc.server.schema.entity.ChoiceListOptionType;
import br.gov.lexml.madoc.server.schema.entity.MadocAnswerType;
import br.gov.lexml.madoc.server.schema.entity.MadocDocumentType;
import br.gov.lexml.madoc.server.schema.entity.PageType;
import br.gov.lexml.madoc.server.schema.entity.QuestionAnswerType;
import br.gov.lexml.madoc.server.schema.entity.QuestionType;
import br.gov.lexml.madoc.server.schema.entity.SectionType;
import br.gov.lexml.madoc.server.schema.entity.SelectOptionType;
import br.gov.lexml.madoc.server.schema.entity.visitor.BaseVisitor;
import br.gov.lexml.madoc.server.schema.entity.visitor.VisitorAction;
import br.gov.lexml.madoc.server.data.CollectionValue;
import br.gov.lexml.madoc.server.data.DataSetUtil;
import br.gov.lexml.madoc.server.data.DataSets;

/**
 * A collection objects used on Velocity Context  
 * @author lauro
 *
 */
class ContextCollection {

	private final MadocAnswerType madocAnswer;
	private final MadocDocumentType madocDocument;
	
	private Map<String, QuestionAnswerType> answers;
	private Map<String, QuestionType> questions;
	private Map<String, BaseOptionType> questionsOptions;
	private DataSets dataSets;
	private CollectionValue collectionValue;
	private Map<String, String> templateReplacements;
	
	ContextCollection(MadocAnswerType madocAnswer, MadocDocumentType madocDocument, Map<String, String> templateReplacements) {
		this.madocAnswer = madocAnswer;
		this.madocDocument = madocDocument;
		this.templateReplacements = templateReplacements;
	}
	
	/**
	 * Returns a structure of DataSets
	 * @return
	 */
	DataSets getDataSets(){
		if (this.dataSets== null){
			this.dataSets = madocDocument.getDataSets() == null ? DataSets.EMPTY : DataSets.fromDataSets(madocDocument.getDataSets());
		}
		return this.dataSets; 
	}
	
	/**
	 * Returns a CollectionValue structure queryable as a DataSet
	 * @return
	 */
	CollectionValue getMetadataCollectionVale(){
		
		if (this.collectionValue == null){
			this.collectionValue = DataSetUtil.valueFromDataSetValue(madocDocument.getMetadata());
		}
		return this.collectionValue;
	}
	
	/**
	 * Returns a map of id and QuestionAnswerType 
	 * @return
	 */
	Map<String, QuestionAnswerType> getAnswersMap(){
		if (answers== null){
			Map<String, QuestionAnswerType> answers = new HashMap<String, QuestionAnswerType>();
			for (QuestionAnswerType question : madocAnswer.getQuestionsAnswers().getQuestionAnswer()) {
				answers.put(question.getId(), question);
			}
			this.answers = answers;
		}
		return this.answers;
	}
	
	/**
	 * Returns a map of id and QuestionType
	 * @return
	 */
	Map<String, QuestionType> getQuestionsMap() {
		
		if (this.questions == null) {
			
			final Map<String, QuestionType> q = new HashMap<String, QuestionType>();
			
			for (PageType p : madocDocument.getWizard().getPage()) {
				for (BaseWizardRestrictType qsc : p.getQuestionOrSectionOrCommand() ){
					if (qsc instanceof QuestionType){
						q.put(qsc.getId(), (QuestionType) qsc);
					} else if (qsc instanceof SectionType){
						for (BaseWizardRestrictType qc : ((SectionType) qsc).getQuestionOrCommandOrHtmlContent() ){
							if (qc instanceof QuestionType){
								q.put(qc.getId(), (QuestionType)qc);
							}
						}
					}
				}
			}
			
			madocDocument.getWizard().accept(new BaseVisitor(){
				@Override
				public VisitorAction enter(QuestionType aBean) {
					q.put(aBean.getId(), aBean);
					return VisitorAction.CONTINUE;
				}
			});
			
			this.questions = q;
		} 
		
		return this.questions;
	}
	
	/**
	 * Returns a map of id and BaseOptionType
	 * @return
	 */
	Map<String, BaseOptionType> getQuestionsOptionsMap(){
		if (questionsOptions== null){
			
			final Map<String, BaseOptionType> qOptions = new HashMap<String, BaseOptionType>();
			
			madocDocument.getWizard().accept(new BaseVisitor(){
				
				void add(BaseOptionType aBean){
					qOptions.put(aBean.getId(), aBean);
				}
				
				@Override
				public VisitorAction enter(SelectOptionType aBean) {
					add(aBean);
					return VisitorAction.CONTINUE;
				}
				
				@Override
				public VisitorAction enter(ChoiceListOptionType aBean) {
					add(aBean);
					return VisitorAction.CONTINUE;
				}
				
			});
			
			questionsOptions = qOptions;
			
		}
		return this.questionsOptions;
	}
	
	public Map<String, String> getTemplateReplacements() {
		return templateReplacements;
	}
	
	String queryAnswerMetadata(String query) {
		CollectionValue collectionValue = DataSetUtil.valueFromDataSetValue(madocAnswer.getMetadata());
		return collectionValue.queryString(query);
	}
	
}


