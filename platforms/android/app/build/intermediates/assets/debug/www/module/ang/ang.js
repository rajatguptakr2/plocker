

// pass token to controller function.
app.controller('validateCtrl', function ($scope, $http, CSRF_TOKEN) {
    $scope.submitForm = function (isValid) {
        // check all goes fine?
        //alert(isValid);
        if (!isValid) {
            var data = {'username': $scope.username, 'email': $scope.email, 'phone': $scope.phone, 'csrf_valid': CSRF_TOKEN};
            $http({
                method: 'POST',
                url: app_url + 'auth/login',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: $.param(data)
            }).
                    success(function (data, status, headers, config) {
                        //alert(data);
                    });
        }
    };
});
