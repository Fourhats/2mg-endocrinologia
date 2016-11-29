var dbService = new (require('./dbService'));
var moment = require('moment');

var service = function () {
  this.inscriptionExists = function (inscription) {
    var db = dbService.getDB();

    var stmt = db.prepare("SELECT * FROM inscriptions i WHERE i.workshopId = $workshopId AND i.dni = $dni");
    stmt.bind({
      $workshopId: inscription.workshopId,
      $dni: inscription.dni
    });

    var existingInscription = null;
    while (stmt.step()) {
      existingInscription = stmt.getAsObject();
    }
    stmt.free();

    return existingInscription != null;
  }

  this.create = function (inscription) {
    var db = dbService.getDB();
    inscription.date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    var stmt = db.prepare("INSERT INTO inscriptions (workshopId, dni, date) VALUES (?, ?, ?)");
    stmt.run([inscription.workshopId, inscription.dni, inscription.date]);
    stmt.free();

    dbService.writeDB(db.export());
  }
}

module.exports = service;