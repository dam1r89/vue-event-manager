var fs = require('fs');
var rollup = require('rollup');
var uglify = require('uglify-js');
var buble = require('rollup-plugin-buble');
var package = require('../package.json');
var banner =
    "/*!\n" +
    " * vue-event-manager v" + package.version + "\n" +
    " * https://github.com/pagekit/vue-event-manager\n" +
    " * Released under the MIT License.\n" +
    " */\n";

rollup.rollup({
  entry: 'src/index.js',
  plugins: [buble()]
})
.then(function (bundle) {
  return write('dist/vue-event-manager.js', bundle.generate({
    format: 'umd',
    banner: banner,
    moduleName: 'VueEventManager'
  }).code, bundle);
})
.then(function (bundle) {
  var code = fs.readFileSync('dist/vue-event-manager.js', 'utf8');
  return write('dist/vue-event-manager.min.js',
    banner + '\n' + uglify.minify(code).code,
  bundle);
})
.then(function (bundle) {
  return write('dist/vue-event-manager.es2015.js', bundle.generate({
    format: 'es',
    banner: banner
  }).code, bundle);
})
.then(function (bundle) {
  return write('dist/vue-event-manager.common.js', bundle.generate({
    format: 'cjs',
    banner: banner
  }).code, bundle);
})
.catch(logError);

function write(dest, code, bundle) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err);
      console.log(blue(dest) + ' ' + getSize(code));
      resolve(bundle);
    });
  });
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError(e) {
  console.log(e);
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
