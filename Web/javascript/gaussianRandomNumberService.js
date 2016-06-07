app.factory('gaussianRandomNumberService', [function () {
    var normalDistributionRandomVariance = 0.013892;//based on over 10000000 runs of normalDistributionRandom() function
    function normalDistributionRandom() {
        return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
    }
    var random = function (mean, variance) {
        return mean + normalDistributionRandom() * Math.sqrt(variance/normalDistributionRandomVariance);
    };
    var nonNegativeRandom = function (mean, variance) {
        var val = random(mean, variance);
        return val < 0 ? 0 : val;
    }
    return {
        random: random,
        nonNegativeRandom: nonNegativeRandom
    }
}]);