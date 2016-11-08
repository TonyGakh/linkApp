'use strict';

var lectors = angular.module('lectors', []);

lectors.component('lectors', {
    templateUrl: 'pages/lectors/tpl/lectors.tpl.html',
    controller: ['ModalService', 'VarsService',
        function LectorsController(ModalService, VarsService) {
            var _this = this;
            this.rates = vars.rates;

            this.lectors = vars.lectors || [];
            this.other = vars.other || [];

            this.lectorsMap = {};

            function mapId(array, mapObj){
                array.forEach(function(item){
                    mapObj[item.id+''] = angular.copy(item)
                });
            }

            mapId(this.lectors, this.lectorsMap);

            this.newLector = {};
            this.newOther = {};

            this.addLector = function () {
                if (!this.newLector.name || !this.newLector.rate) {
                    alert('Неполные данные');
                    return
                }
                this.lectors.push(VarsService.createEntityWithId({
                    name: this.newLector.name,
                    rate: this.newLector.rate,
                    cursNum: this.newLector.cursNum,
                    dipNum: this.newLector.dipNum
                }));
                for (var key in this.newLector) {
                    this.newLector[key] = undefined;
                }
                VarsService.saveVars(vars);
            };

            this.addOther = function () {
                if (!this.newOther.name || !this.newOther.hours || !this.newOther.lector) {
                    alert('Неполные данные');
                    return
                }
                this.other.push(VarsService.createEntityWithId({
                    name: this.newOther.name,
                    hours: this.newOther.hours,
                    lector: this.newOther.lector
                }));
                for (var key in this.newOther) {
                    this.newOther[key] = undefined;
                }
                VarsService.saveVars(vars);
            };

            this.removeLector = function (index) {
                this.lectors.splice(index, 1);
                VarsService.saveVars(vars);
            };

            this.removeOther = function (index) {
                this.other.splice(index, 1);
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