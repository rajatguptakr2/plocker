app.controller('movie_detail', function ($scope, $http, $location, $rootScope, $cookieStore, $cordovaFile, $cordovaFileTransfer, $timeout, loading, model) {


    $cookieStore.remove('video_details');
    $cookieStore.remove('video_detailss');
    $cookieStore.remove('video_details');
    $cookieStore.remove('video_url');

    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }

    if ($cookieStore.get('ck_typeof')) {
        $scope.type = $cookieStore.get('ck_typeof');
    }


    $scope.status = false;

    if ($cookieStore.get('detail')) {
        if ($cookieStore.get('detail').type == 'movie' || $cookieStore.get('detail').type == 'movies') {
            var res = "";
            loading.active();
            //store cookie if check box for remember me is checked and codition goes true only otherwise none


            var args = $.param({
                'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                'movie_id': $cookieStore.get('detail').id,
            });
            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'webservices/movies_details',
                data: args //forms user object

            }).then(function (response) {
                loading.deactive();
                res = response;
                console.log(res.data.data);
                if (res.data.responseCode == '200') {
                    //put cookie and redirect it    
                    $scope.movie_data = res.data.data;

                } else {

                    //Throw error if not logged in
                    // model.show('Alert', res.data.responseMessage);
                }


            });

            var args = $.param({
                csrf_test_name: '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                contentid: $cookieStore.get('detail').id,
                type: $cookieStore.get('detail').type,
                user_id: $cookieStore.get('userinfo').id,
            });
            $http({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'webservices/statusDownload',
                data: args //forms user object

            }).then(function (response) {
                loading.deactive();
                res = response;
                console.log(res.data.data);
                if (res.data.responseCode == '200') {
                    //put cookie and redirect it
                    $scope.status = true;


                } else {
                    $scope.status = false;
                    //Throw error if not logged in
                    // model.show('//alert', res.data.responseMessage);
                }


            });
        } else {


        }
    }


    ////alert($cookieStore.get('detail').id);

    $scope.active = false;
    if ($rootScope.progresss) {

        angular.forEach($rootScope.progresss, function (key, value) {
            if (key[1] == $cookieStore.get('detail').id) {
                $scope.a = key[3];
            }
        });
    }

    var args = $.param({

        movie_id: $cookieStore.get('detail').id,
    });
    $http({
        headers: {
            //'token': '40d3dfd36e217abcade403b73789d732',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        url: app_url + 'webservices/movies_details',
        data: args //forms user object

    }).then(function (response) {
        loading.deactive();
        res = response;
        console.log(res.data.data);
        if (res.data.responseCode == '200') {
            //put cookie and redirect it    
            $rootScope.movie_data = res.data.data;

        } else {

            //Throw error if not logged in
            model.show('Alert', res.data.responseMessage);
        }


    });


    $scope.downloadinvoices = function (contentid, type, img, name) {
        loading.active();

        $rootScope.downloadinvoice($rootScope.reck, contentid, type, img, name);
        $scope.a = $rootScope.reck;

        $scope.active = true;
        $rootScope.reck++;


    }

    $scope.home = function () {
        //$location.path('/home');
        window.history.back();
    }
    $scope.play_video = function (mov_id, type, movie_type, movie_url) {
        //console.log(mov_id+""+type+""+movie_type);
        type = 'movies'
        if (mov_id) {
            var user_id = $cookieStore.get('userinfo').id;
            //=========insert viewed movie in history start===============//
            if (movie_type == 1) //if full movie video is clicked
            {
                var args = $.param({
                    'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                    'user_id': user_id,
                    'viewed_id': mov_id,
                    'viewed_type': type,
                });
                $http({
                    headers: {
                        //'token': '40d3dfd36e217abcade403b73789d732',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    method: 'POST',
                    url: app_url + 'webservices/recently_viewed',
                    data: args //forms user object

                }).then(function (response) {
                    loading.deactive();
                    res = response;

                    if (res.data.responseCode == '200') {
                        //put cookie and redirect it    
                        console.log(res.data.data);

                    } else {

                        //Throw error if not logged in
                        // model.show('alert', res.data.responseMessage);
                    }


                });
            }

            //=========insert viewed movie in history close===============//
            //=============get advertisement video and id if user has free subscription==============//        
            var args = $.param({
                'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                'user_id': user_id,
                'country_id': $cookieStore.get('country').country_id
            });
            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'webservices/get_subscription_status',
                data: args //forms user object

            }).then(function (response) {
                loading.deactive();
                res = response;

                if (res.data.responseCode == '200') {

                    //put cookie and redirect it    
                    $scope.adv_video = '';
                    $scope.advertisement_id = '';
                    $scope.subs_type = res.data.data.result.subs_id;
                    if ($scope.subs_type == '2') //if user is subscribed as free user
                    {
                        if (res.data.data.result.result) {
                            $scope.adv_video = res.data.data.result.result.video;
                            $scope.advertisement_id = res.data.data.result.result.advertisement_id;
                        }
                    }


                    var movie_detail = {
                        id: mov_id,
                        type: type,
                        adv_video: '',//$scope.adv_video,
                        adv_id: $scope.advertisement_id,
                        movie_type: movie_type, //movie_type =1 =>full movie video and 2 => traler video,
                        movie_url: movie_url
                    }
                    $cookieStore.put('detail', movie_detail); //overwrite cookie value

                    $location.path('/playvideo');

                } else {

                    //Throw error if not logged in
                    // model.show('Alert', res.data.responseMessage);
                }


            });
            //=============get advertisement video and id if user has free subscription==============// 


        }

    }


    $scope.play_trailer = function (mov_id, type, movie_type, trailer_video, banner_image) {
        // alert(trailer_video)
        type = 'movies'
        if (mov_id) {
            var user_id = $cookieStore.get('userinfo').id;


            var args = $.param({
                'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                'user_id': user_id,
                'country_id': $cookieStore.get('country').country_id
            });
            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'webservices/get_subscription_status',
                data: args //forms user object

            }).then(function (response) {
                loading.deactive();
                res = response;

                if (res.data.responseCode == '200') {

                    //put cookie and redirect it    
                    $scope.adv_video = '';
                    $scope.advertisement_id = '';
                    $scope.subs_type = res.data.data.result.subs_id;
                    if ($scope.subs_type == '2') //if user is subscribed as free user
                    {
                        if (res.data.data.result.result) {
                            $scope.adv_video = res.data.data.result.result.video;
                            $scope.advertisement_id = res.data.data.result.result.advertisement_id;
                        }
                    }

                    var movie_detail = {
                        id: mov_id,
                        type: type,
                        trailer_video: trailer_video,
                        banner_image: banner_image
                    }
                    console.log(movie_detail)
                    $cookieStore.put('trailer_video', movie_detail); //overwrite cookie value
                    $cookieStore.remove('video_details');
                    $cookieStore.remove('video_detailss');
                    $cookieStore.remove('video_details');
                    $cookieStore.remove('video_url');


                    $location.path('/playtrailer');

                } else {

                    //Throw error if not logged in
                    // model.show('Alert', res.data.responseMessage);
                }


            });
            //=============get advertisement video and id if user has free subscription==============// 


        }

    }

});