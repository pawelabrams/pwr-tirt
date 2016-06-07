app.controller('ReportViewerController', [
    '$scope', 'reportViewerService', '$location', '$window', function ($scope, reportViewerService, $location, $window) {
        var restyling = false;
        $scope.ces = reportViewerService;
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
            reportViewerService.getClustering(function (data) {
                reportViewerService.getAbnormalClusterVectors(function (abnormalClusters) {
                    console.log(abnormalClusters);
                    $scope.data = reportViewerService.processsClustersForGraph(data, abnormalClusters.res);

                    var layout = {
                        margin: {
                            l: 0,
                            r: 0,
                            b: 0,
                            t: 0
                        }
                    };
                    Plotly.newPlot('graph-container', $scope.data.data, layout);

                });
            });
        };
        $scope.loadClustering();
        $scope.setValidClusters = function () {
            if ($scope.fineClustersIndexes.length > 0) {
                clusterEvaluatorService.saveValidClusters($scope.fineClustersIndexes).then(function (data) { $window.location.href = '/Web/'; });

            }
        };
        $scope.loadReport=function(){
            reportViewerService.getReport(function(data){
                $scope.report=data.res;
            })
        };
        $scope.loadReport();
        


    }]);