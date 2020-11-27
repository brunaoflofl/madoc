/*
 * API do Madoc
 *
 * utilize:
 *
 *  madoc.novo(params);
 *
 * ou
 *
 * 	madoc.abrir(params);
 *
 * onde 'params' é um objeto como os seguintes atributos:
 *
 * tipoDocumento	Tipo do documento a ser aberto ou editado.
 * 					Pode ser 'Requerimento' ou 'Recurso'
 *
 * nomeDocumento	Nome do documento. Caso não seja informado será utilizado
 * 					o mesmo valor do tipo do documento.
 *
 * urlAbrir			URL callback para obter o arquivo PDF a ser aberto.
 * 					A chamada da URL deve retornar o binário de um arquivo PDF
 * 					gerado pelo Madoc.
 *
 * 					Ex: 'https://xpto.senado.gov.br/xpto/madoc/abrir/12345'
 *
 * urlSalvar		URL callback para salvar o documento. Essa URL receberá um
 * 					POST com o arquivo PDF a ser salvo.
 *
 * 					Ex: 'https://xpto.senado.gov.br/xpto/madoc/salvar/12345'
 *
 * 					A URL deve retornar um objeto como o abaixo:
 *
 * 					{ sucesso: true/false, mensagem: 'Mensagem de erro ou sucesso' }
 *
 * target		Janela onde deverá ser adicionado o iframe do editor.
 * 					Por padrão é utilizada a janela atual.
 *
 * 					Ex: window.parent
 * 
 * urlCSS   URL de um CSS customizado. Opcional.
 *
 * callbackFechar	Função javascript a ser chamada após o fechamendo do editor.
 * 					Recebe um parâmetro booleano indicando se o documento foi salvo ou não.
 *
 */

var __Madoc = function () {
  var iframeId = '__madoc_iframe';

  var contextPath = '/madoc';

  var resizeTimer;

  var params = {};
  this.getAcao = function () {
    return params.acao;
  }
  this.getTipoDocumento = function () {
    return params.tipoDocumento;
  }
  this.getNomeDocumento = function () {
    return params.nomeDocumento;
  }
  this.getUrlAbrir = function () {
    return params.urlAbrir;
  }
  this.getUrlSalvar = function () {
    return params.urlSalvar;
  }
  this.getUrlCSS = function () {
    return params.urlCSS;
  }

  var info = {};

  this.notificaDocumentoSalvo = function () {
    info.salvou = true;
  }

  this.novo = function (p) {
    if (this.validaParams('novo', p)) {
      this.abrePopup(p);
    }
  }

  this.abrir = function (p) {
    if (this.validaParams('abrir', p)) {
      this.abrePopup(p);
    }
  }

  this.validaParams = function (acao, p) {
    if (!p) {
      alert('Informe os parâmetros da chamada.');
    } else if (!p.tipoDocumento) {
      alert('Informe o tipo do documento.');
    } else if (acao == 'abrir' && !p.urlAbrir) {
      alert('Informe a url callback para abrir o documento.');
    } else if (!p.urlSalvar) {
      alert('Informe a url callback para salvar o documento.');
    } else {
      p.acao = acao;
      return true;
    }
    return false;
  }

  this.fechar = function () {

    var iframe = params.targetDoc.getElementById(iframeId);

    if (iframe) {
      params.targetDoc.body.removeChild(iframe);
      if (params.callbackFechar)
        params.callbackFechar(info.salvou);
    }

  }

  this.abrePopup = function (p) {
    info.salvou = false;

    params = p;

    if (!p.target) p.target = window;
    p.targetDoc = p.target.document;
    p.target.__madoc_opener = window;

    if (!p.nomeDocumento) p.nomeDocumento = p.tipoDocumento;

    var iframe = p.targetDoc.getElementById(iframeId);

    if (!iframe) {
      iframe = p.targetDoc.createElement('IFRAME');
      iframe.id = iframeId;
      with (iframe.style) {
        //border = 'solid 1px gray';
        width = 'calc(100vw - 30px)';
        height = 'calc(100vh - 30px)';
        position = 'fixed';
        top = '15px';
        zIndex = '100000';
        right = top;
      }
      p.targetDoc.body.appendChild(iframe);
    }

    iframe.src = this.getScriptReference() + contextPath + '/index.html';

  }

  this.getScriptReference = function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src;
      if (src) {
        var j = src.indexOf(contextPath);
        if (j > -1) {
          return src.substring(0, j);
        }
      }
    }
    return '';
  }

}

var madoc = new __Madoc();

if (window.location.href.indexOf('app-senado.leg.br') >= 0)
  window.domain = 'app-senado.leg.br';
else
  window.domain = 'app-senado.gov.br';
