// Client-side include for the site footer
// - Fetches a static partial (partials/footer.html)
// - Strips any injected <script> blocks (e.g., from dev servers)
// - Inserts a sanitized <footer> into #site-footer
// - Falls back to a minimal footer if anything goes wrong
(function () {
  // --- Config --------------------------------------------------------------
  var DEBUG = false; // set true to enable console logs
  var FOOTER_PATH = './partials/footer.html';

  // --- Utilities -----------------------------------------------------------
  /** Log helper guarded by DEBUG flag */
  function log() {
    try { if (DEBUG && typeof console !== 'undefined' && console.log) console.log.apply(console, arguments); } catch (_) {}
  }

  /**
   * Very small fallback in case fetching/parsing fails
   * @param {HTMLElement} target Container where the footer should be inserted
   */
  function minimalFallback(target) {
    target.innerHTML = '<footer><div class="footerCtn" style="text-align:center; padding:10px; font-size:0.9em; color:#333;">&copy; 2012-2025 <strong>SalidaSings.org</strong></div></footer>';
  }

  /** Remove script tags and common live-server injections from a string of HTML */
  function stripScripts(html) {
    return html
      .replace(/<!--\s*Code injected by live-server\s*-->[\s\S]*?<\/script>/gi, '')
      .replace(/<script\b[\s\S]*?<\/script>/gi, '');
  }

  /**
   * Parse a string of HTML and return the <footer> element, if any
   * @param {string} html
   * @returns {HTMLElement|null}
   */
  function parseFooterFrom(html) {
    var clean = stripScripts(html);
    // Use DOMParser when available
    if (typeof DOMParser !== 'undefined') {
      try {
        var parser = new DOMParser();
        var doc = parser.parseFromString(clean, 'text/html');
        // Defensive: remove any stray scripts
        var scripts = doc.querySelectorAll('script');
        scripts.forEach(function (s) { if (s.parentNode) s.parentNode.removeChild(s); });
        return doc.querySelector('footer');
      } catch (e) {
        log('DOMParser failed, falling back to innerHTML string insert', e);
      }
    }
    // Fallback: create a temp container and query footer
    var div = document.createElement('div');
    div.innerHTML = clean;
    return div.querySelector('footer') || null;
  }

  /** Replace the placeholder content with the sanitized footer element */
  function insertFooter(placeholder, footerEl) {
    placeholder.innerHTML = '';
    placeholder.appendChild(footerEl);
  }

  // --- Main flow -----------------------------------------------------------
  function injectFooter() {
    var placeholder = document.getElementById('site-footer');
    if (!placeholder) return;

    // Resolve the footer URL relative to the current page
    var footerUrl;
    try {
      footerUrl = new URL(FOOTER_PATH, window.location.href).toString();
    } catch (_) {
      footerUrl = FOOTER_PATH; // fallback if URL api is unavailable
    }

    function handleResponse(html) {
      var footer = parseFooterFrom(html);
      if (footer) {
        insertFooter(placeholder, footer);
        log('Footer inserted (sanitized)');
      } else {
        // As a last resort, insert the stripped string directly
        placeholder.innerHTML = stripScripts(html);
        log('Footer inserted (string fallback)');
      }
    }

    // Prefer fetch with no-cache to avoid 304 edge cases
    if (window.fetch) {
      fetch(footerUrl, { cache: 'no-cache' })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.text();
        })
        .then(handleResponse)
        .catch(function (err) {
          log('Footer fetch failed:', err);
          minimalFallback(placeholder);
        });
      return;
    }

    // XHR fallback with cache-bust query
    var xhr = new XMLHttpRequest();
    xhr.open('GET', footerUrl + (footerUrl.indexOf('?') === -1 ? '?' : '&') + 'v=' + Date.now(), true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        // Treat 200-399 as success; require non-empty body
        if ((xhr.status >= 200 && xhr.status < 400) && xhr.responseText) {
          handleResponse(xhr.responseText);
        } else {
          minimalFallback(placeholder);
        }
      }
    };
    try { xhr.send(); } catch (err) {
      log('Footer XHR send failed:', err);
      minimalFallback(placeholder);
    }
  }

  // Run as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }
})();
