app.controller('view', function ($cordovaOauth, $scope, $http, $location, $cookieStore, loading, model, $filter, $route, $rootScope) {

    loading.deactive();
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        $rootScope.deviceplatform = device.platform;
    }




});