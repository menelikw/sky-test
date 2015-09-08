(function(app) {

    'use strict';

    app.factory('DataFcty', ['$http', function($http) {

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

        };

    }]);

}(window.NOWTV));
