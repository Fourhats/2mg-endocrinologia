var fs = require('fs');
var SQL = require('sql.js');

var service = function () {
  var dbPath = 'db/workshops.db';

  this.getDB = function () {
    var filebuffer = fs.readFileSync(dbPath);

    return new SQL.Database(filebuffer);
  }

  this.writeDB = function (data) {
    var filebuffer = new Buffer(data);
    fs.writeFileSync(dbPath, filebuffer);
  }
}

module.exports = service;
