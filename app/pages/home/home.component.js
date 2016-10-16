'use strict';

var home = angular.module('home', []);

home.
component('home', {
    templateUrl: 'pages/home/tpl/home.tpl.html',
    controller: ['ModalService',
        function HomeController(ModalService) {
            var _this = this;
            this.lectorList = [
                {
                    name: "Лавринович",
                    hours: {
                        used: 40,
                        all: 800
                    }
                }
            ];

            this.openLectorModifying = function (lector, $event) {
                openModalToLector(angular.copy(lector), changeLector);
                function changeLector(returnedObject) {
                    if (returnedObject && returnedObject.lector && returnedObject.action != 'remove') {
                        angular.merge(lector, returnedObject.lector);
                    } else {
                        _.remove(_this.lectorList, {name: lector.name});
                    }
                }
                
                $event.preventDefault();
            };
            
            this.openLectorAdding = function ($event) {
                openModalToLector({hours: {used: 0}}, addNewLector);
                function addNewLector(returnedObject) {
                    if (returnedObject && returnedObject.lector) {
                        _this.lectorList.push(returnedObject.lector);
                    }
                }
                $event.preventDefault();
            };
            
            function openModalToLector(lector, successHolder) {

                ModalService.showModal({
                    templateUrl: "pages/home/tpl/change.lector.tpl.html",
                    controller: ["lector", "close", function LectorModifyingController(lector, close) {
                        var _this = this;
                        this.lector = lector;
                        this.show = !!this.lector.name;
                        this.changeLector = function(lector, action) {
                            var returnedObject = {
                                lector: lector,
                                action: action
                            };
                            close(returnedObject, 500);
                        };
                        this.close = function() {
                            close(null, 500);
                        };
                    }],
                    controllerAs: "vm",
                    inputs: {
                        lector: lector
                    }
                }).then(function(modal) {
                    modal.element.modal();
                    modal.close.then(successHolder);
                });
            }

            this.printTables = function () {
                function datenum(v, date1904) {
                    if(date1904) v+=1462;
                    var epoch = Date.parse(v);
                    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
                }

                function sheet_from_array_of_arrays(data, opts) {
                    var ws = {};
                    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
                    for(var R = 0; R != data.length; ++R) {
                        for(var C = 0; C != data[R].length; ++C) {
                            if(range.s.r > R) range.s.r = R;
                            if(range.s.c > C) range.s.c = C;
                            if(range.e.r < R) range.e.r = R;
                            if(range.e.c < C) range.e.c = C;
                            var cell = {v: data[R][C] };
                            if(cell.v == null) continue;
                            var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

                            if(typeof cell.v === 'number') cell.t = 'n';
                            else if(typeof cell.v === 'boolean') cell.t = 'b';
                            else if(cell.v instanceof Date) {
                                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                                cell.v = datenum(cell.v);
                            }
                            else cell.t = 's';

                            ws[cell_ref] = cell;
                        }
                    }
                    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                    return ws;
                }

                /* original data */
                var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
                var ws_name = "SheetJS";

                function Workbook() {
                    if(!(this instanceof Workbook)) return new Workbook();
                    this.SheetNames = [];
                    this.Sheets = {};
                }

                var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

                /* add worksheet to workbook */
                wb.SheetNames.push(ws_name);
                wb.Sheets[ws_name] = ws;
                var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

                function s2ab(s) {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
                saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "test.xlsx")
            }
        }
    ],
    controllerAs: "vm"
});