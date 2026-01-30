// Tests for the weather app
// These tests are resilient: they feature-detect available functions and mock fetch.

(function(){
  // Utility to install a mock fetch for predictable results
  function withMockFetch(responseConfig, fn) {
    const original = window.fetch;
    window.fetch = async (url, opts) => {
      const { ok = true, status = 200, json = {}, text } = responseConfig(typeof url === 'string' ? url : url.toString(), opts) || {};
      return {
        ok,
        status,
        async json() { return json; },
        async text() { return typeof text === 'string' ? text : JSON.stringify(json); }
      };
    };
    const restore = () => { window.fetch = original; };
    try { return Promise.resolve(fn()).finally(restore); } catch (e) { restore(); throw e; }
  }

  describe('Smoke', () => {
    it('Carga de scripts sin errores y presencia de elementos UI esperados', () => {
      const form = document.querySelector('#search-form');
      const input = document.querySelector('#city');
      const status = document.querySelector('#status');
      const result = document.querySelector('#result');
      expect(!!form && !!input && !!status && !!result).toBe(true);
    });
  });

  describe('getCoordinates', () => {
    it('Existe y es una función async', () => {
      expect(typeof window.getCoordinates).toBe('function');
    });

    it('Devuelve coordenadas para una ciudad cuando fetch responde con resultados', async () => {
      if (typeof window.getCoordinates !== 'function') return; // skip if not present
      await withMockFetch((url) => {
        // validate query params presence
        expect(url.includes('geocoding-api.open-meteo.com')).toBe(true);
        return {
          ok: true,
          status: 200,
          json: {
            results: [{ latitude: -12.0464, longitude: -77.0428, name: 'Lima', country_code: 'PE' }]
          }
        };
      }, async () => {
        const data = await window.getCoordinates('Lima');
        expect(data).toEqual({ lat: -12.0464, lon: -77.0428, name: 'Lima', country: 'PE' });
      });
    });

    it('Lanza error cuando no hay resultados', async () => {
      if (typeof window.getCoordinates !== 'function') return; // skip
      await withMockFetch(() => ({ ok: true, status: 200, json: { results: [] } }), async () => {
        let threw = false;
        try { await window.getCoordinates('Nowhere'); } catch (e) { threw = true; }
        expect(threw).toBe(true);
      });
    });

    it('Lanza error cuando la respuesta no es OK', async () => {
      if (typeof window.getCoordinates !== 'function') return; // skip
      await withMockFetch(() => ({ ok: false, status: 500, json: {} }), async () => {
        let threw = false;
        try { await window.getCoordinates('ErrorCity'); } catch (e) { threw = true; }
        expect(threw).toBe(true);
      });
    });
  });

  describe('UI helpers', () => {
    it('UI.setStatus aplica texto y clase', () => {
      if (!window.UI) return; // skip
      const el = document.getElementById('status');
      window.UI.setStatus('Listo', 'ok');
      expect(el.textContent).toBe('Listo');
      expect(el.className.includes('ok')).toBe(true);
    });

    it('UI.setLoading deshabilita el botón y cambia el texto', () => {
      if (!window.UI) return; // skip
      const form = document.getElementById('search-form');
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      window.UI.setLoading(true);
      expect(btn.disabled).toBe(true);
      expect(btn.textContent).toBe('Buscando…');
      window.UI.setLoading(false);
      expect(btn.disabled).toBe(false);
      expect(btn.textContent).toBe('Buscar');
      // restore
      btn.textContent = original;
    });

    it('UI.showResult muestra datos formateados y desoculta', () => {
      if (!window.UI) return; // skip
      const result = document.getElementById('result');
      result.hidden = true;
      window.UI.showResult({ name: 'Lima', country: 'PE', temperature: 23.6, units: 'C', observationTime: '10:00' });
      expect(document.getElementById('place').textContent).toBe('Lima, PE');
      expect(document.getElementById('temp').textContent).toBe(String(Math.round(23.6)));
      expect(document.getElementById('details').textContent.includes('10:00')).toBe(true);
      expect(result.hidden).toBe(false);
    });

    it('UI.hideResult oculta la sección', () => {
      if (!window.UI) return; // skip
      const result = document.getElementById('result');
      window.UI.hideResult();
      expect(result.hidden).toBe(true);
    });
  });
})();
