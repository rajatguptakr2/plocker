app.controller('forgot', function ($scope, $http, $location, $cookieStore, model, loading) {

    if ($cookieStore.get('userinfo')) {
        $location.path('/after_login');
    }

       $scope.forgot = function (form) {
        var res = '';
        //if fields are invalid
        if ($scope[form].$error) {
            var error_str = '';
            if ($scope[form].email_id.$error.required !== undefined || $scope[form].email_id.$error.email) {
                error_str += "Email Id ";
            }

            if (error_str !== '') {
                error_str = " Following fields must have valid information " + error_str;
                model.show('Alert', error_str);
            }
        };
        if ($scope[form].$valid) {
            loading.active();

            var args = $.param({
                'csrf_test_name': api_key, //$cookieStore.get('csrf_test_name'),
                'email': $scope.email_id,
            });

            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'auth/forget_api',
                data: args //forms user object

            }).then(function (response) {

                res = response;

                if (res.data.responseCode == '200') {


                    //put cookie and redirect it    
                    model.show('Alert', res.data.responseMessage);
                    $location.path('/login');

                } else {

                    //Throw error if not logged in
                    model.show('Alert', res.data.responseMessage);

                }


            }).finally(function () {
                setTimeout(function () {
                    loading.deactive();
                }, 3000)

            });




        }

    };

    $scope.login = function () {
        $location.path('/login');
    }

});