app.controller('cms', function ($scope, $http, $location, $cookieStore, $timeout, loading, model) {

    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }

    if ($cookieStore.get('ck_typeof')) {
        $scope.type = $cookieStore.get('ck_typeof');
    }
    $scope.get_cms_data=function(){
        console.log($cookieStore.get('cms_detail').id);
        if ($cookieStore.get('cms_detail').id) {
            var res = "";
            loading.active();
            //store cookie if check box for remember me is checked and codition goes true only otherwise none
            var args = $.param({
                'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                'cms_id': $cookieStore.get('cms_detail').id,
            });
            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'webservices/get_cms_content',
                data: args //forms user object

            }).then(function (response) {
                loading.deactive();
                res = response;
              
                if (res.data.responseCode == '200') {
                    $scope.cms_data = res.data.data.content;
                      console.log($scope.cms_data);
                    //put cookie and redirect it    
                  //  $scope.movie_data = res.data.data;

                } else {

                    //Throw error if not logged in
                    model.show('Alert', res.data.responseMessage);
                }


            });
           }
    }
    
    $scope.go_back=function(){
        window.history.back()
    }
    
    
    

});