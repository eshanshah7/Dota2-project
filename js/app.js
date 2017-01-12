var dotaApp = angular.module('dotaApp', ['ngRoute']);
//service
dotaApp.service('heroListService', function () {
        this.herolist = '';
    })
    //configure routes
dotaApp.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider.when('/', {
        templateUrl: 'pages/home.html'
        , controller: 'mainController'
    }).when('/hero/:heroname', {
        templateUrl: 'pages/hero.html'
        , controller: 'heroController'
    });
});
dotaApp.controller('mainController', ['$scope', '$http', 'heroListService', function ($scope, $http, heroListService) {
    $http.get('herodata.json').then(function (res) {
        $scope.heroes = res.data;
        heroListService.herolist = $scope.heroes;
    });
    //$scope.s1=$scope.heroes.splice(0,30);
    //console.log(heroListService.herolist.length);
    //$scope.s2=$scope.heroes.slice(21,40);
    $scope.selectedHero = 'select a hero';
    $scope.selectHero = function(hero){
        $scope.selectedHero = hero.HERO;
        $scope.herorange = hero.RANGE;
        $scope.selectedRoles = hero.ROLES;
        //console.log($scope.selectedRoles);
    };
    
}]);
dotaApp.controller('heroController', ['$scope', '$routeParams', 'heroListService', function ($scope, $routeParams, heroListService) {
    $scope.heroname = $routeParams.heroname;
    for (var i = 0, len = heroListService.herolist.length; i < len; i++) {
        if ($scope.heroname == heroListService.herolist[i].HERO) {
            $scope.heroSelected = heroListService.herolist[i];
            break;
        }
    }
    //Selected hero info in heroSelected variable
    //console.log($scope.heroSelected);
}]);

dotaApp.filter('capitalizeWord', function() {
    return function(text) {
      return (!!text) ? text.charAt(0).toUpperCase() + text.substr(1).toLowerCase() : '';
    }
});