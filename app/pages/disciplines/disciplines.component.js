'use strict';

var disciplines = angular.module('disciplines', []);

disciplines.
component('disciplines', {
    templateUrl: 'pages/disciplines/tpl/disciplines.html',
    controller: [ 'ModalService', 'VarsService', '$scope',
        function diplomsController(ModalService, VarsService, $scope, $window) {
            var self = this;
            this.disciplines = vars.disciplines ;
            this.courses = vars.courses;


            this.activeDiscipline = this.disciplines && this.disciplines[0] ? 0 : undefined;

            this.newDiscipline = {name: undefined, subs:[]};
            this.newSub = {};

            this.addSub = function(){
                if (!this.newSub.name){
                    alert('Введите им');
                    return
                }
                this.disciplines[this.activeDiscipline].subs.push(VarsService.createEntityWithId({
                    name: this.newSub.name,
                    lectures: this.newSub.lectures || 0,
                    practices: this.newSub.practices || 0,
                    csr: this.newSub.csr || 0,
                    credit: this.newSub.credit || false,
                    exam: this.newSub.exam || false,
                    lecturesList: {},
                    classes: {}
                }));
                for (var key in this.newSub) {
                    this.newSub[key] = undefined;
                }
                save();
            };

            this.removeSub = function (index) {
                this.disciplines[this.activeDiscipline].subs.splice(index,1);
                save();
            };


            this.addDiscipline = function(){
                if(!this.courses.length>0){
                    alert('Необходим хотябы 1 курс(вкладка студенты)');
                    return;
                }
                ModalService.showModal({
                    templateUrl: "components/tpl/add.course.tpl.html",
                    controller: ["courses", "courseId", "close", function RatesModifyingController(courses, courseId, close) {
                        this.courses = courses;
                        this.title="Дисциплины";
                        this.newCourse;
                        this.close = function () {
                            close(null, 500);
                        };
                        this.addNewCourses = function () {
                            if(this.newCourse){
                                this.courses.push(VarsService.createEntityWithId({
                                    name:this.newCourse,
                                    type: 'common',
                                    subs: [],
                                    curs: courseId
                                }));
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
                        courses: angular.copy(this.disciplines),
                        courseId: this.courses[0].id
                    }
                }).then(function (modal) {
                    modal.element.modal();
                    modal.close.then(function (newCourses) {
                        if (newCourses) {
                            self.disciplines = vars.disciplines = newCourses;
                            self.activeDiscipline = 0;
                            save();
                        }
                    });
                });
            };

            this.save = save;

            function save(){
                VarsService.saveVars(vars);
            }

            this.cancel = function(){
                window.location.reload(false);
            }

        }
    ],
    controllerAs: "vm"
});