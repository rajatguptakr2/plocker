app.controller('register', function ($scope, $http, $location, $cookieStore, model, loading, $filter) {

    if ($cookieStore.get('userinfo')) {
        $location.path('/after_login');
    }

    $scope.step1 = function () {


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
                    // alert(res.data.responseMessage)
                    model.show('Alert', res.data.data.error_msg);

                }


            });



        }

        if ($cookieStore.get('register_step1')) {
            var res = $cookieStore.get('register_step1');
            console.log(res);
            $scope.fname = res.fname;
            $scope.lname = res.lname;
            $scope.email_id = res.email_id;
            $scope.unit = res.unit;
			$scope.gender = res.gender;
            $scope.country_id = res.country_id;
            $scope.address = res.address;
            $scope.getcity(res.country_id);
            $scope.city_id = res.city_id;

        }


        $scope.subs_type = function (form, subs_type) {

            var res = '';
            //if fields are invalid
            if ($scope[form].$error) {
                var error_str = '';
                if ($scope[form].fname.$error.required !== undefined) {
                    error_str += "First Name, ";
                }
                if ($scope[form].lname.$error.required !== undefined) {
                    error_str += "Last Name, ";
                }
                if ($scope[form].email_id.$error.required !== undefined || $scope[form].email_id.$error.email) {
                    error_str += "Email Id, ";
                }
                if ($scope[form].password.$error.required !== undefined) {
                    error_str += "Password, ";
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
                    error_str += "Country Name, ";
                }
            }
            if ($scope[form].city_id.$error.required !== undefined) {
                error_str += "City Name ";
            }

            if (error_str !== '') {
                error_str = " Following fields must have valid information " + error_str;
                model.show('Alert', error_str);
            }



            if ($scope[form].$valid) {
                var reg = /^[^%\s]{6,}$/;
                var reg2 = /[a-zA-Z]/;
                var reg3 = /[0-9]/;
                if (reg.test($scope.password) == false) {
                    error_str = " Password should contain at least one character & one Number and length should be 6 minimum! ";
                    model.show('Alert', error_str);
                    return false;
                }
                if (reg2.test($scope.password) == false) {
                    error_str = " Password should contain at least one character & one Number and length should be 6 minimum! ";
                    model.show('Alert', error_str);
                    return false;
                }
                if (reg3.test($scope.password) == false) {
                    error_str = " Password should contain at least one character & one Number and length should be 6 minimum! ";
                    model.show('Alert', error_str);
                    return false;
                }
                if (subs_type == '1') {//subscription
                    var register = {
                        fname: $scope.fname,
                        lname: $scope.lname,
                        email_id: $scope.email_id,
                        password: $scope.password,
                        address: $scope.address,
                        unit: $scope.unit,
						gender: $scope.gender,
                        country_id: $scope.country_id,
                        city_id: $scope.city_id,
                        subs_type: subs_type
                    };
                    $cookieStore.put('register_step1', register);
                    $location.path('subscription_reg');
                } else {
                    var register = {
                        fname: $scope.fname,
                        lname: $scope.lname,
                        email_id: $scope.email_id,
                        password: $scope.password,
                        address: $scope.address,
                        unit: $scope.unit,
						gender: $scope.gender,
                        country_id: $scope.country_id,
                        city_id: $scope.city_id,
                        subs_type: subs_type
                    };
                    $cookieStore.put('register_step1', register);
                    $location.path('/register_step2');

                }

            }

        };

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
    $scope.step2 = function () {


        if (!$cookieStore.get('register_step1')) {
            $location.path('/register_step1');
        }
        //reg step 2 fetching income level

        $scope.interest = [];// array as a model


        var args = $.param({
            'csrf_test_name': $cookieStore.get('csrf_test_name'),
        });

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'auth/get_income_level',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            console.log()
            if (res.data.responseCode == '200') {
                //put cookie and redirect it    
                $scope.income_levels = res.data.data;

            } else {

                //Throw error if not logged in
                alert(res.data.responseMessage);

            }


        });

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
        console.log($scope.interest)
        //        $scope.interest.interest_id[1] ='1';
        $scope.reg_submit = function (form) {
            loading.active();
            var res = '';
            var error_str = '';

            if (form === 'subscription_reg') {

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

                    if ($scope[form].country_id.$error.required !== undefined) {
                        error_str += "Country Name, ";
                    }
                    if ($scope[form].creditcard.$error.required !== undefined) {
                        error_str += "Credit Card Number, ";
                    }
                    if ($scope[form].expiry_month.$error.required !== undefined) {
                        error_str += "Expiration Month, ";
                    }
                    if ($scope[form].expiry_year.$error.required !== undefined) {
                        error_str += "Expiration Year, ";
                    }
                    if ($scope[form].cvvcode.$error.required !== undefined) {
                        error_str += "CSS Code ";
                    }
                }
                if ($scope[form].city_id.$error.required !== undefined) {
                    error_str += ",City Name ";
                }

                if (error_str !== '') {
                    error_str = " Following fields must have valid information " + error_str;
                    model.show('Alert', error_str);
                    loading.deactive();
                    return false;
                }
            } else {
                //if fields are invalid
                if ($scope[form].$error) {

                    if ($scope[form].age.$error.required !== undefined) {
                        error_str += "Age, ";
                    }
                    if ($scope[form].income_level_id.$error.required !== undefined) {
                        error_str += "Income Level, ";
                    }
                    if ($scope.interest.interest_id == undefined || ($scope.interest.interest_id).length < 5) {

                        error_str += "Select Any One Interest ";

                    }
                }
                if (error_str !== '') {
                    error_str = " Following fields must have valid information " + error_str;
                    model.show('Alert', error_str);
                    loading.deactive();
                    return false;
                }

            }
            if ($scope[form].$valid) {
                loading.active();
                var userdata = $cookieStore.get('register_step1');

                if (userdata.subs_type == '1') {

                    var args = $.param({
                        'csrf_test_name': $cookieStore.get('csrf_test_name'),
                        'first_name': $scope.fname,
                        'last_name': $scope.lname,
                        'email': userdata.email_id,
                        'password': userdata.password,
                        'address': $scope.address,
                        'apt_unit': userdata.unit,
						'gender': userdata.gender,
                        'country_id': $scope.country_id,
                        'city_id': $scope.city_id,
                        'subscription_id': userdata.subs_type,
                        card_number: $scope.creditcard,
                        expiry_date: $scope.expiry_month + '/' + $scope.expiry_year,
                        cvv_number: $scope.cvvcode


                    });
                } else {

                    var args = $.param({
                        'csrf_test_name': $cookieStore.get('csrf_test_name'),
                        'first_name': userdata.fname,
                        'last_name': userdata.lname,
                        'email': userdata.email_id,
                        'password': userdata.password,
                        'address': userdata.address,
                        'apt_unit': userdata.unit,
						'gender': userdata.gender,
                        'country_id': userdata.country_id,
                        'city_id': userdata.city_id,
                        'subscription_id': userdata.subs_type,
                        'age': $scope.age,
                        'income_level': $scope.income_level_id,
                        'interest': $scope.interest.interest_id
                    });
                }


                $http({
                    headers: {
                        //'token': '40d3dfd36e217abcade403b73789d732',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    url: app_url + 'auth/registration',
                    data: args //forms user object

                }).then(function (response) {

                    res = response;
                    console.log(res);

                    if (res.data.responseCode == '200') {
                        //put cookie and redirect it  
                        //                        response.data.data.result
                        $cookieStore.put('userinfo', response.data.data.result);
                        $cookieStore.remove('register_step1');

                        $location.path('/after_login');
                        model.show('Info', 'Registration has been completed successfully');
                    } else {

                        //Throw error if not logged in
                        model.show('Alert', res.data.responseMessage.error_msg);

                    }


                }).finally(function () {
                    loading.deactive();
                });

            }
        }
    }

    $scope.subscription_reg = function () {
        if ($cookieStore.get('register_step1')) {
            var userdata = $cookieStore.get('register_step1');
            $scope.address = userdata.address;
            $scope.fname = userdata.fname;
            $scope.lname = userdata.lname;
            $scope.step1();
            $scope.getcity(userdata.country_id)
            $scope.country_id = userdata.country_id;
            $scope.city_id = userdata.city_id;

        }
    }


});