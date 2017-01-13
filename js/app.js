var dotaApp = angular.module('dotaApp', ['ngRoute']);
//service
dotaApp.service('heroListService', function () {
        this.herolist = "";
    
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
    $http.get('npc_heroes.json').then(function (res) {
        $scope.heroes = res.data;
        
        //console.log($scope.heroes);
        heroListService.herolist = $scope.heroes;
        //console.log(heroListService.herolist);
    });
    //$scope.s1=$scope.heroes.splice(0,30);
    
    //$scope.s2=$scope.heroes.slice(21,40);
    $scope.selectedHero = 'select a hero';
    $scope.selectHero = function(hero){
        $scope.selectedHero = hero.url;
        $scope.selectedHero = $scope.selectedHero.replace(/_/g," ");
        $scope.herorange = (hero.AttackCapabilities == "DOTA_UNIT_CAP_MELEE_ATTACK")?"Melee":"Ranged";
        $scope.selectedRoles = hero.Role.split(",");
        //console.log($scope.selectedRoles);
    };
    
}]);
dotaApp.controller('heroController', ['$scope', '$routeParams', 'heroListService', function ($scope, $routeParams, heroListService) {
    $scope.heroname = $routeParams.heroname;
    console.log($scope.heroname);
    console.log(heroListService.herolist);
    for (var i = 0, len = heroListService.herolist.length; i < len; i++) {
        if ($scope.heroname == heroListService.herolist[i].url) {
            $scope.heroSelected = heroListService.herolist[i];
            $scope.selectedRoles = $scope.heroSelected.Role.split(",");
            //console.log($scope.heroSelected);
            //console.log($scope.selectedRoles);
            break;
        }
    }
    $scope.heroFunc = function(hero){
        return ParseInt(hero.HeroID);
    };
    
    
    //Selected hero info in heroSelected variable
    //console.log($scope.heroSelected);
}]);

dotaApp.filter('capitalizeWord', function() {
    return function(text) {
      return (!!text) ? text.charAt(0).toUpperCase() + text.substr(1).toLowerCase() : '';
    }
});

dotaApp.filter('removeUnderscore', function(){
    return function(hero){
        console.log(hero);
        var herolink = hero.replace(/_/g," ");
        return herolink;
    }
});

dotaApp.filter('rangeFilter', function(){
    return function(attack){
        console.log(attack);
        var herorange = (attack == "DOTA_UNIT_CAP_MELEE_ATTACK")?"Melee":"Ranged";
        return herorange;
    }
});