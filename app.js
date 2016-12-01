angular.module("workshopsApp", ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                controller: "MainController",
                templateUrl: "site.html",
            })
            .when("/report", {
                controller: "ReportController",
                templateUrl: "report.html",
            })
            .otherwise({
                redirectTo: "/"
            })
    })

    .controller("MainController", function ($scope, WorkshopsService, UsersService, InscriptionsService) {
        $scope.isDniSet = false;
        $scope.workshops = [];

        $scope.submitDni = function (dni) {
            if (!Number.isInteger(dni)) {
                alert('DNI no válido');
            }

            UsersService.userExists(dni).then(function (response) {
                var userExists = response.data;

                if (userExists) {
                    $scope.userDni = dni;
                    $scope.isDniSet = true;

                    $scope.getWorkshops();


                    // divs visibility
                    angular.element('.inner.content').hide();
                    angular.element('#div2').show();
                } else {
                    alert('DNI no válido');
                }
            })
        }

        $scope.getWorkshops = function () {
            WorkshopsService.getWorkshops($scope.userDni).then(function (response) {
                $scope.workshops = response.data;
            });
        }

        $scope.enroll = function (workshop) {
            if (confirm("¿Confirmar inscripción a " + workshop.title + "?")) {
                var inscription = {
                    workshopId: workshop.id,
                    dni: $scope.userDni
                };

                InscriptionsService.saveInscription(inscription).then(function () {
                    $scope.getWorkshops();
                });
            }
        }
    })
    .controller("ReportController", function ($scope, WorkshopsService, UsersService, InscriptionsService) {
        $scope.getInscriptionsReport = function () {
            WorkshopsService.getInscriptionsReport().then(function (response) {
                $scope.inscriptionsReport = response.data;
            });
        }

        $scope.getInscriptionsReport();
    })

    .service("WorkshopsService", function ($http) {
        this.getWorkshops = function (dni) {
            var url = "https://thawing-plains-13266.herokuapp.com/workshops/" + dni;

            return $http.get(url).then(function (response) {
                return response;
            }, function (response) {
                console.log(response.data.error);
            });
        };

        this.getWorkshop = function (workshopId) {
            var url = "https://thawing-plains-13266.herokuapp.com/workshops/" + workshopId;

            return $http.get(url).then(function (response) {
                return response;
            }, function (response) {
                console.log(response.data.error);
            });
        }

        this.createWorkshop = function (workshop) {
            return $http.post("https://thawing-plains-13266.herokuapp.com/workshops", workshop).then(function (response) {
                return response;
            }, function (response) {
                console.log(response.data.error);
            });
        }

        this.getInscriptionsReport = function () {
            return $http.get("https://thawing-plains-13266.herokuapp.com/inscriptions/report").then(function (response) {
                return response;
            }, function (response) {
                console.log(response.data.error);
            });
        }
    })
    .service("UsersService", function ($http) {
        this.userExists = function (dni) {
            var url = "https://thawing-plains-13266.herokuapp.com/users/" + dni;

            return $http.get(url).then(function (response) {
                return response;
            }, function (response) {
                console.log(response.data.error);
            });
        }

        this.createUser = function (user) {
            return $http.post("https://thawing-plains-13266.herokuapp.com/users", user).then(function (response) {
                return response;
            }, function (response) {
                console.log(response.data.error);
            });
        }
    })
    .service("InscriptionsService", function ($http) {
        this.saveInscription = function (inscription) {
            return $http.post("https://thawing-plains-13266.herokuapp.com/inscriptions", inscription).then(function (response) {
                return response;
            }, function (response) {
                console.log(response.data.error);
            });
        }
    });