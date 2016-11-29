var dbService = new (require('./dbService'));

var service = function () {
  this.getAll = function () {
    var db = dbService.getDB();

    var stmt = db.prepare("SELECT * FROM workshops");

    var workshops = [];
    while (stmt.step()) {
      var row = stmt.getAsObject();
      workshops.push(row)
    }
    stmt.free();

    return workshops;
  }

  this.getById = function (workshopId) {
    var db = dbService.getDB();

    var stmt = db.prepare("SELECT * FROM workshops w WHERE w.id = $workshopId");
    stmt.bind({
      $workshopId: workshopId
    });

    var workshop = {};
    while (stmt.step()) {
      workshop = stmt.getAsObject();
    }
    stmt.free();

    return workshop;
  }

  this.create = function (workshop) {
    var db = dbService.getDB();
    workshop.type = 'A';

    var stmt = db.prepare("INSERT INTO workshops (name, type, capacity, description) VALUES (?, ?, ?, ?)");
    stmt.run([workshop.name, workshop.type, workshop.capacity, workshop.description]);
    stmt.free();

    dbService.writeDB(db.export());
  }

  this.hasCapacity = function (workshopId) {
    var db = dbService.getDB();

    var stmt = db.prepare("SELECT COUNT(*) as 'count' FROM inscriptions i WHERE i.workshopId = $workshopId");
    stmt.bind({
      $workshopId: workshopId
    });

    var workshopInscriptions = {};
    while (stmt.step()) {
      workshopInscriptions = stmt.getAsObject();
    }
    stmt.free();

    var workshop = this.getById(workshopId);

    return workshop.capacity > workshopInscriptions.count
  }

  // this.update = function (expense) {
  //   var db = dbService.getDB();

  //   var stmt = db.prepare("INSERT INTO workshops (name, type, capacity, description) VALUES (?, ?, ?, ?)");
  //   stmt.run([workshop.name, workshop.type, workshop.capacity, workshop.description]);
  //   stmt.free();

  //   dbService.writeDB(db.export());
  // }
}

module.exports = service;