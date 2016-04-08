/**
 * Created by victor on 08.04.16.
 */
var ConfigurationParamsModel = function(){

    this.desingType = "2";
    this.rows = "3";
    this.modulesCount = Math.ceil( Math.random()*10 );
    this.totalModulesCount = this.rows * this.modulesCount;
    this.moduleLength = 1642;
    this.moduleHeight = 994;
    this.moduleWidth =  40;
    this.tableAngle = 30;

};