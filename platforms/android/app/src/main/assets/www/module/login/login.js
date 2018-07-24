app.controller('login', function ($cordovaFile, $cordovaOauth, data, $scope, $http, $location, $cookieStore, $rootScope, model, loading, $cordovaDialogs, $cordovaGeolocation) {


    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        $rootScope.deviceplatform = device.platform;

    }


    // model.ConfirmBox('Confirmation Box', 'Are You Sure Want To Delete ?');

    var check = '';
    $scope.UserdataManagement = function () {

        storage = $cookieStore.get('userinfo');
        // alert(storage);
    }

    document.addEventListener('deviceready', function () {

        $cordovaFile.checkFile(cordova.file.externalDataDirectory + 'nomedia', 'temp_0.txt')
            .then(function (success) {
                // success
                // alert(JSON.stringify(success));
                value = success;
                return value;

            }, function (error) {
                // error
                // alert(JSON.stringify(error));
                value = error;
                return value;

            });



    }, false);

    $scope.userlogin = function () {

        loading.active();
        if ($cookieStore.get('userdata')) {
            loading.active();
            var userdeails = $cookieStore.get('userdata');
            var args = $.param({
                'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                email: userdeails.email,
                first_name: userdeails.fname,
                last_name: userdeails.lname,
                account: 'google', //userdeails.account,
                type: '3', //userdeails.type,
                city_id: userdeails.city_id,
                country_id: userdeails.country_id,
                interest: $scope.interest.interest_id
            });

            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'webservices/social_login',
                data: args //forms user object

            }).then(function (response) {
                loading.deactive();
                var res = response;


                if (res.data.responseCode == '200') {
                    $('.getcity').hide();
                    $cookieStore.put('userinfo', res.data.data.result);
                    var a = data.EncryptData($cookieStore.get('userinfo'));

                    $scope.UserdataManagement();
                    $rootScope.createDir();
                    // $rootScope.createFile();
                    setTimeout(function () {

                        loading.active();
                        $rootScope.createFile();
                        // alert('create file');
                    }, 800);
                    // alert(check);
                    setTimeout(function () {

                        loading.active();
                        $rootScope.createFile();
                        $rootScope.WriteFile(a);
                        // alert('create file');
                    }, 1000);

                    setTimeout(function () {
                        //loading.deactive();
                        $rootScope.createFile();
                        $rootScope.WriteFile(a);
                        $location.path('/after_login');
                    }, 1500);

                } else {


                    //Throw error if not logged in
                    //  alert(res.data.responseMessage);
                    $('.getcity').hide();
                   // model.show('Alert', res.data.responseMessage);

                }


            });


        }

    };



   
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
                // alert(res.data.responseMessage)
                model.show('Alert', res.data.data.error_msg);

            }


        });



    }
    $scope.UserIntrest = function () {
        var args = $.param({
            'csrf_test_name': $cookieStore.get('csrf_test_name'),
        });

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'auth/get_user_interest',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            if (res.data.responseCode == '200') {
                //put cookie and redirect it    
                $scope.interests = res.data.data;
            } else {
                //Throw error if not logged in
                model.show('Alert', res.data.responseMessage);
            }


        });
    }

    $scope.UserCountyFetch = function () {
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
                //model.show('Alert', res.data.responseMessage);

            }


        });
    }
    $scope.usercheck = function () {
        $scope.UserCountyFetch();
        $scope.UserIntrest();

        loading.active();
        var args = $.param({
            email: $cookieStore.get('userdata').email
        });

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'auth/social_usercheck',
            data: args //forms user object

        }).then(function (response) {
            //  alert(response);
            loading.deactive();
            res = response;
            console.log(res.data);
            if (res.data.responseCode == '200') {
                //put cookie and redirect it   

                $cookieStore.put('userinfo', res.data.data.userdata);
                var a = data.EncryptData($cookieStore.get('userinfo'));

                $scope.UserdataManagement();
                $rootScope.createDir();
                // $rootScope.createFile();
                setTimeout(function () {

                    loading.active();
                    $rootScope.createFile();
                    // alert('create file');
                }, 800);
                // alert(check);
                setTimeout(function () {

                    loading.active();
                    $rootScope.createFile();
                    $rootScope.WriteFile(a);
                    // alert('create file');
                }, 1000);

                setTimeout(function () {
                    //loading.deactive();
                    $rootScope.createFile();
                    $rootScope.WriteFile(a);
                    $location.path('/after_login');
                }, 1500);

            } else {

                // alert(res.data.responseMessage);
                $('.getcity').show();
                //                $scope.userlogin();

            }


        });
    }





    $scope.icon_close = function () {
        $('.getcity').hide();
        model.show('Alert', 'Process Cancel');
    }

    //    $scope.interest = [];// array as a model
    $scope.social_login = function (form) {

        var res = '';
        //if fields are invalid
        if ($scope[form].$error) {
            var error_str = '';
            if ($scope[form].country_id.$error.required !== undefined) {
                error_str += "Country, ";
            }
            if ($scope[form].city_id.$error.required !== undefined) {
                error_str += "City, ";
            }

            if ($scope.interest == undefined) {

                error_str += "Select Any One Interest ";

            } else {
                if ($scope.interest.interest_id != '') {
                    var count = 0;
                    angular.forEach($scope.interest.interest_id, function (value, key) {
                        if (value != '') {
                            count++;
                        }
                    });
                    if (count < 1) {
                        error_str += "Select Any One Interest ";
                    }
                }
            }
        }
        if (error_str !== '') {
            error_str = " Following fields are required, " + error_str;
            $('#errormsg').text(error_str)
            //  model.show('Alert',error_str);

            return false;//model.show('Alert', error_str);
        }


        if ($scope[form].$valid) {
            var res = $cookieStore.get('userdata');

            var userdata = {
                email: res.email,
                fname: res.fname,
                lname: res.lname,
                account: res.account,
                type: res.type,
                country_id: $scope.country_id,
                city_id: $scope.city_id,

            };


            loading.active();
            $cookieStore.put('userdata', userdata);
            $scope.userlogin();



        }

    };


    $scope.social = function (login_type) {
        // 1 for twitter, 2 for facebook, 3 for google

        if (login_type == '1') {
            return false;
            var igClientId = "064031278a1e4328948573029b71ccfb";
            $cordovaOauth.instagram(igClientId, ["scope=basic"]).then(function (result) {
                $scope.details = result;
            }, function (error) {
                alert(error);
            });


        } else if (login_type == '2') {

            //            return false;
            $cordovaOauth.facebook("1476996802389168", ["email"]).then(function (result) {
                // results
                //                $scope.details = result;
                var access_token = result.access_token
                $http.get("https://graph.facebook.com/v2.5/me",
                    {
                        params: {
                            access_token: access_token,
                            fields: "name,gender,location,picture,email",
                            format: "json"
                        }
                    }).then(function (res) {
                        //                        alert(JSON.stringify(res.data.name));
                        if (res.data.name) {
                            var names = res.data.name.split(' ');
                            var userdata = {
                                email: res.data.email,
                                fname: names[0],
                                lname: names[1],
                                account: 'facebook',
                                type: '2'

                            };

                            $cookieStore.put('userdata', userdata);
                            $scope.usercheck();

                        }
                    }, function (error) {
                        alert("Error: " + JSON.stringify(error));
                    });
            }, function (error) {
                // error
                alert("Error: " + JSON.stringify(error));
            });
        } else if (login_type == '3') {

            $cordovaOauth.google("327247051357-ts76vo3kvcc6olmtko0t3qpsu3upd6uq.apps.googleusercontent.com", ["email", "profile"])

                .then(function (result) {

                    $scope.showProfile = false;

                    $http.get("https://www.googleapis.com/plus/v1/people/me", {

                        params: {

                            access_token: result.access_token
                        }
                    }).then(function (response) {

                        $scope.showProfile = true;

                        var res = response.data;

                        if (res.emails.length > 0) {
                            var userdata = {
                                email: res.emails[0].value,
                                fname: res.name.givenName,
                                lname: res.name.familyName,
                                account: 'google',
                                type: '3'
                            };

                            $cookieStore.put('userdata', userdata);
                            $scope.usercheck();

                        }

                    }, function (error) {
                        model.show('Alert', error);
                    });

                }, function (error) {
                    // error
                    model.show('Alert', error);
                });
        }
    };

    if ($cookieStore.get('userinfo')) {
        $scope.UserdataManagement();
        $location.path('/after_login');
    }
    //alert();
    $cookieStore.put('is_splash_set', true);
    var remember_me = '';
    //check if remember cookie is stored or not 
    if ($cookieStore.get('remember_me')) {

        if ($cookieStore.get('remember_me').checkbox == false) {
            $cookieStore.remove('remember_me');
        } else {
            remember_me = $cookieStore.get('remember_me');
            $scope.email_id = remember_me.email_id;
            $scope.password = remember_me.password;
            $scope.rememberme = remember_me.checkbox;

        }
    }





    $scope.login = function (form) {
        // console.log($scope[form].email_id.$error.email)
        var res = '';
        //if fields are invalid
        if ($scope[form].$error) {
            var error_str = '';
            if ($scope[form].email_id.$error.required !== undefined || $scope[form].email_id.$error.email) {
                error_str += "Email Id, ";
            }
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
            loading.active();
            //store cookie if check box for remember me is checked and codition goes true only otherwise none
            if ($scope.rememberme === true) {
                remember_me = {
                    email_id: $scope.email_id,
                    password: $scope.password,
                    checkbox: true
                };

            } else {
                remember_me = {
                    checkbox: false
                };
            }
            $cookieStore.put('remember_me', remember_me);


            $http({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'GET',
                url: app_url + 'auth/csrf',
                data: '' //forms user object

            }).then(function (response) {
                $cookieStore.put('csrf_test_name', response.data.data.csrf_token);
                var args = $.param({
                    'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                    'email': $scope.email_id,
                    'password': $scope.password
                });

                $http({
                    headers: {
                        //'token': '40d3dfd36e217abcade403b73789d732',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    url: app_url + 'auth/login',
                    data: args //forms user object

                }).then(function (response) {

                    res = response;

                    if (res.data.responseCode == '200') {
                        //put cookie and redirect it    
                        $cookieStore.put('userinfo', res.data.data.result);

                        var a = data.EncryptData($cookieStore.get('userinfo'));

                        $scope.UserdataManagement();
                        $rootScope.createDir();
                        // $rootScope.createFile();
                        setTimeout(function () {

                            loading.active();
                            $rootScope.createFile();
                            // alert('create file');
                        }, 800);
                        // alert(check);
                        setTimeout(function () {

                            loading.active();
                            $rootScope.createFile();
                            $rootScope.WriteFile(a);
                            // alert('create file');
                        }, 1000);

                        setTimeout(function () {
                            //loading.deactive();
                            $rootScope.createFile();
                            $rootScope.WriteFile(a);
                            $location.path('/after_login');
                        }, 1500);


                    } else {
                        loading.deactive();
                        //Throw error if not logged in
                        //  alert(res.data.responseMessage);
                        model.show('Alert', res.data.responseMessage);

                    }


                });
            });



        }

    };

    $scope.reg = function () {
        $location.path('/register_step1');
    }
    $scope.forgot = function () {

        $location.path('/forgot');
    }



});