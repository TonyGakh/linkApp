'use strict';

var lectors = angular.module('lectors', []);

lectors.component('lectors', {
    templateUrl: 'pages/lectors/tpl/lectors.tpl.html',
    controller: ['ModalService', 'VarsService',
        function LectorsController(ModalService, VarsService) {
            var _this = this;
            this.rates = vars.rates;

            this.lectors = vars.lectors;

            this.newLector = {};

            this.addLector = function () {
                if (!this.newLector.name || !this.newLector.rate) {
                    alert('Неполные данные');
                    return
                }
                this.lectors.push(VarsService.createEntityWithId({
                    name: this.newLector.name,
                    rate: this.newLector.rate,
                    dip: this.newLector.dip !== undefined ? this.newLector.dip : false
                }));
                for (var key in this.newLector) {
                    this.newLector[key] = undefined;
                }
                VarsService.saveVars(vars);
            };

            this.removeLector = function (index) {
                this.lectors.splice(index, 1);
                VarsService.saveVars(vars);
            };


            this.changeRates = function () {
                ModalService.showModal({
                    templateUrl: "components/tpl/change.rate.tpl.html",
                    controller: ["rates", "close", function RatesModifyingController(rates, close) {
                        var _this = this;
                        this.rates = rates;
                        this.close = function () {
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
                }).then(function (modal) {
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