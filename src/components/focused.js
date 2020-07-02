module.exports = (target) => {
  document.dispatchEvent(new CustomEvent("elementFocused", { target: target }));
};
