package br.gov.lexml.madoc.server.execution;

import java.io.Serializable;

import br.gov.lexml.madoc.server.execution.hosteditor.HostEditor;
import br.gov.lexml.madoc.server.schema.entity.DataSetMapType;
import br.gov.lexml.madoc.server.schema.entity.MadocAnswerType;
import br.gov.lexml.madoc.server.schema.entity.MadocDocumentType;
import br.gov.lexml.madoc.server.schema.entity.MadocSkeletonType;

/**
 * Interface of wizard' execution. A wizard execution is a user interface.
 * @author lauro
 * @author fragomeni
 *
 */
public interface WizardExecution extends Serializable {

	String getUUID();

	/**
	 * Returns MadocDocument used by components. This MadocDocument has already been expanded.
	 * @return
	 */
	MadocDocumentType getCurrentMadocDocument();

	/**
	 * Returns the original MadocDocument as read from XML
	 * @return
	 */
	MadocDocumentType getOriginalMadocDocument();

	/**
	 * Create a DocumentAnswerType representing user's interview answers.
	 */
	MadocAnswerType createMadocAnswer();

	/**
	 * Set a metadata to be used by getMadocAnswer()
	 * @param metadata
	 */
	void setAnswerMedatada(DataSetMapType metadata);

	/**
	 * Returns the answer's metadata loaded on constructor that will be used by createMadocAnswer()
	 * @return
	 */
	DataSetMapType getAnswerMetadata();

	/**
	 * Returns true if the document has been changed
	 * @return
	 */
	boolean isChanged();

	/**
	 * Returns true if all required fields are filled. It highlights required fields.
	 * It's a shortcut to isRequiredQuestionsAnswered(true).
	 * @return
	 */
	boolean isRequiredQuestionsAnswered();

	/**
	 * Set a MadocAnswerType represents data saved.
	 * @param madocAnswer
	 */
	void informMadocAnswer(MadocAnswerType madocAnswer);

	/**
	 * Set HostEditor
	 * @param hostEditor
	 */
	void setHostEditor(HostEditor hostEditor);

	/**
	 * @return HostEditor
	 */
	HostEditor getHostEditor();

	MadocSkeletonType getMadocSkeleton();

}
