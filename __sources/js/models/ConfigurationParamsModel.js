var ConfigurationParamsModel = function( configurationId ) {

    //var id = ( angular.element(document.querySelector("[ng-app=solConfigApp]")).scope().configurations ) ?
    //    ( angular.element(document.querySelector("[ng-app=solConfigApp]")).scope().configurations + 1 ) : 0;

    this.configurationId = configurationId;
    this.designType = "2";
    this.rows = "3";
    this.moduleOrientation = "vertical";
    this.modulesCount = 10;
    this.totalModulesCount = this.rows * this.modulesCount;
    this.moduleHeight = 1642;    //mm
    this.moduleWidth  = 994;     //mm
    this.moduleDepth  = 40;      //mm
    this.tableAngle   = 30;      //grad
    this.distanceToGround = 500; //mm
    this.B = null; //ширина стола, проекция на горизонтальную поверхность
    this.H = 0;    //высота стола, проекция на вертикальную поверхность
    this.L = null; //длина стола
    this.r = 12; //расстояние между модулями
    this.supports = {
        width   : 0,  // ширина балки
        count   : 0,  // количество опор
        interval: 0   // расстояние между опорами
    };

    //helpers
    this.tableHeight = null;
    this.tableWidth = null;
    this._supportWidth = 60; //mm
    var _this = this;
//--- end init vars -----------------------------------------------------------------------------------------


    this.calculateData = function () {
        console.log('calculateData()');

        // "rotate" module
        if (_this.moduleOrientation == 'horizontal'){
            var temp = _this.moduleHeight;
            _this.moduleHeight = _this.moduleWidth;
            _this.moduleWidth = temp;
        }

        _this.tableHeight = _this.moduleHeight * _this.rows + (_this.rows - 1) * _this.r;
        _this.tableWidth = _this.moduleWidth * _this.modulesCount + ( _this.modulesCount - 1 ) * _this.r;
        console.log('_this.tableHeight',_this.tableHeight);
        console.log('_this.tableWidth',_this.tableWidth);

        var angle = _this.tableAngle * Math.PI / 180;

        console.log('_this.tableHeight',_this.tableHeight);
        console.log('Math.cos( angle )',Math.cos( angle ));
        console.log('Math.abs( Math.cos( angle ) )',Math.abs( Math.cos( angle ) ));
        _this.B =  _this.tableHeight * Math.abs( Math.cos( angle ) );  
        console.log('_this.B',_this.B);
        _this.H = _this.tableHeight * Math.abs( Math.sin( angle ) ) + _this.distanceToGround;
        _this.L = _this.tableWidth; //cause 'tableWidth' much easier to understand than 'L'
        _this.supports = _getSupportsParams();
    };

//--- end calculateData() -----------------------------------------------------------------------------------------


    function _getSupportsParams(){
        console.log('_getSupportsCount()');

        var supports = {
            width: _this._supportWidth,
            count: null, //количество опор
            interval: null  //расстояние между опорами
        };
        
        var minInterval, maxInterval; 
        
        switch( _this.moduleOrientation ){

            case 'horizontal':
                // min 3m ~ max 3.5m
                minInterval = 3000; //mm
                maxInterval = 3500; //mm
                break;

            default: //'vertical'
                // min 2.5m ~ max 3m
                minInterval = 2500;  //mm
                maxInterval = 3000;  //mm
                break;
        }

        console.log('_this.tableWidth',_this.tableWidth);
        console.log('maxInterval', maxInterval);
        console.log('minInterval', minInterval);


        var width = _this.tableWidth - _this._supportWidth;

        //проверяем max:
        if ( _this.tableWidth % maxInterval == 0 ){
            supports.count = _this.tableWidth / maxInterval;
            supports.interval = maxInterval;
        }
        //или min+ инервал меджу опорами
        else{
            supports.count = Math.floor( _this.tableWidth / minInterval );
            supports.interval = (_this.tableWidth - _this._supportWidth) / supports.count;
        }

        supports.count++; //+1 at the end

        //берем то тот интервал которого меньше остаток от деления, т.е. который ближе подходит по условию

       /* var diffMax = ( _this.tableWidth - _this._supportWidth ) % maxInterval;
        var diffMin = ( _this.tableWidth - _this._supportWidth ) % minInterval;
        var interval = ( diffMax < diffMin ) ? maxInterval : minInterval;

        supports.count = Math.floor( width / interval );
        supports.interval = width / supports.count;
*/

        console.log('supports',supports);
        return supports;
    }

//--- end calculateData() -----------------------------------------------------------------------------------------


};