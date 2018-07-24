app.controller('splash', function ($scope, $http, $location, $interval, $cookieStore, $rootScope, loading) {

    // loading.active();
    // READ

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        $rootScope.deviceplatform = device.platform;
    } 
    
    loading.active();
    if ($cookieStore.get('is_splash_set')) {

        document.addEventListener('deviceready', function () {
            setTimeout(function () {

                loading.active();
                $cookieStore.put('userinfo', $rootScope.decodedString($rootScope.ReadFile()));

            }, 90);

            setTimeout(function () {
                // alert($cookieStore.get('userinfo'))
                loading.deactive();
                $location.path('/login');
            }, 110);
        }, false);
    }
    //After 2 sec goes to login page
    $scope.splash = function () {
        document.addEventListener('deviceready', function () {
            setTimeout(function () {
                loading.active();
                $cookieStore.put('userinfo', $rootScope.decodedString($rootScope.ReadFile()));

            }, 900);

            setTimeout(function () {
           //     alert($cookieStore.get('userinfo'))
                loading.deactive();
                $location.path('/login');
            }, 1100);
        }, false);

    }

});