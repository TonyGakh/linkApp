'use strict';

var disciplines = angular.module('disciplines', []);

disciplines.
component('disciplines', {
    templateUrl: 'pages/disciplines/tpl/disciplines.html',
    controller: [ 'ModalService', 'VarsService', '$scope',
        function diplomsController(ModalService, VarsService, $scope) {
            var self = this;
            this.disciplines = vars.disciplines;

            this.activeDiscipline = this.disciplines && this.disciplines[0] ? 0 : undefined;

            this.newDiscipline = {name: undefined, subs:[]};

            this.addGroup = function(){
                if (!this.newGroup.name || !this.newGroup.all) {
                    alert('Неполные данные');
                    return
                }
                this.courses[this.activeCourse].groups.push(VarsService.createEntityWithId({
                    name: this.newGroup.name,
                    all: this.newGroup.all,
                    mou: this.newGroup.mou !== undefined ? this.newGroup.mou : 0
                }));
                for (var key in this.newGroup) {
                    this.newGroup[key] = undefined;
                }
                VarsService.saveVars(vars);
            };

            this.removeGroup = function (index) {
                this.courses[this.activeCourse].groups.splice(index, 1);
                VarsService.saveVars(vars);
            };


            this.addDiscipline = function(){
                ModalService.showModal({
                    templateUrl: "components/tpl/add.course.tpl.html",
                    controller: ["courses", "close", function RatesModifyingController(courses, close) {
                        this.courses = courses;
                        this.title="Дисциплины";
                        this.newCourse;
                        this.close = function () {
                            close(null, 500);
                        };
                        this.addNewCourses = function () {
                            if(this.newCourse){
                                this.courses.push(VarsService.createEntityWithId({name:this.newCourse}));
                                this.newCourse = undefined;
                            }
                        };
                        this.removeCourse = function (index) {
                            this.courses.splice(index, 1);
                        };
                        this.updateCourses = function () {
                            close(this.courses, 500);
                        }
                    }],
                    controllerAs: "vm",
                    inputs: {
                        courses: angular.copy(this.disciplines)
                    }
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (newCourses) {
                        if (newCourses) {
                            self.disciplines = vars.disciplines = newCourses;
                            VarsService.saveVars(vars);
                        }
                    });
                });
            }

        }
    ],
    controllerAs: "vm"
});