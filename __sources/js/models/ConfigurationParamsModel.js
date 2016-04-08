/**
 * Created by victor on 08.04.16.
 */
var ConfigurationParamsModel = function(){

    this.rows = 1;
    this.modulesCount = Math.random();
    this.totalModulesCount = this.rows * this.modulesCount;
    this.moduleLength = 1642;
    this.moduleHeight = 994;
    this.moduleWidth =  40;
    this.tableAngle = 30;

    this.installationParamSets = {

        design: [
            { id:1, label: 'одноопорная' },
            { id:2, label: 'двухопорная'},
        ],

        moduleDispositin: [
            { id:1, label: 'вертикально' },
            { id:2, label: 'горизонтально'},
        ],

        systemType: [
            { rows:1, label: 'однорядная' },
            { rows:2, label: 'двухрядная'},
            { rows:3, label: 'трехрядная'},
            { rows:4, label: 'четырехрядная'},
            { rows:5, label: 'пятирядная'},
        ]

    }

};