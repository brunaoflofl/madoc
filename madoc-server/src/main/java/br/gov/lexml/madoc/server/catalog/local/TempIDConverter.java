package br.gov.lexml.madoc.server.catalog.local;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import br.gov.lexml.madoc.server.catalog.store.Rewriter;

public class TempIDConverter {
	
	public static String convert(String id) {
		
		if(id == null) return id;
		
		Matcher m = Pattern.compile("rw(\\d{3})").matcher(id);
		if(m.matches()) {
			id = id.replace(m.group(), "req-" + m.group(1) + "-sf");
			if(id.contains("008")) {
				id = id.replace("-sf", "-cn");
			}
		}
		else if(id.contains("rec001")) {
			id = id.replace("rec001", "rec-001-sf");
		}
		else if(id.contains("sw001")) {
			id = id.replace("sw001", "skeleton-001");
		}
		else {
			id = id.replace("-w", " ");
		}
		
		return id;
	}
	
	public static Rewriter rewriter(Rewriter rw) {
		
		return new Rewriter() {
			
			@Override
			public String rewriteUri(String docUri) {
				return TempIDConverter.convert(rw.rewriteUri(docUri));
			}
			
		};
		
	}
	
	

}
