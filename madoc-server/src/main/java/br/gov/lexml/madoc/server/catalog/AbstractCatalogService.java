package br.gov.lexml.madoc.server.catalog;

import java.util.HashSet;
import java.util.Set;

public abstract class AbstractCatalogService implements CatalogService {

	private final Set<CatalogEventListener> eventListenersSet = new HashSet<CatalogEventListener>();

	protected static abstract class EventDispatcher {
		public abstract void dispatch(CatalogEventListener listener);
	}

	// Listeners

	@Override
	public synchronized void addCatalogEventListener(CatalogEventListener cel){
		eventListenersSet.add(cel);
	}

	@Override
	public synchronized void removeCatalogEventListener(CatalogEventListener cel){
		eventListenersSet.remove(cel);
	}

	protected void dispatchEvent(EventDispatcher dispatcher) {
		final Set<CatalogEventListener> listeners = new HashSet<CatalogEventListener>();
		synchronized(this) {
			listeners.addAll(this.eventListenersSet);
		}
		for(CatalogEventListener l : listeners) {
			dispatcher.dispatch(l);
		}
	}

}
