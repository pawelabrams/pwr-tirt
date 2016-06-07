app.controller('RequestGeneratorController', [
    '$scope', 'requestsGeneratorService', function ($scope, requestsGeneratorService) {
        $scope.requestsNumber = 10;
        $scope.payloadMean = 1000;
        $scope.payloadVariance = 500;
        $scope.timeBetweenMean = 1000;
        $scope.timeBetweenVariance = 2000;
        $scope.processingTimeMean = 5000;
        $scope.processingTimeVariance = 5000;
        $scope.startTraffic=function () {
            requestsGeneratorService.generateRequests($scope.requestsNumber, $scope.payloadMean,$scope.payloadVariance,$scope.timeBetweenMean, $scope.timeBetweenVariance, $scope.processingTimeMean, $scope.processingTimeVariance,function(){$scope.done=true;})
        };
    }]);