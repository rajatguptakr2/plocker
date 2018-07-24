app.controller('lock', function ($cordovaOauth, $scope, $http, $location, $cookieStore, model, $rootScope, loading, $cordovaDialogs, $cordovaGeolocation) {

    loading.deactive();
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        $rootScope.deviceplatform = device.platform;

    }



    $scope.login = function (form) {
        // console.log($scope[form].email_id.$error.email)
        var res = '';
        //if fields are invalid
        if ($scope[form].$error) {
            var error_str = '';
            if ($scope[form].password.$error.required !== undefined) {
                error_str += "Password ";
            }

            if (error_str !== '') {
                error_str = " Following fields must have valid information " + error_str;
                model.show('Alert', error_str);
            }
        }
        ;

        if ($scope[form].$valid) {
            //loading.active();
            //store cookie if check box for remember me is checked and codition goes true only otherwise none

            alert()
        }

    };



});