'use strict';

var assignments = angular.module('assignments', []);

assignments.
component('assignments', {
    templateUrl: 'pages/assignments/tpl/assignments.html',
    controller: [ 'ModalService', 'VarsService', '$scope',
        function diplomsController(ModalService, VarsService, $scope, $window) {
            var self = this;
            this.disciplines = vars.disciplines ;
            this.courses = vars.courses;
            this.lectors = vars.lectors;

            this.commonDisciplines = [];
            this.specialDisciplines = [];
            this.coursesMap = {};
            divideDisciplines(this.disciplines, this.commonDisciplines, this.specialDisciplines);

            function  divideDisciplines(all, common, special){
                all.forEach(function(item){
                    if(item.type == 'common'){
                        common.push(item)
                    }
                    if(item.type == 'special'){
                        special.push(item)
                    }
                });
            }

            function mapId(array, mapObj){
                array.forEach(function(item){
                    mapObj[item.id+''] = angular.copy(item)
                });
            }

            mapId(this.courses, this.coursesMap);

            this.save = save;

            function save(){
                VarsService.saveVars(vars);
            }

            this.cancel = function(){
                window.location.reload(false);
            }

        }
    ],
    controllerAs: "vm"
});