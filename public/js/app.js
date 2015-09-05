(function() {

    var app = angular.module('app', [])


    app.controller('MainCtrl', ['$scope', 'data', function($scope, data) {

    	// load data

    }]);

    app.factory('data', ['$http', function($http) {

        return {

            getJson: function() {

                return $http.get('data.json')
                    .then(
                        function(response) {
                            return response.data;
                        },
                        function(httpError) {
                            throw httpError.status + " : " + httpError.data;
                        });

            }

        }

    }]);

})();
