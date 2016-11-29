var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

// services
var workshopsDataService = new (require('./services/workshopsDataService'));
var usersDataService = new (require('./services/usersDataService'));
var inscriptionsDataService = new (require('./services/inscriptionsDataService'));

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}

//// WORKSHOPS ROUTES
app.get("/workshops", function (req, res) {
  var workshops = workshopsDataService.getAll();

  res.status(200).json(workshops);
});

app.get("/workshops/:id", function (req, res) {
  if (isNaN(req.params.id)) {
    return handleError(res, err.message, "id not numeric");
  }

  var workshop = workshopsDataService.getById(req.params.id);
  res.status(200).json(workshop);
});

app.post("/workshops", function (req, res) {
  var newWorkshop = req.body;

  if (!req.body.name || !req.body.capacity) {
    return handleError(res, "Invalid workshop input", "Must provide a name and capacity.", 400);
  }

  workshopsDataService.create(newWorkshop);

  res.status(200).json({});
});

// app.put("/workshops/:id", function (req, res) {
//   var updateDoc = req.body;
//   delete updateDoc._id;

//   db.collection(WORKSHOPS_COLLECTION).updateOne({ _id: new ObjectID(req.params.id) }, updateDoc, function (err, doc) {
//     if (err) {
//       handleError(res, err.message, "Failed to update workshop");
//     } else {
//       res.status(204).end();
//     }
//   });
// });

// app.delete("/workshops/:id", function (req, res) {
//   db.collection(WORKSHOPS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
//     if (err) {
//       handleError(res, err.message, "Failed to delete workshop");
//     } else {
//       res.status(204).end();
//     }
//   });
// });

//// USERS ROUTES
app.post("/users", function (req, res) {
  var newUser = req.body;

  if (!(req.body.dni)) {
    return handleError(res, "Invalid user input", "Must provide a DNI.", 400);
  } else {
    // TODO: validate DNI

    // validate if user already exists
    if (usersDataService.userExists(newUser.dni)) {
      return handleError(res, "Unable to create user", "User already exists.", 400);
    }

    usersDataService.create(newUser);

    res.status(200).json({});
  }
});

//// INSCRIPTIONS ROUTES
app.post("/inscriptions", function (req, res) {
  var newInscription = req.body;

  if (!newInscription.workshopId || !newInscription.dni) {
    return handleError(res, "Invalid user input", "Must provide a DNI and a Workshop ID.", 400);
  }

  // validate user is allowed
  if (!usersDataService.userExists(newInscription.dni)) {
    return handleError(res, "Invalid inscription", "User not allowed.", 400);
  }

  // validate workshop capacity
  if (!workshopsDataService.hasCapacity(newInscription.workshopId)) {
    return handleError(res, "Invalid inscription", "Workshop capacity is empty.", 400);
  }

  // validate inscription doesn't exist
  if (inscriptionsDataService.inscriptionExists(newInscription)) {
    return handleError(res, "Invalid inscription", "Inscription already in place.", 400);
  }

  // save
  inscriptionsDataService.create(newInscription);

  res.status(200).json({});
});