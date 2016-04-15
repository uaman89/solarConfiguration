var ConfigurationParamsModel = function( configurationId ) {

    //var id = ( angular.element(document.querySelector("[ng-app=solConfigApp]")).scope().configurations ) ?
    //    ( angular.element(document.querySelector("[ng-app=solConfigApp]")).scope().configurations + 1 ) : 0;

    this.configurationId = configurationId;
    this.designType = "2";
    this.rows = "3";
    this.moduleOrientation = "vertical";
    this.modulesCount = Math.ceil(Math.random() * 10);
    this.totalModulesCount = this.rows * this.modulesCount;
    this.moduleHeight = 1642;    //mm
    this.moduleWidth  = 994;     //mm
    this.moduleDepth  = 40;      //mm
    this.tableAngle   = 30;      //grad
    this.distanceToGround = 500; //mm
    this.B = null; //ширина стола, проекция на горизонтальную поверхность
    this.H = 0; //высота стола, проекция на вертикальную поверхность
    this.L = null; //длина стола

    //helpers
    this.tableHeight = null;
    this.tableWidth = null;
    var _this = this;
//--- end init vars -----------------------------------------------------------------------------------------


    this.calculateData = function () {
        console.log('calculateData');
        // "rotate" module
        if (_this.moduleOrientation == 'horizontal'){
            var temp = _this.moduleHeight;
            _this.moduleHeight = _this.moduleWidth;
            _this.moduleWidth = temp;
        }

        _this.tableHeight = _this.moduleHeight * parseInt(_this.rows);
        _this.tableWidth = _this.moduleWidth * parseInt(_this.modulesCount);

        var angle = parseInt(_this.tableAngle);

        _this.B = Math.round( _this.tableHeight * Math.cos( angle ) );
        _this.H = Math.round( Math.abs(_this.tableHeight * Math.sin( angle ) ) ) + _this.distanceToGround;
    }

//--- end calculateData() -----------------------------------------------------------------------------------------


};