// noop

document.writeln('test');

console.log(':-)');

if (module.hot) {
  module.hot.accept();
  // module.hot.dispose(() => {});
}
