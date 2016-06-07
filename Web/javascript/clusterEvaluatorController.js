app.controller('ClusterEvaluatorController', [
    '$scope', 'clusterEvaluatorService', '$location', '$window', function ($scope, clusterEvaluatorService, $location, $window) {
        var restyling = false;
        $scope.ces = clusterEvaluatorService;
        $scope.fineClusters = [];
        $scope.fineClustersIndexes = [];
        var toggleCluster = function (clusterName, clusterIndex) {
            var index = $scope.fineClusters.indexOf(clusterName);
            if (index > -1) {
                $scope.fineClusters.splice(index, 1);
                $scope.fineClustersIndexes.splice(index, 1);
            }
            else {
                $scope.fineClusters.push(clusterName);
                $scope.fineClustersIndexes.push(clusterIndex);
            }
            $scope.$apply();
        };
        $scope.loadClustering = function () {
            clusterEvaluatorService.getClustering(function (data) {
                $scope.data = clusterEvaluatorService.processsClustersForGraph(data);

                var layout = {
                    margin: {
                        l: 0,
                        r: 0,
                        b: 0,
                        t: 0
                    }
                };
                Plotly.newPlot('graph-container', $scope.data.data, layout);
                document.getElementById('graph-container').on('plotly_click', function (data) {
                    toggleCluster(data.points[0].data.name, data.points[0].fullData.index);
                    // if (!restyling) {
                    //     restyling = true;
                    //     if ($scope.fineClustersIndexes.indexOf(data.points[0].fullData.index) > -1) {

                    //         Plotly.restyle('graph-container', {
                    //             'marker.line.color': 'rgba(0,217, 0, 1)'
                    //             // 'marker.line.width': 7
                    //         }, data.points[0].fullData.index);

                    //     }
                    //     restyling = false;
                    // }
                })
            });
        };
        $scope.loadClustering();
        $scope.setValidClusters = function () {
            if ($scope.fineClustersIndexes.length > 0) {
                clusterEvaluatorService.saveValidClusters($scope.fineClustersIndexes).then(function (data) { $window.location.href = '/Web/'; });

            }
        };


    }]);