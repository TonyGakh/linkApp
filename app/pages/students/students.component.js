'use strict';

var lessons = angular.module('students', []);

lessons.
component('students', {
    templateUrl: 'pages/students/tpl/students.html',
    controller: [ 'ModalService', 'VarsService', '$scope',
        function diplomsController(ModalService, VarsService, $scope) {
            var self = this;
            this.courses = vars.courses;

            this.activeCourse = this.courses[0] ? 0 : undefined;

            this.newGroup = {name: undefined, all: undefined, mou: undefined};
            this.hours=[
                { name:'ткз', value: 1 },
                { name:'контрольные работы', value: 1 },
                { name:'зачет', value: 1 },
                { name:'экзамен', value: 1 },
                { name:'консультация', value: 1 },
                { name:'тек. консультации', value: 1 }
            ];

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


            this.addCourse = function(){
                ModalService.showModal({
                    templateUrl: "components/tpl/add.course.tpl.html",
                    controller: ["courses", "close", function RatesModifyingController(courses, close) {
                        this.courses = courses;
                        this.title="Курсы";
                        this.newCourse;
                        this.close = function () {
                            close(null, 500);
                        };
                        this.addNewCourses = function () {
                            if(this.newCourse){
                                this.courses.push(VarsService.createEntityWithId({name:this.newCourse, groups:[]}));
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