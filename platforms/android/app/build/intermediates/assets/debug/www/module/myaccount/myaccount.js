app.controller('myaccount', function ($cordovaOauth, $scope, $http, $location, $cookieStore, loading, model, $filter, $route, $rootScope) {

    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }


    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        $rootScope.deviceplatform = device.platform;
    }

    // alert( $rootScope.social_login())

    //used for pop up to get user paid from free
    $scope.closed = function () {

        $('.new').removeClass('show').hide();
    }

    $scope.subscription_type = $cookieStore.get('userinfo').subscription_id;
    console.log($cookieStore.get('userinfo'));
    loading.active();
    var args = $.param({
        'csrf_test_name': $cookieStore.get('csrf_test_name'),
    });

    $http({
        headers: {
            //'token': '40d3dfd36e217abcade403b73789d732',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        url: app_url + 'auth/country',
        data: args //forms user object

    }).then(function (response) {
        loading.deactive();
        res = response;
        if (res.data.responseCode == '200') {
            //put cookie and redirect it    
            $scope.country = res.data.data;

        } else {

            //Throw error if not logged in
            //                alert(res.data.responseMessage);
            model.show('Alert', res.data.responseMessage);

        }


    });
    $scope.getcity = function (countryid) {

        loading.active();
        var args = $.param({
            'csrf_test_name': $cookieStore.get('csrf_test_name'),
            'country_id': countryid
        });

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'auth/citybycountryid',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;

            if (res.data.responseCode == '200') {
                //put cookie and redirect it    
                $scope.city = res.data.data;

            } else {

                //Throw error if not logged in
                //alert(res.data.responseMessage.error_msg);
                $scope.city = '';
                //                 console.log(res.data.responseMessage.error_msg)
                model.show('Alert', res.data.responseMessage.error_msg);

            }


        });



    }
    $scope.nextdate = {};
    $scope.nextmonth = {};
    var myDate = new Date()
    $scope.mydate = new Date(myDate);
    var nextDay = new Date(myDate);
    var j = '';
    var i = '';
    for (var i = 0; i < 12; i++) {
        j = i + 1;
        $scope.nextdate[j] = $filter('date')($scope.mydate.setYear($scope.mydate.getFullYear() + 1), 'yyyy');//$filter('date')($scope.mydate.setYear($scope.mydate.getFullYear() + 1), 'yyyy');
        $scope.nextmonth[j] = j//$filter('date')($scope.mydate.setMonth($scope.mydate.getMonth() + 1), 'MM');//$filter('date')($scope.mydate.setYear($scope.mydate.getFullYear() + 1), 'yyyy');
    }


    loading.active();
    $scope.interests = [];
    $scope.inte = {};

    $scope.userdata = function () {
        var args = $.param({
            'csrf_test_name': $cookieStore.get('csrf_test_name'),
            'user_id': $cookieStore.get('userinfo').id
        });

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'auth/update_data',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            console.log(res.data.data);

            if (res.data.responseCode == '200') {
                //put cookie and redirect it 
                console.log($cookieStore.get('userinfo'));
                $scope.userdata = $cookieStore.get('userinfo');
                $scope.inte = res.data.data.user_interest;
                $scope.user_interest = res.data.data.user_interest;
                $scope.interest_list = res.data.data.interest_list;
                $scope.userdata = res.data.data.userdata;
                $scope.fname = $scope.userdata.first_name;
                $scope.lname = $scope.userdata.last_name;
                $scope.email_id = $scope.userdata.email;
                $scope.unit = $scope.userdata.apt_unit;
                $scope.gender = $scope.userdata.gender;
                $scope.address = $scope.userdata.address;
                $scope.country_id = $scope.userdata.country_id;
                $scope.getcity(res.data.data.userdata.country_id)
                $scope.card_number = res.data.data.userdata.card_number;
                $scope.expiry_month = res.data.data.userdata.expiry_month;
                $scope.expiry_year = res.data.data.userdata.expiry_year;
                $scope.cvv_number = res.data.data.userdata.cvv_number;

                var args = $.param({
                    'csrf_test_name': $cookieStore.get('csrf_test_name'),
                    'country_id': $scope.country_id
                });

                $http({
                    headers: {
                        //'token': '40d3dfd36e217abcade403b73789d732',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    url: app_url + 'auth/citybycountryid',
                    data: args //forms user object

                }).then(function (response) {
                    loading.deactive();
                    res = response;

                    if (res.data.responseCode == '200') {
                        //put cookie and redirect it    
                        $scope.city = res.data.data;

                    } else {
                        $scope.city = '';
                        model.show('Alert', res.data.responseMessage.error_msg);
                    }
                });
                $scope.city_id = $scope.userdata.city_id;
            } else {

                //Throw error if not logged in
                //alert(res.data.responseMessage.error_msg);
                $scope.city = '';
                model.show('Alert', res.data.responseMessage.error_msg);

            }


        });
    };



    $scope.interest = [];
    $scope.myaccounts = function (form) {

        var res = '';
        var error_str = '';
        if ($scope.subscription_type == '1') {
            //paid user

            if ($scope[form].$error) {

                if ($scope[form].fname.$error.required !== undefined) {
                    error_str += "First Name, ";
                }
                if ($scope[form].lname.$error.required !== undefined) {
                    error_str += "Last Name, ";
                }
                if ($scope[form].address.$error.required !== undefined) {
                    error_str += "Address, ";
                }
                if ($scope[form].unit.$error.required !== undefined) {
                    error_str += "Apt/Unit, ";
                }
                if ($scope[form].gender.$error.required !== undefined) {
                    error_str += "Gender, ";
                }
                if ($scope[form].country_id.$error.required !== undefined) {
                    error_str += "Country, ";
                }
                if ($scope[form].city_id.$error.required !== undefined) {
                    error_str += "City, ";
                }
            }

            if ($scope.expiry_month == '') {

                error_str += "Month, ";

            } else if ($scope.expiry_year == '') {

                error_str += "Year, ";

            } else if ($scope.card_number == '' || $scope[form].card_number.$error.minlength || $scope[form].card_number.$error.maxlength) {

                error_str += "Card Number, ";

            } else if ($scope.cvv_number == '' || $scope[form].cvv_number.$error.minlength) {

                error_str += "CvvNumber, ";

            }
            if (error_str !== '') {
                error_str = " Following fields must have valid information " + error_str;
                model.show('Alert', error_str);
                return false;
            }

        } else {
            //free user

            if ($scope[form].$error) {


                if ($scope[form].fname.$error.required !== undefined) {
                    error_str += "First Name, ";
                }

                if ($scope[form].lname.$error.required !== undefined) {
                    error_str += "Last Name, ";
                }
                if ($scope[form].address.$error.required !== undefined) {
                    error_str += "Address, ";
                }
                if ($scope[form].unit.$error.required !== undefined) {
                    error_str += "Apt/Unit, ";
                }
                if ($scope[form].gender.$error.required !== undefined) {
                    error_str += "Gender, ";
                }
                if ($scope[form].country_id.$error.required !== undefined) {
                    error_str += "Country, ";
                }
                if ($scope[form].city_id.$error.required !== undefined) {
                    error_str += "City, ";
                }
            }
            angular.forEach($scope.inte, function (value, key) {

                if (value.interest_id == '') {

                }
            });

            if (error_str !== '') {
                error_str = " Following fields must have valid information " + error_str;
                model.show('Alert', error_str);
                return false;
            }

        }
        //if fields are invalid


        if ($scope[form].$valid) {

            loading.active();

            if ($scope.subscription_type == '1') {

                var args = $.param({
                    'csrf_test_name': $cookieStore.get('csrf_test_name'),
                    'fname': $scope.fname,
                    'lname': $scope.lname,
                    'address': $scope.address,
                    'unit': $scope.unit,
                    'gender': $scope.gender,
                    'country_id': $scope.country_id,
                    'city_id': $scope.city_id,
                    'card_number': $scope.card_number,
                    'expiry_date': $scope.expiry_month + '/' + $scope.expiry_year,
                    'subscription_type': $scope.subscription_type,
                    'cvv_number': $scope.cvv_number,
                    'user_id': $cookieStore.get('userinfo').id
                });

            } else {

                var args = $.param({
                    'csrf_test_name': $cookieStore.get('csrf_test_name'),
                    'fname': $scope.fname,
                    'lname': $scope.lname,
                    'address': $scope.address,
                    'unit': $scope.unit,
                    'gender': $scope.gender,
                    'country_id': $scope.country_id,
                    'city_id': $scope.city_id,
                    'interest': $scope.inte,
                    'subscription_type': $scope.subscription_type,
                    'user_id': $cookieStore.get('userinfo').id

                });
            }


            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'auth/update_data_profile',
                data: args //forms user object

            }).then(function (response) {
                loading.deactive();
                res = response;

                if (res.data.responseCode == '200') {
                    //put cookie and redirect it  
                    model.show('Alert', 'Profile Updated Successfully');
                    // $location.path('/home');
                    $route.reload();

                } else {

                    //Throw error if not logged in
                    //  alert(res.data.responseMessage);
                    model.show('Alert', res.data.responseMessage);

                }
            });
        }
    }
    $scope.go_to_cms = function (cms_id) {
        var cms_detail = {
            id: cms_id
        }
        $cookieStore.put('cms_detail', cms_detail);  //overwrite cookie value
        $location.path('/cms');
    }

    $scope.paid_to_free = function () {
        var userdata = $cookieStore.get('userinfo');

        loading.active();
        var args = $.param({
            csrf_test_name: $cookieStore.get('csrf_test_name'),
            user_id: $cookieStore.get('userinfo').id,
            subscription_id: $cookieStore.get('userinfo').subscription_id,
        });
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + '/convert_user_status',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            console.log(response.data.data.result);
            if (res.data.responseCode == '200') {

                $cookieStore.put('userinfo', response.data.data.result);
                $location.path('/home');
                model.show('Info', 'Successfully Subscribed');
            } else {

                //Throw error if not logged in
                model.show('Alert', res.data.responseMessage.error_msg);

            }

        });
    }
    $scope.fill_convert = function () {
        if ($cookieStore.get('userinfo').subscription_id == '1') {

            $('.title').html('Alert');
            $('.message').html('You want to Un-Subscribed ?');
            $('.new').removeClass('hide').show();
        } else {
            $location.path('/subscription');
        }


    }

    $scope.confirmation = function () {
        $scope.paid_to_free();

    }

    $scope.convert_user = function () {


        //        user having subscription_id == 1 is paid and 2 for free
        if ($cookieStore.get('userinfo').subscription_id == '1') {
            $location.path('/home');
        }

        $scope.reg_submit = function (form) {
            loading.active();
            var res = '';
            var error_str = '';

            if ($scope[form].$error) {

                if ($scope[form].creditcard.$error.required !== undefined || $scope[form].creditcard.$error.minlength || $scope[form].creditcard.$error.maxlength) {
                    error_str += "Credit Card Number, ";
                }
                if ($scope[form].expiry_month.$error.required !== undefined) {
                    error_str += "Expiration Month, ";
                }
                if ($scope[form].expiry_year.$error.required !== undefined) {
                    error_str += "Expiration Year, ";
                }
                if ($scope[form].cvvcode.$error.required !== undefined || $scope[form].cvvcode.$error.minlength) {
                    error_str += "CSS Code ";
                }
            }



            if (error_str !== '') {
                error_str = " Following fields must have valid information " + error_str;
                model.show('Alert', error_str);
                loading.deactive();
                return false;
            }

            if ($scope[form].$valid) {
                var userdata = $cookieStore.get('userinfo');

                loading.active();
                var args = $.param({
                    csrf_test_name: $cookieStore.get('csrf_test_name'),
                    user_id: $cookieStore.get('userinfo').id,
                    subscription_id: $cookieStore.get('userinfo').subscription_id,
                    card_number: $scope.creditcard,
                    expiry_date: $scope.expiry_month + '/' + $scope.expiry_year,
                    cvv_number: $scope.cvvcode,
                    first_name: userdata.first_name,
                    last_name: userdata.last_name,
                    address: userdata.address,
                    country_id: userdata.country_id,
                    city_id: userdata.city_id,
                });
                $http({
                    headers: {
                        //'token': '40d3dfd36e217abcade403b73789d732',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    url: app_url + '/convert_user_status',
                    data: args //forms user object

                }).then(function (response) {
                    loading.deactive();
                    res = response;
                    console.log(response.data.data.result);
                    if (res.data.responseCode == '200') {

                        $cookieStore.put('userinfo', response.data.data.result);
                        $location.path('/home');
                        model.show('Info', 'Successfully Subscribed');
                    } else {

                        //Throw error if not logged in
                        model.show('Alert', res.data.responseMessage.error_msg);

                    }


                });

            }
        }
    }



});