
const regex = /(auto|scroll)/;

const style = (node, prop) =>
  getComputedStyle(node, null).getPropertyValue(prop);

const scroll = (node) =>
  regex.test(
    style(node, 'overflow') +
    style(node, 'overflow-y') +
    style(node, 'overflow-x'));

const scrollparent = (node) =>
  !node || node === document.body
  ? document.body
  : scroll(node)
    ? node
    : scrollparent(node.parentNode);

export function madocScrollTo(node, offset) {
  const onde = node.offsetTop;
  const scrollable = scrollparent(node.parentNode);
  if (scrollable) {
    scrollable.scrollTop = onde - offset;
  }
}

