const { watch, task } = require('gulp');
const gls = require('gulp-live-server');

const publicFolder = './public/'


exports.serve = task('serve', () => {
  var server = gls.static(publicFolder, 3000)
  server.start();
  watch([publicFolder + '**/*'], (name) => {
    server.notify.apply(server, [file]);
  })
})
