package br.gov.lexml.madoc.server.catalog.store;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.IOUtils;
import org.python.google.common.base.Stopwatch;
import org.python.google.common.cache.CacheBuilder;
import org.python.google.common.cache.CacheLoader;
import org.python.google.common.cache.LoadingCache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class MemoryCacheDocumentStore implements DocumentStore {

	private static final long serialVersionUID = 4675116695020586918L;

	private static final Logger log = LoggerFactory.getLogger(MemoryCacheDocumentStore.class);

	private transient LoadingCache<String, byte[]> cache;

	private DocumentStore store;

	private long durationInMinutes;
	
	public MemoryCacheDocumentStore(DocumentStore store, long durationInMinutes) {
		super();
		this.store = store;
		this.durationInMinutes = durationInMinutes;
		createCache();
	}
	
	private void readObject(ObjectInputStream ois) throws ClassNotFoundException, IOException {
		ois.defaultReadObject();
		createCache();
	}
	
	private void createCache() {
		this.cache = CacheBuilder.newBuilder().maximumSize(1000)
				.expireAfterWrite(durationInMinutes, TimeUnit.MINUTES)
				.build(createCacheLoader(store));
	}

	private static CacheLoader<String, byte[]> createCacheLoader(final DocumentStore store) {
		return new CacheLoader<String, byte[]>() {

			@Override
			public byte[] load(String docUri) throws Exception {
				
				// System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@ buscando " + docUri);
				
				Stopwatch sw = Stopwatch.createStarted();
				
				InputStream is = store.getDocument(docUri);
				if(is != null) {
					byte[] ret = IOUtils.toByteArray(is);
				//	System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@ em " + sw.elapsed(TimeUnit.SECONDS));
					return ret;
				}
				// System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@ não encontrado");
				return null;
			}
			
		};
	}

	@Override
	public InputStream getDocument(String docUri) throws Exception {
		byte[] bytes = cache.get(docUri);
		if(bytes != null) {
			return new ByteArrayInputStream(bytes);
		}
		return null;
	}


}
