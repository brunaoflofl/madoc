package br.gov.lexml.madoc.server.javascript;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import br.gov.lexml.madoc.server.MadocException;
import br.gov.lexml.madoc.server.catalog.CatalogService;
import br.gov.lexml.madoc.server.execution.AbstractWizardExecution;
import br.gov.lexml.madoc.server.schema.entity.MadocAnswerType;
import br.gov.lexml.madoc.server.schema.entity.MadocDocumentType;
import br.gov.lexml.madoc.server.schema.entity.MadocReferencesAnswersType;
import br.gov.lexml.madoc.server.schema.entity.MadocSkeletonType;
import br.gov.lexml.madoc.server.schema.entity.QuestionAnswerType;
import br.gov.lexml.madoc.server.schema.entity.QuestionType;
import br.gov.lexml.madoc.server.schema.entity.QuestionsAnswersType;
import br.gov.lexml.madoc.server.schema.entity.RichTextQuestionType;
import br.gov.lexml.madoc.server.util.MadocStringUtils;
import br.gov.lexml.madoc.server.wrappers.WizardWrapper;

public class WizardExecutionJavascript extends AbstractWizardExecution {

	private Map<String, List<String>> questionAnswerMap = new HashMap<String, List<String>>();

	public WizardExecutionJavascript(CatalogService catalogService, String madocId) throws MadocException {
		super(catalogService, madocId);
	}

	public WizardExecutionJavascript(CatalogService catalogService, File pdfFile)
			throws Exception {
		super(catalogService, pdfFile);
	}

	public WizardExecutionJavascript(CatalogService catalogService, MadocDocumentType madocDocument, MadocSkeletonType madocSkeleton, MadocAnswerType originalAnswer)
			throws MadocException {
		super(catalogService, madocDocument, madocSkeleton, originalAnswer);
	}

	public WizardExecutionJavascript(CatalogService catalogService, MadocReferencesAnswersType madocReferences)
			throws MadocException {
		super(catalogService, madocReferences);
	}
	
	public String getFormModelJson() throws Exception {
		return new FormModelJsonBuilder(getCurrentMadocDocument().getWizard(), hostEditor).build();
	}

	public void setQuestionValues(Map<String, List<Object>> objAnswers) {

		// Converte lista de objetos em lista de strings
		Map<String, List<String>> answers = objAnswers.entrySet().stream().collect(
			Collectors.toMap(Map.Entry::getKey, entry -> {
				List<Object> values = entry.getValue();
				if(values != null && !values.isEmpty()) {
					return values.stream().map(o -> {
						return o == null? "" : o.toString();
					}).collect(Collectors.toList());
				}
				return Collections.EMPTY_LIST;
			})
		);

		// Remove escape de valores html
		WizardWrapper w = new WizardWrapper(getCurrentMadocDocument().getWizard());
		for(String id: answers.keySet()) {
			QuestionType q = w.getQuestionById(id);
			if(q != null && q instanceof RichTextQuestionType) {
				List<String> values = answers.get(id);
				if(values != null && !values.isEmpty()) {
					values.set(0, MadocStringUtils.unescapeHtmlKeepingXMLEntities(values.get(0)));
				}
			}
		}

		this.questionAnswerMap = answers;
	}

	@Override
	@SuppressWarnings("unchecked")
	protected QuestionsAnswersType getQuestionsAnswersFromPagesComponent() {
		QuestionsAnswersType questionsAnswers = new QuestionsAnswersType();

		for(String questionId: questionAnswerMap.keySet()) {
			QuestionAnswerType qa = new QuestionAnswerType();

			qa.setId(questionId);

			List<String> values = questionAnswerMap.get(questionId);
			if(values == null) {
				values = Collections.EMPTY_LIST;
			}
			qa.getValue().clear();
			qa.getValue().addAll(values);

			questionsAnswers.getQuestionAnswer().add(qa);
		}

		questionsAnswers.setRequiredQuestionsAnswered(isRequiredQuestionsAnswered());

		return questionsAnswers;
	}

	public Map<String, List<String>> getOriginalAnswerMap() {
		Map<String, List<String>> map = new HashMap<>();

		if(originalAnswer != null) {
			QuestionsAnswersType qat = originalAnswer.getQuestionsAnswers();
			for(QuestionAnswerType qa: qat.getQuestionAnswer()) {
				List<String> values = new ArrayList<>(qa.getValue());
				map.put(qa.getId(), values);
			}
		}

		return map;
	}

}
