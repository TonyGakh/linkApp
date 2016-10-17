'use strict';

var lectors = angular.module('lectors', []);

lectors.
component('lectors', {
    templateUrl: 'pages/lectors/tpl/lectors.tpl.html',
    controller: [ 'ModalService', 'VarsService',
        function LectorsController(ModalService, VarsService) {
            var _this = this;
            this.rates = vars.rates;
            
            this.changeRates = function () {
                ModalService.showModal({
                    templateUrl: "components/tpl/change.rate.tpl.html",
                    controller: ["rates", "close", function RatesModifyingController(rates, close) {
                        var _this = this;
                        this.rates = rates;
                        this.close = function() {
                            close(null, 500);
                        };
                        this.addNewRate = function () {
                            this.rates.push(VarsService.createEntityWithId());
                        };
                        this.removeRate = function (index) {
                            this.rates.splice(index, 1);
                        };
                        this.changeRates = function () {
                            close(this.rates, 500);
                        }
                    }],
                    controllerAs: "vm",
                    inputs: {
                        rates: angular.copy(_this.rates)
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(function (newRates) {
                        if (newRates) {
                            vars.rates = _this.rates = angular.copy(newRates);
                            VarsService.saveVars(vars);
                        }
                    });
                });
            }
        }
    ],
    controllerAs: "vm"
});