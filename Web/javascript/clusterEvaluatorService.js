app.factory('clusterEvaluatorService', ['$http', function ($http) {


    var getClustering = function (callback) {
        var req = {
            method: 'GET',
            url: '/data-processor/getClustering'
        };
        $http(req).then(function (data) {
            callback(data.data);
        });
    };
    var processsClustersForGraph = function (data) {
        DATA = data;
        console.log(data);
        var clustersNumber = maxtime = Math.max.apply(Math, data.clusters) + 1;
        console.log(clustersNumber);
        var clusters = [];
        for (var i = 0; i < clustersNumber; i++) {
            clusters.push({
                x: [],
                y: [],
                z: [],
                mode: 'markers',
                marker: {
                    size: 12,
                    opacity: 0.8
                },
                type: 'scatter3d',
                name: 'cluster-' + i
            });
        }
        console.log(clusters);
        for (var i = 0; i < data.clusters.length; i++) {
            var clusterIndex = data.clusters[i];
            var point = data.data[i];
            clusters[clusterIndex].x.push(point[0]);
            clusters[clusterIndex].y.push(point[1]);
            clusters[clusterIndex].z.push(point[2]);
        }

        return { data: clusters }
    };
    var saveValidClusters = function (indexes) {
        return $http({
            method: 'POST',
            url: '/data-processor/setValidClusters',
            data: indexes
        });
    };
    return {
        getClustering: getClustering,
        processsClustersForGraph: processsClustersForGraph,
        saveValidClusters: saveValidClusters
    }
}]);




