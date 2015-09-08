(function(app) {

    'use strict';    

    app.controller('MainCtrl', ['$scope', '$filter', 'DataFcty', function($scope, $filter, DataFcty) {

        var orderBy = $filter('orderBy'),
            limitTo = $filter('limitTo'),
            filter = $filter('filter'),
            movieListings = [];

        /**
         * Provide filter with case sensitive match function
         * @param  {String} haystack   The data to be searched
         * @param  {String} needle The search string
         * @return {Boolean}       The match result
         */
        function matchCase(haystack, needle) {
            return ('' + haystack).indexOf(needle) > -1;
        };

        /**
         * Filter results on a given search value
         * @param  {String} val the search string to find
         */
        function filterResults(search) {
            //If the search string meets our requirements filter on it, otherwise clear the filter
            search = search.length > 2 ? search : '';
            $scope.movieListings = filter(movieListings, {title: search}, matchCase);
        };

        //request and bind data to view
        DataFcty.getJson().then(function(data) {
            //Apply filters to the array
            movieListings = orderBy(data.movies, 'title');
            movieListings = limitTo(movieListings, 20);
            
            $scope.movieListings = movieListings;
            $scope.total = data.movies.length;
        });

        //Expose the validity of our search string to control the prompt display
        $scope.showSearchPrompt = false;

        //reapply the filter as the search value changes
        $scope.$watch('search', function (newVal, oldVal) {
            if(newVal !== oldVal) {
                var searchLength = newVal.length;
                filterResults(newVal);
                $scope.showSearchPrompt = searchLength > 0 && searchLength < 3;
                $scope.showResultCount = searchLength > 2 && !!$scope.movieListings.length;
            }
        });

    }]);

}(window.NOWTV));