var dotaApp = angular.module('dotaApp', ['ngRoute', 'rzModule', 'ui.bootstrap']);
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
    $scope.selectHero = function (hero) {
        $scope.selectedHero = hero.url;
        $scope.selectedHero = $scope.selectedHero.replace(/_/g, " ");
        $scope.herorange = (hero.AttackCapabilities == "DOTA_UNIT_CAP_MELEE_ATTACK") ? "Melee" : "Ranged";
        $scope.selectedRoles = hero.Role.split(",");
        //console.log($scope.selectedRoles);
    };
}]);
dotaApp.controller('heroController', ['$scope', '$routeParams', 'heroListService', function ($scope, $routeParams, heroListService) {
    $scope.heroname = $routeParams.heroname;
    $scope.levelSlider = {
        value: 1
        , options: {
            floor: 1
            , ceil: 25
            , showSelectionBar: true
            , hideLimitLabels: true
            , getSelectionBarColor: function (value) {
                return '#2AE02A';
            }
        }
    };
    //console.log($scope.heroname);
    //console.log(heroListService.herolist);
    for (var i = 0, len = heroListService.herolist.length; i < len; i++) {
        if ($scope.heroname == heroListService.herolist[i].url) {
            $scope.heroSelected = heroListService.herolist[i];
            $scope.selectedRoles = $scope.heroSelected.Role.split(",");
            //console.log($scope.heroSelected);
            //console.log($scope.selectedRoles);
            break;
        }
    }
    var baseStrength = parseInt($scope.heroSelected.AttributeBaseStrength);
    var baseAgility = parseInt($scope.heroSelected.AttributeBaseAgility);
    var baseInt = parseInt($scope.heroSelected.AttributeBaseIntelligence);
    var strGain = parseFloat($scope.heroSelected.AttributeStrengthGain);
    var agiGain = parseFloat($scope.heroSelected.AttributeAgilityGain);
    var intGain = parseFloat($scope.heroSelected.AttributeIntelligenceGain);
    var atkDmgMin = parseInt($scope.heroSelected.AttackDamageMin);
    var atkDmgMax = parseInt($scope.heroSelected.AttackDamageMax);
    var atkRate = parseFloat($scope.heroSelected.AttackRate);
    var baseArmor = parseFloat($scope.heroSelected.ArmorPhysical);
    var baseMagRes = 25;
    var baseHP = 200;
    var baseMana = 50;
    $scope.$watch('levelSlider.value', function () {
        $scope.heroLevel = $scope.levelSlider.value;
        
        //Current attributes according to level
        $scope.currStrength = baseStrength + ($scope.heroLevel - 1) * strGain;
        console.log($scope.currStrength);
        $scope.currAgility = baseAgility + ($scope.heroLevel - 1) * agiGain;
        console.log($scope.currAgility);
        $scope.currInt = baseInt + ($scope.heroLevel - 1) * intGain;
        console.log($scope.currInt);
        
        //Select primary attribute
        if ($scope.heroSelected.AttributePrimary == "DOTA_ATTRIBUTE_STRENGTH") {
            $scope.primaryAttVal = $scope.currStrength;
        }
        else {
            if ($scope.heroSelected.AttributePrimary == "DOTA_ATTRIBUTE_AGILITY") {
                $scope.primaryAttVal = $scope.currAgility;
            }
            else {
                $scope.primaryAttVal = $scope.currInt;
            }
        }
        
        //Hero HP
        $scope.heroHP = baseHP + 20*$scope.currStrength;
        
        //Hero Mana
        $scope.heroMana = baseMana + 12*$scope.currInt;
        
        //IAS
        $scope.IAS = $scope.currAgility;
        
        //Hero Damage
        $scope.heroDamage = (atkDmgMin + atkDmgMax) / 2 + $scope.primaryAttVal;
        
        //Hero Attack Speed
        $scope.heroAtkSpd = (170 / atkRate + $scope.IAS);
        
        //Hero Armor
        $scope.heroArmor = baseArmor + ($scope.currAgility / 7);
        
        //Hero Magic Resistance
        if ($scope.heroSelected.HeroID == "82") {
            baseMagRes = 35;
        }
        if ($scope.heroSelected.HeroID == "92") {
            baseMagRes = 10;
        }
        $scope.heroMagicRes = baseMagRes;
    });
    console.log($scope.heroSelected);
    $scope.heroFunc = function (hero) {
        return ParseInt(hero.HeroID);
    };
    //Selected hero info in heroSelected variable
    //console.log($scope.heroSelected);
}]);
dotaApp.filter('capitalizeWord', function () {
    return function (text) {
        return (!!text) ? text.charAt(0).toUpperCase() + text.substr(1).toLowerCase() : '';
    }
});
dotaApp.filter('removeUnderscore', function () {
    return function (hero) {
        //console.log(hero);
        var herolink = hero.replace(/_/g, " ");
        return herolink;
    }
});
dotaApp.filter('rangeFilter', function () {
    return function (attack) {
        //console.log(attack);
        var herorange = (attack == "DOTA_UNIT_CAP_MELEE_ATTACK") ? "Melee" : "Ranged";
        return herorange;
    }
});
dotaApp.filter('floorNumber', function () {
    return function (num) {
        if (num > 0) return Math.floor(num);
        else return Math.ceil(num);
    }
});