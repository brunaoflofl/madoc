package br.gov.lexml.madoc.server.catalog.local;

import java.io.File;
import java.io.Serializable;

import br.gov.lexml.madoc.server.catalog.CatalogException;
import br.gov.lexml.madoc.server.catalog.CatalogService;
import br.gov.lexml.madoc.server.catalog.CatalogServiceFactory;
import br.gov.lexml.madoc.server.catalog.DefaultCatalogService;
import br.gov.lexml.madoc.server.catalog.UriBuilder;
import br.gov.lexml.madoc.server.catalog.store.DirectoryCatalogStore;
import br.gov.lexml.madoc.server.catalog.store.DocumentStore;
import br.gov.lexml.madoc.server.catalog.store.FirstSuccessful;
import br.gov.lexml.madoc.server.catalog.store.FirstSucessfulRewriter;
import br.gov.lexml.madoc.server.catalog.store.RegexRewriter;
import br.gov.lexml.madoc.server.catalog.store.Rewriter;
import br.gov.lexml.madoc.server.catalog.store.RewriterFilter;
import br.gov.lexml.madoc.server.catalog.store.URIResolverAdapter;
import br.gov.lexml.madoc.server.catalog.store.URLDocumentStore;

public class LocalCatalogServiceBuilder implements CatalogServiceFactory, Serializable {

	public static final String DEFAULT_CATALOG_URI = "urn:sf:sistema;madoc:id;local-catalog";

	private final String versionedUrlPattern = "%s/$1_$2.xml";
	private final String unversionedUrlPattern = "%s/$1.xml";

	private final File directory;
	private final UriBuilder uriBuilder;
	private final String catalogUri;

	public LocalCatalogServiceBuilder(File directory, String catalogUri) {
		super();

		this.directory = directory;
		this.catalogUri = catalogUri;

		this.uriBuilder = new UriBuilder() {

			@Override
			public String buildUri(String modelId, String baseId) {

				baseId = TempIDConverter.convert(baseId);

				if(baseId == null) {
					return null;
				}

				return "urn:sf:sistema;madoc:id;" + baseId;
			}

		};
	}

	public LocalCatalogServiceBuilder(File directory) {
		this(directory, DEFAULT_CATALOG_URI);
	}

	@Override
	public CatalogService createCatalogService() throws CatalogException {

		//setando o diretório
		String versionedUrlPattern1 = String.format(versionedUrlPattern,
				directory.toURI().toString());

		Rewriter versionedUrnToUrl = new RegexRewriter(
				"^urn:sf:sistema;madoc:id;([^:]*):versao;([^:]*)$",
				versionedUrlPattern1);


		//setando o diretório
		String unversionedUrlPattern1 = String.format(unversionedUrlPattern,
				directory.toURI().toString());

		Rewriter unversionedUrnToUrl = TempIDConverter.rewriter(new RegexRewriter(
				"^urn:sf:sistema;madoc:id;([^:]*)$",
				unversionedUrlPattern1));

		DocumentStore store =
				new FirstSuccessful(
						new DirectoryCatalogStore(catalogUri, directory),
						new RewriterFilter(
								new URLDocumentStore(), new FirstSucessfulRewriter(unversionedUrnToUrl, versionedUrnToUrl)));

		CatalogService cs = new DefaultCatalogService(catalogUri, store, uriBuilder);

		cs.setURIResolver(new URIResolverAdapter(store));

		return cs;
	}

}
