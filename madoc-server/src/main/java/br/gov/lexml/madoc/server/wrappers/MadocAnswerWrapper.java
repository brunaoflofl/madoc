package br.gov.lexml.madoc.server.wrappers;

import java.util.Collections;
import java.util.List;

import br.gov.lexml.madoc.server.schema.entity.MadocAnswerType;
import br.gov.lexml.madoc.server.schema.entity.QuestionAnswerType;

/**
 * Helper class with useful methods on MadocAnswerType.
 * 
 * @author lauro
 *
 */
public class MadocAnswerWrapper {

	private final MadocAnswerType answer;
	
	public MadocAnswerWrapper(MadocAnswerType answer) {
		this.answer = answer;
	}
	
	public QuestionAnswerType getQuestionAnswerById(String id) {
		for (QuestionAnswerType qa : answer.getQuestionsAnswers().getQuestionAnswer()) {
			if (qa.getId().equals(id)) {
				return qa;
			}
		}
		return null;
	}
	
	@SuppressWarnings("unchecked")
	public List<String> getValuesById(String id) {
		QuestionAnswerType qa = getQuestionAnswerById(id);
		return qa == null? Collections.EMPTY_LIST: qa.getValue();
	}
	
}
