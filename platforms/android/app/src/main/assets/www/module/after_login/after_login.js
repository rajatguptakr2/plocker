app.controller('after_login', function ($cordovaOauth, $scope, $http, $location, $cookieStore, model, loading, $cordovaDialogs, $cordovaGeolocation) {


    //return false;
    loading.deactive();
    $cookieStore.remove('register_step1');
    var geocoder;
    $scope.location = '';

    var country = {
        country_id: $cookieStore.get('userinfo').country_id,
        name: ''
    };
    $cookieStore.put('country', country);


    $scope.getcountry = function () {
        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var geocoder = new google.maps.Geocoder();
            latlng = new google.maps.LatLng(lat, lng),
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    var splits = (results[1].formatted_address).split(",");
                    var splits_length = (results[1].formatted_address).split(",").length;
                    var final_data = splits_length - 1;
                    if (final_data) {
                        $cookieStore.put('country_name', splits[final_data]);
                    } else {
                        $cookieStore.put('country_name', 'India');
                    }

                });
        }, function (err) {
            // error
        });
    };
    if ($cookieStore.get('country_name')) {
        loading.active();
        var args = $.param({
            'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
            'country_name': $cookieStore.get('country_name'),
        });
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/countryidByname',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            $cookieStore.remove('country_name');
            if (res.data.responseCode == '200') {

                //put cookie and redirect it 
                $cookieStore.put('country', res.data.data);
            } else {
                //Throw error if not logged in
                var country = {
                    country_id: $cookieStore.get('userinfo').country_id,
                    name: ''
                };
                $cookieStore.put('country', country);
                model.show('Alert', 'We are not providing service in your location, Your register country will be consider as default location.');
            }

        });
    } else {
        $scope.getcountry();
    }


    $scope.geolocation = function () {
        var permissions = cordova.plugins.permissions;
        permissions.hasPermission(permissions.ACCESS_COARSE_LOCATION, function (status) {
            if (status.hasPermission) {
            } else {
                permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, success, error);

                function error() {
                    // alert('Location permission is not turned on');
                    $scope.geolocation();
                }

                function success(status) {
                    //alert(status)
                    if (!status.hasPermission) {
                        $scope.geolocation();
                    } else {
                        $scope.getcountry();
                    }
                }
            }
        });
    }

    if (!$cookieStore.get('country')) {
        cordova.plugins.diagnostic.isLocationAuthorized(function (authorized) {

            if (authorized) {
                //  alert(authorized);
                //user have no access
                cordova.plugins.diagnostic.isLocationAvailable(function (available) {

                    if (available) {
                        $scope.getcountry();
                    } else {
                        $cordovaDialogs.confirm('Please Enable GPS Location...', 'Alert', ['Ok', 'Cancel'])
                            .then(function (buttonIndex) {
                                // no button = 0, 'OK' = 1, 'Cancel' = 2
                                if (buttonIndex == '1') {
                                    cordova.plugins.diagnostic.switchToLocationSettings();
                                    $location.path('/splash');
                                } else {
                                    $location.path('/splash');
                                }

                            });
                    }
                });
            } else {
                //  alert(authorized);
                $scope.geolocation();

            }

        });
    }

    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }

    var args = $.param({
        'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
        'country_id': $cookieStore.get('country').country_id,
        type: 'movies'

    });

    $http({
        headers: {
            //'token': '40d3dfd36e217abcade403b73789d732',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        url: app_url + 'webservices/movie_slider',
        data: args //forms user object

    }).then(function (response) {

        loading.deactive();
        res = response;
        console.log(res.data.data);
        if (res.data.responseCode == '200') {
            //put cookie and redirect it 

            //$scope.slider_listing = res.data.data;
            $cookieStore.put('slider_movies', res.data.data);

        } else {

            //Throw error if not logged in
            model.show('Alert', res.data.responseMessage);

        }

        //            $location.path('/home');

    });


    var args = $.param({
        'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
        'country_id': $cookieStore.get('country').country_id,
        type: 'series'

    });

    $http({
        headers: {
            //'token': '40d3dfd36e217abcade403b73789d732',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        url: app_url + 'webservices/movie_slider',
        data: args //forms user object

    }).then(function (response) {

        loading.deactive();
        res = response;
        console.log(res.data.data);
        if (res.data.responseCode == '200') {
            //put cookie and redirect it 

            //$scope.slider_listing = res.data.data;
            $cookieStore.put('slider_series', res.data.data);

        } else {

            //Throw error if not logged in
            model.show('Alert', res.data.responseMessage);

        }

        //            $location.path('/home');

    });
    console.log($cookieStore.get('slider_movies'));
    console.log($cookieStore.get('slider_series'));


    $scope.home = function (type) {
       
        if (type == "1") {
            //movie

            $cookieStore.put('ck_typeof', 'movies');
            // $location.path('/home');
        } else {
            //series
            $cookieStore.put('ck_typeof', 'series');
            //$location.path('/home');
        }
        $location.path('/home');
    }



    $scope.series = function () {

        $location.path('/forgot');
    }



});