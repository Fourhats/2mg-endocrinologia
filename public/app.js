angular.module("workshopsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/workshops-list.html",
                controller: "WorkshopsController",
                resolve: {
                    workshops: function(WorkshopsService) {
                        return WorkshopsService.getWorkshops();
                    }
                }
            })
            .when("/users/new", {
                controller: "NewUserController",
                templateUrl: "views/user-form.html"
            })
            .when("/workshops/new", {
                controller: "NewWorkshopController",
                templateUrl: "views/workshop-form.html"
            })
            .when("/workshops/:workshopId", {
                controller: "EditWorkshopController",
                templateUrl: "views/workshop.html"
            })
            .when("/inscriptions/:workshopId", {
                controller: "NewInscriptionController",
                templateUrl: "views/inscription-form.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    })

    .service("WorkshopsService", function($http) {
        this.getWorkshops = function() {
            return $http.get("/workshops").then(function(response) {
                return response;
            }, function(response) {
                console.log(response.data.error);
            });
        };

        this.getWorkshop = function(workshopId) {
            var url = "/workshops/" + workshopId;

            return $http.get(url).then(function(response) {
                return response;
            }, function(response) {
                console.log(response.data.error);
            });
        }

        this.createWorkshop = function(workshop) {
            return $http.post("/workshops", workshop).then(function(response) {
                return response;
            }, function(response) {
                console.log(response.data.error);
            });
        }

        // this.editWorkshop = function (workshop) {
        //   var url = "/workshops/" + workshop._id;
        //   console.log(workshop._id);

        //   return $http.put(url, workshop).then(function (response) {
        //     return response;
        //   }, function (response) {
        //     console.log("Error editing this workshop.");
        //     console.log(response);
        //   });
        // }

        // this.deleteWorkshop = function (workshopId) {
        //   var url = "/workshops/" + workshopId;

        //   return $http.delete(url).then(function (response) {
        //     return response;
        //   }, function (response) {
        //     console.log("Error deleting this workshop.");
        //     console.log(response);
        //   });
        // }
    })
    .service("UsersService", function($http) {
        this.createUser = function(user) {
            return $http.post("/users", user).then(function(response) {
                return response;
            }, function(response) {
                console.log(response.data.error);
            });
        }
    })
    .service("InscriptionsService", function($http) {
        this.saveInscription = function(inscription) {
            return $http.post("/inscriptions", inscription).then(function(response) {
                return response;
            }, function(response) {
                console.log(response.data.error);
            });
        }
    })

    .controller("WorkshopsController", function($scope, workshops) {
        $scope.workshops = workshops.data;
    })
    .controller("NewUserController", function($scope, $location, UsersService) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveUser = function(user) {
            UsersService.createUser(user).then(function(doc) {
                $location.path("#/");
            }, function(response) {
                console.log(response);
            });
        }
    })
    .controller("NewWorkshopController", function($scope, $location, WorkshopsService) {
        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveWorkshop = function(workshop) {
            WorkshopsService.createWorkshop(workshop).then(function(doc) {
                $location.path("#/");
            }, function(response) {
                console.log(response);
            });
        }
    })
    .controller("EditWorkshopController", function($scope, $routeParams, WorkshopsService) {
        WorkshopsService.getWorkshop($routeParams.workshopId).then(function(doc) {
            $scope.workshop = doc;
        }, function(response) {
            console.log(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.workshopFormUrl = "workshop-form.html";
        }

        $scope.back = function() {
            $scope.editMode = false;
            $scope.workshopFormUrl = "";
        }

        $scope.saveWorkshop = function(workshop) {
            WorkshopsService.editWorkshop(workshop);
            $scope.editMode = false;
            $scope.workshopFormUrl = "";
        }

        $scope.deleteWorkshop = function(workshopId) {
            WorkshopsService.deleteWorkshop(workshopId);
        }
    })
    .controller("NewInscriptionController", function($scope, $routeParams, $location, WorkshopsService, InscriptionsService) {
        WorkshopsService.getWorkshop($routeParams.workshopId).then(function(doc) {
            $scope.workshop = doc.data;
        }, function(response) {
            console.log(response);
        });

        $scope.back = function() {
            $location.path("#/");
        }

        $scope.saveInscription = function(workshop, user) {
            var inscription = {
                workshopId: workshop.id,
                dni: user.dni
            }

            InscriptionsService.saveInscription(inscription).then(function(doc) {
                $location.path("#/");
            }, function(response) {
                console.log(response);
            });
        }
    });