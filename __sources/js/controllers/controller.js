solConfigApp.controller('MainCtrl', function ($scope) {

    $scope.message = "under construction!";

    $scope.configurations = [

        new ConfigurationParamsModel(),
        new ConfigurationParamsModel(),

    ];

    $scope.configurationParamSet = {

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
});
//hello