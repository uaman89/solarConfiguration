solConfigApp.directive('configurationInstance', function(){
    return{
        restrict: 'E',
        scope: {
            configuration: '='
        },
        templateUrl: 'templates/configuration.html'
    };
});