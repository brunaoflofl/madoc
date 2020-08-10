package br.gov.lexml.madoc.server.wrappers;

import br.gov.lexml.madoc.server.schema.entity.BaseWizardRestrictType;
import br.gov.lexml.madoc.server.schema.entity.PageType;
import br.gov.lexml.madoc.server.schema.entity.QuestionType;
import br.gov.lexml.madoc.server.schema.entity.SectionType;
import br.gov.lexml.madoc.server.schema.entity.WizardType;

/**
 * Helper class with useful methods on MadocWizardType.
 * 
 * @author lauro
 *
 */
public class WizardWrapper {

	private final WizardType wizard;
	
	public WizardWrapper(WizardType wizard) {
		this.wizard = wizard;
	}
	
	public QuestionType getQuestionById(String id) {
		
		QuestionType q;
		
		for(PageType p: wizard.getPage()) {
			for(BaseWizardRestrictType e: p.getQuestionOrSectionOrCommand()) {
				if(e instanceof QuestionType) {
					q = (QuestionType)e;
					if(q.getId().equals(id)) {
						return q;
					}
				}
				else if(e instanceof SectionType) {
					for(BaseWizardRestrictType e2: ((SectionType)e).getQuestionOrCommandOrHtmlContent()) {
						if(e2 instanceof QuestionType) {
							q = (QuestionType)e2;
							if(q.getId().equals(id)) {
								return q;
							}
						}
					}
				}
			}
		}
		
		return null;
		
	}
	
}
