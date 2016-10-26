'use strict';

var lessons = angular.module('lessons', []);

lessons.
component('lessons', {
    templateUrl: 'pages/lessons/tpl/lessons.html',
    controller: [ 'ModalService', 'VarsService', '$scope',
        function diplomsController(ModalService, VarsService, $scope) {
            var self = this;
            this.courses = vars.courses;
            this.activeCourse = this.courses[0] ? 0 : undefined;

            this.addCourse = function(){
                ModalService.showModal({
                    templateUrl: "components/tpl/add.course.tpl.html",
                    controller: ["courses", "close", function RatesModifyingController(courses, close) {
                        this.courses = courses;
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
                        courses: angular.copy(this.courses)
                    }
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (newCourses) {
                        if (newCourses) {
                            self.courses = vars.courses = newCourses;
                            VarsService.saveVars(vars);
                        }
                    });
                });
            }

        }
    ],
    controllerAs: "vm"
});