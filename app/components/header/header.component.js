'use strict';

var header = angular.module('header', []);

header.
component('header', {
    templateUrl: 'components/header/header.tpl.html',
    controller: ['$http',
        function HeaderController($http) {
            this.menuItems = vars.menuItems;
            
            this.printTables = function () {


                function s2ab(s) {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }

                /* original data */
                var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]];

                var promise = $http.post('/printTables', {"data": data});
                promise.then(function (result) {
                    console.log(result.data);

                    saveAs(new Blob([s2ab(result.data.blob.contentAsString)],{type: result.data.blob.type}), result.data.name);
                }, function (result) {
                    console.log(result.data);
                });
            }
        }
    ],
    controllerAs: "vm"
});