package br.gov.lexml.madoc.editor.service;

import java.io.File;
import java.io.FileOutputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.entity.FileEntity;
import org.apache.http.impl.NoConnectionReuseStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class HostIntegrationService implements InitializingBean {

	private static final Log log = LogFactory.getLog(HostIntegrationService.class);

	private CloseableHttpClient httpClient;

	@Override
	public void afterPropertiesSet() throws Exception {
		httpClient = HttpClients.custom()
				.disableCookieManagement()
				.setConnectionReuseStrategy(NoConnectionReuseStrategy.INSTANCE)
				.build();
	}

	public File open(String url) throws Exception {

		File f = null;

		RequestBuilder rb = RequestBuilder.get().setHeader(HttpHeaders.ACCEPT, "application/pdf");
		
		url = removeJSessionId(url);

		HttpUriRequest req = rb
				.setUri(url)
                .build();

        try (CloseableHttpResponse response = httpClient.execute(req)) {
        	if(response.getStatusLine().getStatusCode() == HttpStatus.OK.value()) {
        		f = File.createTempFile("documento-madoc", ".pdf");
        		IOUtils.copy(response.getEntity().getContent(), new FileOutputStream(f));
        	}
        	else {
        		log.error(String.format("Falha ao abrir o arquivo da url '%s' (%s - %s)",
        				url, response.getStatusLine().getStatusCode(),
        				response.getStatusLine().getReasonPhrase()));
        		throw new Exception(response.getStatusLine().getReasonPhrase());
        	}
        }

		return f;
	}

	public void save(File file, String url) throws Exception {

		RequestBuilder rb = RequestBuilder.post()
                .setHeader(HttpHeaders.CONTENT_TYPE, "application/pdf")
				.setEntity(new FileEntity(file));

		url = removeJSessionId(url);

		HttpUriRequest req = rb
				.setUri(url)
		        .build();

        try (CloseableHttpResponse response = httpClient.execute(req)) {
        	if(response.getStatusLine().getStatusCode() != HttpStatus.OK.value()) {
        		log.error(String.format("Falha ao salvar o arquivo na url '%s' (%s - %s)",
        				url, response.getStatusLine().getStatusCode(),
        				response.getStatusLine().getReasonPhrase()));
        		throw new Exception(response.getStatusLine().getReasonPhrase());
        	}
        }

	}

	private static String getJSessionId(String url, HttpServletRequest request) {
		
		if(url.contains("/lexeditweb/resources/integrationtest")) {
			return request.getSession().getId();
		}
		
		Pattern p = Pattern.compile(";jsessionid=([^\\?]+)", Pattern.CASE_INSENSITIVE);
		Matcher m = p.matcher(url);
		if(m.find()) {
			return m.group(1);
		}
		return null;
	}

	private static String removeJSessionId(String url) {
		return url.replaceAll(";jsessionid=([^\\?]+)", "");
	}
	
}
