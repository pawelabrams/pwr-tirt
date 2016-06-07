app.factory('reportViewerService', ['$http', function ($http) {


    var getClustering = function (callback) {
        var req = {
            method: 'GET',
            url: '/data-processor/getClustering'
        };
        $http(req).then(function (data) {
            callback(data.data);
        });
    };

    var processAbnormalRequestsCLuster = function (abnormalRequests) {
        var cluster = {
            x: [],
            y: [],
            z: [],
            mode: 'markers',
            marker: {
                size: 12,
                opacity: 0.8,
                color: 'rgba(0,0,0,1)'
            },
            type: 'scatter3d',
            name: 'abnormal requests'
        };
        abnormalRequests.forEach(function (point) {

            cluster.x.push(point[0]);
            cluster.y.push(point[1]);
            cluster.z.push(point[2]);
        })
        return cluster;
    };
    var processsClustersForGraph = function (data, abnormalRequests) {
        var clustersNumber = Math.max.apply(Math, data.clusters) + 1;
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
        for (var i = 0; i < data.clusters.length; i++) {
            var clusterIndex = data.clusters[i];
            var point = data.data[i];
            clusters[clusterIndex].x.push(point[0]);
            clusters[clusterIndex].y.push(point[1]);
            clusters[clusterIndex].z.push(point[2]);
        }
        clusters.push(processAbnormalRequestsCLuster(abnormalRequests));

        return { data: clusters }
    };
    var saveValidClusters = function (indexes) {
        return $http({
            method: 'POST',
            url: '/data-processor/setValidClusters',
            data: indexes
        });
    };
    var getAbnormalClusterVectors = function (callback) {
        var req = {
            method: 'GET',
            url: '/reporting/getGraphData'
        };
        $http(req).then(function (data) {
            callback(data.data);
        });
    };
    var getReport = function (callback) {
        var req = {
            method: 'GET',
            url: '/reporting/getReport'
        };
        $http(req).then(function (data) {
            callback(data.data);
        });
    };
    return {
        getClustering: getClustering,
        processsClustersForGraph: processsClustersForGraph,
        saveValidClusters: saveValidClusters,
        getAbnormalClusterVectors: getAbnormalClusterVectors,
        getReport:getReport
    }
}]);




