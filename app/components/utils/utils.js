'use strict';

var utils = angular.module('utils', []);

utils.service('VarsService', ['$http',
    function($http) {
    this.saveVars = function (vars) {
        var promise = $http.post('/saveVars', {"vars": vars});
        promise.then(function (result) {
            console.log(result.data);
        }, function (result) {
            console.log(result.data);
        });
        return promise;
    };
    
    this.createEntityWithId = function (entity) {
        var newEntity = entity? angular.copy(entity): {};
        newEntity.id = 1 + Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 1));
        return newEntity;
    }
}]);