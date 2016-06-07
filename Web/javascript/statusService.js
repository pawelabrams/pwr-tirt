app.factory('statusService', ['$http', function ($http) {
    return {
        getStatus: function (scope) {
            $http({
                method: 'GET',
                url: 'http://localhost:5000/panel/getStatus'
            }).then(function successCallback(response) {
                return scope.status = response.data.status;
            });
        },
        setStatus: function (status) {
            $http({
                method: 'POST',
                url: 'http://localhost:5000/panel/setStatus', 
                data: { 'status': status }
            }).then(function successCallback(response) {
            });
        }
    };
}])