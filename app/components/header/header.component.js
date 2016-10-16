'use strict';

var header = angular.module('header', []);

header.
component('header', {
    templateUrl: 'components/header/header.tpl.html',
    controller: [
        function HeaderController() {
            this.menuItems = vars.menuItems;
        }
    ],
    controllerAs: "vm"
});