const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    XLSX = require('XLSX'),
    Blob = require('Blob'),
    app = express(),
    extend = require('util')._extend,
    fs = require('fs-extra');
// by default dev port
var port = process.env.PORT || 8000;

// expose paths
app.use("/", express.static(__dirname + '/app'));
app.use("/node_modules", express.static(__dirname + '/node_modules'));

app.use('/vars.js', function (request, response) {
    response.setHeader('content-type', 'text/javascript');
    var originalVars = fs.readJsonSync('app/vars.json');
    var string = 'vars = ' + JSON.stringify(originalVars) + ';';
    
    response.send(string);
    response.end();
});

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.post("/saveVars", function (req, res) {
    fs.writeJson('app/vars.json', req.body.vars, function(error, data){
        if(error){
            response.writeHead(500,{"Content-type":"text/plain"});
            response.end("Vars update fail!");
        }else{
            res.writeHead(201, { "Content-Type": "text/html" });
            res.end("Vars updated successfully!");

        }
    });
});

app.post("/printTables", function (req, res) {
    var data = req.body.data;
    var ws_name = "Лист1";
    
    function datenum(v, date1904) {
        if(date1904) v+=1462;
        var epoch = Date.parse(v);
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    }

    function sheet_from_array_of_arrays(data, opts) {
        var ws = {};

        function prepareHeader() {

            var newWs = {};

            var cell = {
                v: 'Дмитрук Наталия Михайловна,  доц. канд.физ-мат. н., доц.',
                t: 's'
            };
            newWs['C1'] = cell;
            cell = {
                v: 'Осенний семестр 2016-17 уч. г.',
                t: 's'
            };
            newWs['A2'] = cell;

            var headerText = ['№ п/п', 'Название дисциплины', 'Курс', 'Кол-во студ.', 'Кол-во групп', 'Лекции', 'Практ. и семин. занятия', 'Лаборат. занятия', 'КСР',
                'Тек. консультации', 'ТКЗ', 'Проверка контр. работ', 'Гр. консульт. перед экз.', 'Зачеты', 'Экзамены', 'Преддипл. практика', 'Курсовое проектир.',
                'Рук-во диплом. проект.', 'Рецензир. дипл. работ', 'Занятия с аспирантами', 'ГЭК', 'Рук-во каф.', 'Всего часов'];

            for(var i = 0; i < 23; i++) {

                cell = {
                    v: headerText[i],
                    t: 's'
                };
                newWs[XLSX.utils.encode_cell({c: i,r: 2})] = cell;
            }

            return newWs;
        }

        function addDisciplines(ws, startRow, disciplines) {
            var newWs = extend({}, ws);

            for (var i = 0; i < disciplines.length; i++) {


                cell = {
                    v: i + 1,
                    t: 'n'
                };
                newWs[XLSX.utils.encode_cell({c: 0,r: startRow + i})] = cell;

                var propertyIndex = 0;

                for (var property in disciplines[i]) {
                    var cell = {
                        v: disciplines[i][property]
                    };
                    if(cell.v == null) {
                        propertyIndex++
                        continue;
                    }
                    if(typeof cell.v === 'number') {
                        cell.t = 'n';
                    } else {
                        cell.t = 's';
                    }
                    var cell_ref = XLSX.utils.encode_cell({c: propertyIndex + 1, r: startRow + i});
                    newWs[cell_ref] = cell;
                    propertyIndex++;
                }
            }

            return newWs;
        }

        function addFooter(ws, startRow, dataBegRow, dataQuantity) {
            var newWs = extend({}, ws);

            function calcSumm(column){
                var summ = 0;
                for (var i = 0; i < dataQuantity; i++) {
                    var cell = newWs[XLSX.utils.encode_cell({c: column,r: dataBegRow + i})];
                    if (cell) {
                        summ = summ + cell.v;
                    }
                }
                return summ;
            }

            var cell = {
                v: 'Итого за семестр',
                t: 's'
            };
            newWs[XLSX.utils.encode_cell({c: 1,r: startRow})] = cell;

            for(var i = 5; i < 23; i++) {

                cell = {
                    v: calcSumm(i),
                    t: 'n'
                };
                newWs[XLSX.utils.encode_cell({c: i,r: startRow})] = cell;
            }

            return newWs;
        }

        ws = prepareHeader();

        var disciplines = [
            {
                'name': 'Рук-во кафедрой',
                'course': null,
                'numberOfStudents': null,
                'numberOfGroups': null,
                'lection': null,
                'practice': null,
                'labs': null,
                'csr': null,
                'consult': null,
                'tcz': null,
                'control_works': null,
                'consult_before_exam': null,
                'zachet': null,
                'exam': null,
                'preddip_practice': null,
                'course_proectir': null,
                'rucdipproect': null,
                'rezenzirdiprab': null,
                'zansasp': null,
                'gek': null,
                'kafruk': 30,
                'all': 30
            },
            {
                'name': 'С/к, с/л (ПМ) (Синтез динамич. с-м)',
                'course': 4,
                'numberOfStudents': 9,
                'numberOfGroups': 1,
                'lection': 34,
                'practice': null,
                'labs': 30,
                'csr': 4,
                'consult': 3,
                'tcz': 4,
                'control_works': 4,
                'consult_before_exam': 2,
                'zachet': 4,
                'exam': 6,
                'preddip_practice': null,
                'course_proectir': null,
                'rucdipproect': null,
                'rezenzirdiprab': null,
                'zansasp': null,
                'gek': null,
                'kafruk': null,
                'all': 91
            },
            {
                'name': 'С/к (ПМ) (Кач. т. ОУ)',
                'course': 3,
                'numberOfStudents': 8,
                'numberOfGroups': 1,
                'lection': 34,
                'practice': null,
                'labs': null,
                'csr': null,
                'consult': 2,
                'tcz': 4,
                'control_works': null,
                'consult_before_exam': 2,
                'zachet': null,
                'exam': 5,
                'preddip_practice': null,
                'course_proectir': null,
                'rucdipproect': null,
                'rezenzirdiprab': null,
                'zansasp': null,
                'gek': null,
                'kafruk': null,
                'all': 47
            },
            {
                'name': 'Курс. проект (ПМ)',
                'course': 4,
                'numberOfStudents': 2,
                'numberOfGroups': null,
                'lection': null,
                'practice': null,
                'labs': null,
                'csr': null,
                'consult': null,
                'tcz': null,
                'control_works': null,
                'consult_before_exam': null,
                'zachet': null,
                'exam': null,
                'preddip_practice': null,
                'course_proectir': 9,
                'rucdipproect': null,
                'rezenzirdiprab': null,
                'zansasp': null,
                'gek': null,
                'kafruk': null,
                'all': 9
            },
            {
                'name': 'Курс. проект (ЭК)',
                'course': 4,
                'numberOfStudents': 3,
                'numberOfGroups': null,
                'lection': null,
                'practice': null,
                'labs': null,
                'csr': null,
                'consult': null,
                'tcz': null,
                'control_works': null,
                'consult_before_exam': null,
                'zachet': null,
                'exam': null,
                'preddip_practice': null,
                'course_proectir': 14,
                'rucdipproect': null,
                'rezenzirdiprab': null,
                'zansasp': null,
                'gek': null,
                'kafruk': null,
                'all': 14
            },
            {
                'name': 'Курс. проект (ПМ) (орг.)',
                'course': 3,
                'numberOfStudents': 8,
                'numberOfGroups': null,
                'lection': null,
                'practice': null,
                'labs': null,
                'csr': null,
                'consult': null,
                'tcz': null,
                'control_works': null,
                'consult_before_exam': null,
                'zachet': null,
                'exam': null,
                'preddip_practice': null,
                'course_proectir': 8,
                'rucdipproect': null,
                'rezenzirdiprab': null,
                'zansasp': null,
                'gek': null,
                'kafruk': null,
                'all': 8
            },
            {
                'name': 'Курс. проект (ЭК)',
                'course': 3,
                'numberOfStudents': 3,
                'numberOfGroups': null,
                'lection': null,
                'practice': null,
                'labs': null,
                'csr': null,
                'consult': null,
                'tcz': null,
                'control_works': null,
                'consult_before_exam': null,
                'zachet': null,
                'exam': null,
                'preddip_practice': null,
                'course_proectir': 11,
                'rucdipproect': null,
                'rezenzirdiprab': null,
                'zansasp': null,
                'gek': null,
                'kafruk': null,
                'all': 11
            },
            {
                'name': 'с/л (ПМ) (Кач. теор. ОУ)',
                'course': 3,
                'numberOfStudents': 8,
                'numberOfGroups': 1,
                'lection': null,
                'practice': null,
                'labs': 30,
                'csr': 4,
                'consult': null,
                'tcz': null,
                'control_works': 8,
                'consult_before_exam': null,
                'zachet': null,
                'exam': null,
                'preddip_practice': null,
                'course_proectir': null,
                'rucdipproect': null,
                'rezenzirdiprab': null,
                'zansasp': null,
                'gek': null,
                'kafruk': null,
                'all': 42
            },
            {
                'name': 'с/с (ЭК) (Оптим. дин. фирмы)',
                'course': 5,
                'numberOfStudents': 8,
                'numberOfGroups': 1,
                'lection': null,
                'practice': 16,
                'labs': null,
                'csr': 2,
                'consult': null,
                'tcz': null,
                'control_works': 8,
                'consult_before_exam': null,
                'zachet': 4,
                'exam': null,
                'preddip_practice': null,
                'course_proectir': null,
                'rucdipproect': null,
                'rezenzirdiprab': null,
                'zansasp': null,
                'gek': null,
                'kafruk': null,
                'all': 30
            },
            {
                'name': 'Курс. проект (ПМ)',
                'course': 3,
                'numberOfStudents': 2,
                'numberOfGroups': null,
                'lection': null,
                'practice': null,
                'labs': null,
                'csr': null,
                'consult': null,
                'tcz': null,
                'control_works': null,
                'consult_before_exam': null,
                'zachet': null,
                'exam': null,
                'preddip_practice': null,
                'course_proectir': 7,
                'rucdipproect': null,
                'rezenzirdiprab': null,
                'zansasp': null,
                'gek': null,
                'kafruk': null,
                'all': 7
            }
        ];

        ws = addDisciplines(ws, 3, disciplines);
        ws = addFooter(ws, 2 + disciplines.length + 1, 3, disciplines.length);

        var range = {s: {c:0, r:0}, e: {c:22, r:2 + disciplines.length + 1}};

        if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);

        return ws;
    }
    
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


    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        blob:  {
            contentAsString: wbout,
            type: "application/octet-stream"
        },
        name: "Дмитрук_16_17.xlsx"
    }));
});

// Running server
app.listen(port, () => {
    console.log(`Application server starts at ${port} !`);
});

// Last thinks before exit
process.on('exit', () => {
    console.log('Application server ends !');
});
