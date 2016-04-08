/**
 * Created by victor on 08.04.16.
 */
var ConfigurationParamsModel = function(){

    //var id = ( angular.element(document.querySelector("[ng-app=solConfigApp]")).scope().configurations ) ?
    //    ( angular.element(document.querySelector("[ng-app=solConfigApp]")).scope().configurations + 1 ) : 0;

    this.id = 'X';
    this.designType = "2";
    this.rows = "3";
    this.moduleOrientation = "1";
    this.modulesCount = Math.ceil( Math.random()*10 );
    this.totalModulesCount = this.rows * this.modulesCount;
    this.moduleLength = 1642;
    this.moduleHeight = 994;
    this.moduleWidth =  40;
    this.tableAngle = 30;

};