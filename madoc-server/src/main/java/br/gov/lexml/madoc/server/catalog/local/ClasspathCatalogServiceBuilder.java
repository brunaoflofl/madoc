package br.gov.lexml.madoc.server.catalog.local;

import java.io.File;

import br.gov.lexml.madoc.server.catalog.CatalogException;
import br.gov.lexml.madoc.server.catalog.CatalogService;
import br.gov.lexml.madoc.server.catalog.CatalogServiceFactory;
import br.gov.lexml.madoc.server.catalog.DefaultCatalogService;
import br.gov.lexml.madoc.server.catalog.UriBuilder;
import br.gov.lexml.madoc.server.catalog.store.ClasspathCatalogStore;
import br.gov.lexml.madoc.server.catalog.store.DocumentStore;
import br.gov.lexml.madoc.server.catalog.store.FirstSuccessful;
import br.gov.lexml.madoc.server.catalog.store.FirstSucessfulRewriter;
import br.gov.lexml.madoc.server.catalog.store.RegexRewriter;
import br.gov.lexml.madoc.server.catalog.store.Rewriter;
import br.gov.lexml.madoc.server.catalog.store.RewriterFilter;
import br.gov.lexml.madoc.server.catalog.store.URIResolverAdapter;

public class ClasspathCatalogServiceBuilder implements CatalogServiceFactory {

	public static final String DEFAULT_SYSTEM = "sdleg";

	public static final String DEFAULT_CATALOG_URI = "urn:sf:sistema;" + DEFAULT_SYSTEM + ":id;catalog";

	private final UriBuilder uriBuilder;
	private final String packageName;
	private final String catalogUri;
	private final String system;

	public ClasspathCatalogServiceBuilder(String packageName, String catalogUri, final String system) {
		super();

		if(!packageName.endsWith("/")) {
			packageName += "/";
		}
		this.packageName = packageName;
		this.catalogUri = catalogUri;
		this.system = system;

		this.uriBuilder = new UriBuilder() {

			@Override
			public String buildUri(String modelId, String baseId) {

				baseId = TempIDConverter.convert(baseId);

				if(baseId == null) {
					return null;
				}
				return "urn:sf:sistema;" + system + ":id;" + baseId;
			}

		};
	}

	public ClasspathCatalogServiceBuilder(File directory) {
		this("/", DEFAULT_CATALOG_URI, DEFAULT_SYSTEM);
	}

	@Override
	public CatalogService createCatalogService() throws CatalogException {

		//setando o diretório
		Rewriter versionedUrnToUrl = new RegexRewriter(
				"^urn:sf:sistema;" + system + ":id;([^:]*):versao;([^:]*)$",
				packageName + "$1_$2.xml");

		//setando o diretório
		Rewriter unversionedUrnToUrl = TempIDConverter.rewriter(new RegexRewriter(
				"^urn:sf:sistema;" + system + ":id;([^:]*)$",
				packageName + "$1.xml"));

		DocumentStore cpStore = new ClasspathCatalogStore(catalogUri, packageName);

		DocumentStore store =
				new FirstSuccessful(
						cpStore,
						new RewriterFilter(cpStore,
								new FirstSucessfulRewriter(unversionedUrnToUrl, versionedUrnToUrl)));

		CatalogService cs = new DefaultCatalogService(catalogUri, store, uriBuilder);

		cs.setURIResolver(new URIResolverAdapter(store));

		return cs;
	}

}
