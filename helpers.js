/**
 * 帮助工具
 */
var path = require('path');
var glob = require('glob');

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function getEntry(globPath, pathDir) {
  var files = glob.sync(globPath);
  var entries = {},
    entry, dirname, basename, pathname, extname, clonepathname;
  var re = /\\/gi;

  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    pathname = path.join(dirname, basename);
    clonepathname = pathname.replace(re, '/');
    pathname = pathDir ? clonepathname.replace(new RegExp('^' + pathDir), '') : pathname;
    entries[pathname] = ['./' + entry];
  }
  return entries;
}

exports.root = root;
exports.getEntry = getEntry;
