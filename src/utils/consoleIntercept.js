
(() => {
  function isDevEnvironment() {
    return (
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1" ||
      location.hostname === "[::1]"
    );
  }

  if (!isDevEnvironment()) {
    const noop = () => {};
    const consoleMethods = [
      'log', 'warn', 'error', 'info', 'debug',
      'time', 'timeEnd', 'table', 'clear', 'count',
      'group', 'groupEnd', 'assert', 'dir', 'dirxml', 'trace'
    ];
    consoleMethods.forEach(m => typeof console[m] === 'function' && (console[m] = noop));
  }
})()