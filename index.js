(function(window) {
  window.http = {
    SimpleHTTPClient,
  };

  function SimpleHTTPClient() {
    return {
      get: _get,
      post: _post,
      put: _put,
      head: _head,
      delete: _delete,
      patch: _patch,
      options: _options,
    }

    function _get(url, configs) {
      return asyncRequest(HttpMethod.GET, url, configs);
    }

    function _post(url, configs) {
      throw new Error('Unimplemented POST method');
    }

    function _put(url, configs) {
      throw new Error('Unimplemented PUT method');
    }

    function _head(url, configs) {
      throw new Error('Unimplemented HEAD method');
    }

    function _delete(url, configs) {
      throw new Error('Unimplemented DELETE method');
    }

    function _patch(url, configs) {
      throw new Error('Unimplemented PATCH method');
    }

    function _options(url, configs) {
      throw new Error('Unimplemented OPTIONS method');
    }
  }

  function asyncRequest(method, url, configs) {
    var xhr = prepareXmlHttpRequest(method, url, configs);
    return new AsyncResult(xhr);
  }

  function prepareXmlHttpRequest(method, url, configs) {
    var xhr = new XMLHttpRequest();
    var urlWithQueryParams = withQueryParams(url, configs && configs.params);

    xhr.open(method, urlWithQueryParams, true);
    
    setConfigs(xhr, configs);

    return xhr;
  }

  function setConfigs(xhr, configs) {
    if (isUndefined(configs)) return;

    if (!isObject(configs)) {
      throw new TypeError('Configs must be an instance of object');
    }

    setHeaders(xhr, configs.headers);
  }

  function setHeaders(xhr, headers) {
    if (isUndefined(headers)) return;

    if (!isObject(headers)) {
      throw new TypeError('Headers must be an instance of object');
    }

    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
  }

  function withQueryParams(url, params) {
    if (isUndefined(params)) return url;

    if (!isObject(params)) {
      throw new TypeError('Params must be an instance of object');
    }

    var queryTokens = [];
    for (const key in params) {
      if (isVisibleContent(params[key])) {
        queryTokens.push(key + '=' + params[key]);
      }
    }
    
    var queryString = queryTokens.join('&');
    return (indexOf(url, '?') !== -1) ? (url + '&' + queryString) : (url + '?' + queryString);
  }

  function AsyncResult(xhr) {
    var _after;
    var _but;
    var _whatever;
    var _self = this;

    return {
      after: after,
      but: but,
      whatever: whatever,
      send: send,
    }

    function after(after) {
      _self._after = after;

      return this;
    }

    function but(but) {
      _self._but = but;

      return this;
    }

    function whatever(whatever) {
      _self._whatever = whatever;

      return this;
    }

    function send() {
      try {
        xhr.send();
        handleAfter();
      } catch (e) {
        handleBut();
        console.error(e);
      } finally {
        handleWhatever();
      }
    }

    function handleAfter() {
      xhr.onreadystatechange = function() {
        if (!isFunction(_self._after)) return;

        if (
          this.readyState === XMLHttpRequest.DONE &&
          (this.status >= HttpStatus.OK && this.status < HttpStatus.BAD_REQUEST)
        ) {
          _self._after(this.responseText, this);
        }
      }
    }

    function handleBut() {
      if (!isFunction(_self._but)) return;

      xhr.onerror = function(e) {
        _self._but(e, this);
      }
    }

    function handleWhatever() {
      if (!isFunction(_self._whatever)) return;

      _self._whatever(this.responseText, this);
    }
  }

  function isFunction(func) {
    return typeof func === 'function';
  }

  function isObject(obj) {
    return typeof obj === 'object';
  }

  function isUndefined(val) {
    return val === undefined;
  }

  function isString(val) {
    return typeof val === 'string';
  }

  function isVisibleContent(val) {
    return (val !== undefined) && (val !== null) && (String(val).trim() !== '');
  }

  function indexOf(content, sub) {
    if (!isString(content)) {
      throw new TypeError('IndexOf does not accept content of non-string');
    }

    return content.indexOf(sub);
  }

  var HttpStatus = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  }

  var HttpMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    HEAD: 'HEAD',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
    OPTIONS: 'OPTIONS',
  }
})(window);
