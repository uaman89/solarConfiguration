var ConfigurationModel = function(){

    var configurationId = angular.element(document.querySelector("[ng-app=solConfigApp]")).scope().configurations.length;

    this.params = new ConfigurationParamsModel( configurationId );
    this.painter = new ConfigurationDrawModel( this.params );

    this.update = function(){
        this.params.calculateData();
        this.painter.drawModel();
    };

};
