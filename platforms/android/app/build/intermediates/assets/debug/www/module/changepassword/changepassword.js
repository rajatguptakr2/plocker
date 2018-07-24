app.controller('changepassword', function ($scope, $http, $location, $cookieStore, model, loading, $cordovaDialogs, $cordovaGeolocation) {

    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }


       $scope.passwordchange = function (form) {
        var res = '';
        //if fields are invalid
        if ($scope[form].$error) {
            var error_str = '';

            if ($scope[form].password.$error.required !== undefined) {
                error_str += "Current Password, ";
            }
            if ($scope[form].newpassword.$error.required !== undefined) {
                error_str += "New Password, ";
            }
            if ($scope[form].confirmpassword.$error.required !== undefined) {
                error_str += "Confirm Password ";
            }


            if (error_str !== '') {
                error_str = " Following fields must have valid information " + error_str;
                model.show('Alert', error_str);
            }
        }

        if ($scope[form].$valid) {
            var reg = /^[^%\s]{6,}$/;
            var reg2 = /[a-zA-Z]/;
            var reg3 = /[0-9]/;
            if (reg.test($scope.newpassword) == false) {
                error_str = " Password should contain at least one character & one Number and length should be 6 minimum! ";
                model.show('Alert', error_str);
                return false;
            }
            if (reg2.test($scope.confirmpassword) == false) {
                error_str = " Password should contain at least one character & one Number and length should be 6 minimum! ";
                model.show('Alert', error_str);
                return false;
            }
            if (reg3.test($scope.newpassword) == false) {
                error_str = " Password should contain at least one character & one Number and length should be 6 minimum! ";
                model.show('Alert', error_str);
                return false;
            }
        }

        if ($scope[form].$valid) {
            if ($scope.confirmpassword != $scope.newpassword) {
                error_str += "New Password and confirm password does not match.";
            }

            if (error_str !== '') {
                //error_str = " ollowing fields must have valid information " + error_str;
                model.show('Alert', error_str);
                return false;
            }


            loading.active();
            //store cookie if check box for remember me is checked and codition goes true only otherwise none
            var args = $.param({
                'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                'password': $scope.password,
                'new_password': $scope.newpassword,
                'confirm_password': $scope.confirmpassword,
                'user_id': $cookieStore.get('userinfo').id
            });

            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'auth/change_password',
                data: args //forms user object

            }).then(function (response) {

                res = response;

                if (res.data.responseCode == '200') {
                    //put cookie and redirect it    

                    $cookieStore.remove('userinfo');
                    model.show('Alert', res.data.responseMessage);
                    $location.path('/home');

                } else {

                    //Throw error if not logged in
                    model.show('Alert', res.data.responseMessage);

                }


            }).finally(function () {
                loading.deactive();
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