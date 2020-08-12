export function isSubstituicao(valor) {
  return valor.indexOf('.startsWith') === -1 && valor.indexOf('=') === -1 && valor.indexOf('?') === -1;
}

export function getStatementSemChaves(texto) {
  return texto.replace('{', '').replace('}', '');
}

export function isStatement(texto) {
  return texto != null && typeof texto !== 'undefined' && isNaN(texto) && texto.startsWith('{') && texto.endsWith('}');
}
