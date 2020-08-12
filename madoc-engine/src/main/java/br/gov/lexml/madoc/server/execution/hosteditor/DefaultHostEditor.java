package br.gov.lexml.madoc.server.execution.hosteditor;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;

import br.gov.lexml.madoc.server.schema.Constants;

public class DefaultHostEditor implements HostEditor, Serializable {

	private Map<String, String> properties = new HashMap<String, String>();
	
	public DefaultHostEditor() {
		properties.put("currentDate", 
				new SimpleDateFormat(Constants.DATE_FORMAT).format(new Date()));
		properties.put("currentYear", 
				Integer.toString(new GregorianCalendar().get(Calendar.YEAR)));
	}
	
	@Override
	public Map<String, String> getProperties() {
		return properties;
	}
	
	public void addProperties(Map<String, String> properties) {
		this.properties.putAll(properties);
	}
	
}
