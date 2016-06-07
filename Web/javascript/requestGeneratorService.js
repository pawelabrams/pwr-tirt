app.factory('requestsGeneratorService', ['$http', 'gaussianRandomNumberService', function ($http, gaussianRandomNumberService) {
    var generateIp = function () {
        return Math.round(Math.random() * 255) + '.' + Math.round(Math.random() * 255) + '.' + Math.round(Math.random() * 255) + '.' + Math.round(Math.random() * 255);
    }
    var generateRequests = function (numberOfRequests, payloadMeanSize, payloadSizeVariance, meanTimeBeetwenCalls, timeBeetwenCallsVariance, processingTimeMean,processingTimeVariance,reportDone) {
        var ipAddress = generateIp();
        generateRequestsRecursive(numberOfRequests, payloadMeanSize, payloadSizeVariance, meanTimeBeetwenCalls, timeBeetwenCallsVariance, processingTimeMean,processingTimeVariance, 0, ipAddress, reportDone);
    };
    var generateRequestsRecursive = function (numberOfRequests, payloadMeanSize, payloadSizeVariance, meanTimeBeetwenCalls, timeBeetwenCallsVariance, processingTimeMean,processingTimeVariance, requestsCount, ipAddress, reportDone) {
        if (requestsCount < numberOfRequests) {
            makeCall(Math.round(gaussianRandomNumberService.nonNegativeRandom(payloadMeanSize, payloadSizeVariance)),Math.round(gaussianRandomNumberService.nonNegativeRandom(processingTimeMean,processingTimeVariance)), ipAddress);
            setTimeout(function () { generateRequestsRecursive(numberOfRequests, payloadMeanSize, payloadSizeVariance, meanTimeBeetwenCalls, timeBeetwenCallsVariance, processingTimeMean,processingTimeVariance, requestsCount + 1, ipAddress, reportDone); }, gaussianRandomNumberService.nonNegativeRandom(meanTimeBeetwenCalls, timeBeetwenCallsVariance));
        } else {
            reportDone();
        }
    };
    var makeCall = function (payloadSize, processingTime, ipAddress) {
        var req = {
            method: 'GET',
            url: '/collect/',
            headers: {
                'Content-Type': undefined,
                'Processing-Time': processingTime,
                'Payload-Size': payloadSize,
                'IP-Address': ipAddress
            },
            data: {}
        };
        $http(req);
    };
    return {
        generateRequests: generateRequests, random: gaussianRandomNumberService.nonNegativeRandom
    }
}]);