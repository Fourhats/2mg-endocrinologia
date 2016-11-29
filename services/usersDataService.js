var dbService = new (require('./dbService'));

var service = function () {
  this.userExists = function (dni) {
    var db = dbService.getDB();

    var stmt = db.prepare("SELECT * FROM users u WHERE u.dni = $dni");
    stmt.bind({
      $dni: dni
    });

    var existingUser = null;
    while (stmt.step()) {
      existingUser = stmt.getAsObject();
    }
    stmt.free();

    return existingUser != null;
  }

  this.create = function (user) {
    var db = dbService.getDB();

    var stmt = db.prepare("INSERT INTO users (dni) VALUES (?)");
    stmt.run([user.dni]);
    stmt.free();

    dbService.writeDB(db.export());
  }
}

module.exports = service;