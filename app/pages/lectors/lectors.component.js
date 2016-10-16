'use strict';

var lectors = angular.module('lectors', []);

lectors.
component('lectors', {
    templateUrl: 'pages/lectors/tpl/lectors.tpl.html',
    controller: [ 'ModalService',
        function LectorsController(ModalService) {
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
                            this.rates.push({});
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
                            _this.rates = angular.copy(newRates);
                        }
                    });
                });
            }
        }
    ],
    controllerAs: "vm"
});