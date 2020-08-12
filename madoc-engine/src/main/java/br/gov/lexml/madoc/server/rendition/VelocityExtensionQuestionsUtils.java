package br.gov.lexml.madoc.server.rendition;

import java.util.Collections;
import java.util.List;

import br.gov.lexml.madoc.server.schema.entity.QuestionAnswerType;

final class VelocityExtensionQuestionsUtils {

	private VelocityExtensionQuestionsUtils(){}
	
	/**
	 * Returns the value from an id
	 * @param contextCollection
	 * @param id
	 * @return
	 */
	static String getValueOfId(ContextCollection contextCollection, String id) {

		List<String> values = getValueListOf(contextCollection, id);
		
		return values.isEmpty()? null: values.get(0);
	
	}
	
	@SuppressWarnings("unchecked")
	static List<String> getValueListOf(ContextCollection contextCollection, String id) {
		
		QuestionAnswerType question = contextCollection.getAnswersMap().get(id);
		if(question != null) {
			List<String> values = question.getValue();
			if(values != null) {
				return values;
			}
		} 
		
		return Collections.EMPTY_LIST;
	}
	
}
