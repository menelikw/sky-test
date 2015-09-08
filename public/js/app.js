(function(doc) {

    'use strict';

    var appName = 'NowTvApp';

    //Do stuff when the document is ready
    var onDeviceReady = function() {
        //'Bootstrap' our Angular app to document
        angular.bootstrap(doc, [appName]);
    };

    //Manage our app's core dependency injections
    window.NOWTV = angular.module(appName, []);

    //Initialise the app when the document is ready
    doc.addEventListener('DOMContentLoaded', onDeviceReady, false);

}(document));