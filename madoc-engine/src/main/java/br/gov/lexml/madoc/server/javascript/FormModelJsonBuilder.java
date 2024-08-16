package br.gov.lexml.madoc.server.javascript;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;

import br.gov.lexml.madoc.server.execution.hosteditor.HostEditor;
import br.gov.lexml.madoc.server.execution.hosteditor.HostEditorReplacer;
import br.gov.lexml.madoc.server.schema.entity.ActionListType;
import br.gov.lexml.madoc.server.schema.entity.ActionType;
import br.gov.lexml.madoc.server.schema.entity.BaseWizardType;
import br.gov.lexml.madoc.server.schema.entity.CustomQuestionType.CustomAttribute;
import br.gov.lexml.madoc.server.schema.entity.CustomQuestionType.CustomField;
import br.gov.lexml.madoc.server.schema.entity.EventType;
import br.gov.lexml.madoc.server.schema.entity.TransformationType;
import br.gov.lexml.madoc.server.schema.entity.WizardType;
import br.gov.lexml.madoc.server.util.JsonUtil.AnyTypeSerializer;
import br.gov.lexml.madoc.server.util.JsonUtil.AttributeWriter;
import br.gov.lexml.madoc.server.util.JsonUtil.TypeNameTransformer;

public class FormModelJsonBuilder {
	
	private static final Log log = LogFactory.getLog(FormModelJsonBuilder.class);
	
	private static final TypeNameTransformer[] typeTransformers = {
		new TypeNameTransformer("SelectOptionType", "Option"),
		new TypeNameTransformer("Type$", ""),
		new TypeNameTransformer("Event$", ""),
		new TypeNameTransformer("^ChoiceListOption", "Option"),
		new TypeNameTransformer("^SwitchCase", "Case")
	};
	
	private static final AttributeWriter[] attrWriters = {
		new AttributeWriter("customQuestionType"),
		new AttributeWriter("id"),
		new AttributeWriter("questionId"),
		new AttributeWriter("optionId"),
		new AttributeWriter("display"),
		new AttributeWriter("hint"),
		new AttributeWriter("enabled"),
		new AttributeWriter("visible"),
		new AttributeWriter("required"),
		new AttributeWriter("name"),
		new AttributeWriter("value"),
		new AttributeWriter("questionValue"),
		new AttributeWriter("attributeToTest"),
		new AttributeWriter("selected"),
		new AttributeWriter("defaultValue"),
		new AttributeWriter("regex"),
		new AttributeWriter("mask"),
		new AttributeWriter("validationType"),
		new AttributeWriter("defaultValueSatisfiesRequiredQuestion"),
		new AttributeWriter("maxLength"),
		new AttributeWriter("minLength"),
		new AttributeWriter("lines"),
		new AttributeWriter("inline"),
		new AttributeWriter("minValue"),
		new AttributeWriter("maxValue"),
		new AttributeWriter("minLines"),
		new AttributeWriter("maxLines"),
		new AttributeWriter("showInput"),
		new AttributeWriter("size"),
		new AttributeWriter("minSize"),
		new AttributeWriter("today"),
		new AttributeWriter("input"),
		new AttributeWriter("inputType"),
		new AttributeWriter("inputDefaultValue"),
		new AttributeWriter("multipleValues"),
		new AttributeWriter("uri"),
		new AttributeWriter("href"),
		new AttributeWriter("xpath"),
		new AttributeWriter("currency"),
		new AttributeWriter("sorted", "options.sorted"),
		new AttributeWriter("addSelectAll"),
		new AttributeWriter("onLoad", "onLoad.action"),
		new AttributeWriter("onChange", "onChange.action"),
		new AttributeWriter("onClick", "onClick.action"),
		new AttributeWriter("pages", "page"),
		new AttributeWriter("elements", "questionOrSectionOrCommand", "questionOrCommandOrHtmlContent"),
		new AttributeWriter("customAttributes", "customAttribute"),
		new AttributeWriter("customFields", "customField"),
		new AttributeWriter("options", "options.option"),
		new AttributeWriter("cases", "case"),
		new AttributeWriter("otherwise", "otherwise.action"),
		new AttributeWriter("transformations", "transformation"),
		new AttributeWriter("actions", "action"),
		new AttributeWriter("content", "any"),
		new AttributeWriter("validationURL"),
	};
	
	private WizardType wizardType;
	
	private HostEditor hostEditor;
	
	public FormModelJsonBuilder(WizardType wizard, HostEditor hostEditor) {
		this.wizardType = wizard;
		this.hostEditor = hostEditor;
	}

	public String build() throws Exception {
		ObjectMapper mapper = new ObjectMapper();

		mapper.enable(SerializationFeature.INDENT_OUTPUT);
		
		AnyTypeSerializer serializer = new AnyTypeSerializer(typeTransformers, attrWriters);
		
		SimpleModule module = new SimpleModule();
		module.addSerializer(WizardType.class, serializer);
		module.addSerializer(BaseWizardType.class, serializer);
		module.addSerializer(EventType.class, serializer);
		module.addSerializer(ActionType.class, serializer);
		module.addSerializer(ActionListType.class, serializer);
		module.addSerializer(TransformationType.class, serializer);
		module.addSerializer(CustomAttribute.class, serializer);
		module.addSerializer(CustomField.class, serializer);
		mapper.registerModule(module);
		
		String json = mapper.writeValueAsString(wizardType);
		
		json = new HostEditorReplacer(hostEditor).replaceString(json);
		
		return json;
	}
	
}
