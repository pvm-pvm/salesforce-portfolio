export function debounce(fn, delay) {
  let timeoutId;
  function debounced(...args) {
    window.clearTimeout(timeoutId);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    timeoutId = window.setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
  debounced.clean = () => {
    window.clearTimeout(timeoutId);
  };
  return debounced;
}
