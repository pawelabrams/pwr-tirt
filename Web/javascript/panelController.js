app.controller('PanelController', [
    '$scope', '$http', 'statusService', function ($scope, $http, statusService) {
        $scope.clustersNumber = 3;
        $scope.proximityIndex = 2;
        function updateStatus() {
            $scope.status = statusService.getStatus($scope);
        };
        updateStatus();
        $scope.startCollectingData = function () {
            statusService.setStatus('collecting_data')
            updateStatus();
        };

        $scope.stopCollectingData = function () {
            statusService.setStatus('data_collected')
            updateStatus();
        };

        $scope.startClustering = function () {
            $http({
                method: 'POST',
                url: '/clustering/startClustering',
                data: { 'clustersNumber': $scope.clustersNumber }
            }).then(function (data) {
                updateStatus();
                checkForStatusChange();

            });
        };
        $scope.clustersNumberDisabled = function () {
            return $scope.status != 'data_collected';
        };
        $scope.startClusteringDisabled = function () {
            return $scope.status !== 'data_collected' || !$scope.clustersNumber || $scope.clustersNumber < 1;
        };

        $scope.isDataClustered = function () {
            return $scope.status === 'data_clustered';
        };
        $scope.selectOutliersDetection = function () {
            statusService.setStatus('outliers_started');
            updateStatus();
        };
        $scope.setOutliersDetectionConfig = function () {

            $http({
                method: 'POST',
                url: '/data-processor/setOutliersDetection',
                data: { proximityIndex: $scope.proximityIndex }
            }).then(function (data) {
                updateStatus();
                checkForStatusChange();

            });
        };
        $scope.setOutliersDetectionConfigDisabled = function () {
            return $scope.status !== 'outliers_started' || $scope.proximityIndex < 1;
        };
        $scope.selectAssignmentBasedDetection = function () {
            statusService.setStatus('assignment_started')
            updateStatus();
        };
        $scope.isAssignmentStarted = function () {
            return $scope.status == 'assignment_started';
        };
        $scope.canStartMonitoring = function () {
            return $scope.status == 'assignment_ready' || $scope.status == 'outliers_ready';
        };
        $scope.startMonitoring = function () {
            if ($scope.canStartMonitoring()) {
                if ($scope.status == 'assignment_ready') {
                    statusService.setStatus('assignment_monitoring');
                }
                else {
                    statusService.setStatus('outliers_monitoring');
                }
                updateStatus();
            }
        };
        $scope.monitoringStarted = function () {
            return $scope.status=='assignment_monitoring'||'outliers_monitoring';
        };
        $scope.monitoringStarted = function () {
            return $scope.status=='assignment_monitoring'||'outliers_monitoring';
        };
        var checkForStatusChange = function () {
            updateStatus();
            if ($scope.status != 'data_clustered') {
                setTimeout(checkForStatusChange, 5000);
            }
        };
    }]);