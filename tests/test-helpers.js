// Minimal test runner and assertion helpers for in-browser tests
(function(){
  const results = [];
  let currentSuite = [];

  function logResult(type, name, error) {
    results.push({ type, name, error });
  }

  function render() {
    const root = document.getElementById('test-output');
    if (!root) return;
    const total = results.length;
    const failed = results.filter(r => r.type === 'fail').length;
    const passed = results.filter(r => r.type === 'pass').length;

    const summary = document.createElement('div');
    summary.className = 'summary';
    summary.textContent = `Total: ${total}  ✓ Pasadas: ${passed}  ✗ Fallidas: ${failed}`;

    const list = document.createElement('ul');
    list.className = 'results';

    for (const r of results) {
      const li = document.createElement('li');
      li.className = r.type;
      li.textContent = `${r.type === 'pass' ? '✓' : '✗'} ${r.name}${r.error ? ' — ' + r.error.message : ''}`;
      list.appendChild(li);
    }

    root.innerHTML = '';
    root.appendChild(summary);
    root.appendChild(list);
  }

  function describe(name, fn) {
    currentSuite.push(name);
    try { fn(); } finally { currentSuite.pop(); }
  }

  function it(name, fn) {
    const fullName = [...currentSuite, name].join(' > ');
    try {
      const r = fn();
      if (r && typeof r.then === 'function') {
        // async
        r.then(() => {
          logResult('pass', fullName);
          render();
        }).catch(err => {
          logResult('fail', fullName, err instanceof Error ? err : new Error(String(err)));
          render();
        });
      } else {
        logResult('pass', fullName);
        render();
      }
    } catch (err) {
      logResult('fail', fullName, err instanceof Error ? err : new Error(String(err)));
      render();
    }
  }

  function expect(received) {
    function assert(condition, message) {
      if (!condition) throw new Error(message);
    }
    return {
      toBe(expected) { assert(Object.is(received, expected), `Esperado ${expected} pero se recibió ${received}`); },
      toEqual(expected) {
        const a = JSON.stringify(received);
        const b = JSON.stringify(expected);
        assert(a === b, `Esperado deep-equal ${b} pero se recibió ${a}`);
      },
      toBeDefined() { assert(typeof received !== 'undefined', 'Valor no definido'); },
      toBeInstanceOf(ctor) { assert(received instanceof ctor, `Esperado instancia de ${ctor.name}`); },
      toBeTruthy() { assert(!!received, 'Esperado valor truthy'); },
      toBeFalsy() { assert(!received, 'Esperado valor falsy'); },
      toBeTypeOf(t) { assert(typeof received === t, `Esperado tipo ${t} y se recibió ${typeof received}`); },
    };
  }

  // expose globals
  window.describe = describe;
  window.it = it;
  window.expect = expect;
})();
