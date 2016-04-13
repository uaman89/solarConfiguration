var ConfigurationParamsModel = function( configurationId ){

    //var id = ( angular.element(document.querySelector("[ng-app=solConfigApp]")).scope().configurations ) ?
    //    ( angular.element(document.querySelector("[ng-app=solConfigApp]")).scope().configurations + 1 ) : 0;

    this.configurationId = configurationId;
    this.designType = "2";
    this.rows = "3";
    this.moduleOrientation = "1";
    this.modulesCount = Math.ceil( Math.random()*10 );
    this.totalModulesCount = this.rows * this.modulesCount;
    this.moduleHeight = 1642;
    this.moduleWidth = 994;
    this.moduleDepth =  40;
    this.tableAngle = 30;

};