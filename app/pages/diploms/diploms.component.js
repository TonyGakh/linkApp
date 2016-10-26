'use strict';

var diploms = angular.module('diploms', []);

diploms.
component('diploms', {
    templateUrl: 'pages/diploms/tpl/diploms.html',
    controller: [ 'ModalService', 'VarsService',
        function diplomsController(ModalService, VarsService, $state) {
            this.lectors = vars.lectors;
            this.state = $state;
            this.active = this.lectors[0] ? 0 : undefined;

            this.moveLeft = function(lector){
                if(lector.dipNum>0){
                    lector.cursNum = lector.cursNum + 1;
                    lector.dipNum = lector.dipNum - 1;
                }
            };

            this.moveRight = function(lector){
                if(lector.cursNum>0){
                    lector.cursNum = lector.cursNum - 1;
                    lector.dipNum = lector.dipNum + 1;
                }
            };

            this.saveChanges = function(){
                VarsService.saveVars(vars);
            }
        }
    ],
    controllerAs: "vm"
});