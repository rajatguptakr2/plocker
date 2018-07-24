app.controller('view_all', function ($scope, $http, $location, $cookieStore, $timeout, loading, model) {
   
    $("html,body").animate({scrollTop: 0}, 100);
   
    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }

    if ($cookieStore.get('ck_typeof')) {
        $scope.type = $cookieStore.get('ck_typeof');
    }
    $scope.go_back = function () {
        window.history.back();
    }
    $scope.series_list = [];
    $scope.movies_list = [];
    $scope.movie_page = 0;
    $scope.series_page = 0;
    $scope.movie_by_category = function () {
        //alert($cookieStore.get('category_id'));
        $scope.movie_page++;
        $scope.series_page++;
        var res = "";
        loading.active();
        //store cookie if check box for remember me is checked and codition goes true only otherwise none
        var args = $.param({
            'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
            'country_id': $cookieStore.get('country').country_id,
            'category_id': $cookieStore.get('category_id'),
            'user_id': $cookieStore.get('userinfo').id,
            'type': $cookieStore.get('ck_typeof'),
            'page': $scope.movie_page
        });
        console.log(args);
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/get_movies_by_category_country',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            console.log(res.data.data);
            if (res.data.responseCode == '200') {
                //put cookie and redirect it    
                $scope.listing = res.data.data;
                // console.log($scope.listing);
                angular.forEach(res.data.data.movie_list, function (value, key) {
                    $scope.movies_list.push(value);
                });

            } else {

                //Throw error if not logged in
                model.show('Alert', res.data.responseMessage);

            }


        });
        var res = "";
        loading.active();
        //store cookie if check box for remember me is checked and codition goes true only otherwise none
        var args = $.param({
            'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
            'country_id': $cookieStore.get('country').country_id,
            'series_id': $cookieStore.get('category_id'),
            'user_id': $cookieStore.get('userinfo').id,
            'type': $cookieStore.get('ck_typeof'),
            'page': $scope.series_page
        });
        //  console.log(args);
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/get_series_by_seriesId_countryId',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;

            if (res.data.responseCode == '200') {
                //put cookie and redirect it    
                $scope.movies_series = res.data.data;
                // console.log($scope.movies_series);
                //$scope.total_page=$scope.movies_series.total_page;
                // console.log($scope.movies_series.total_page);
                angular.forEach(res.data.data.series_list, function (value, key) {
                    $scope.series_list.push(value);

                });
                //                console.log($scope.movies_series);
            } else {

                //Throw error if not logged in
                model.show('Alert', res.data.responseMessage);

            }


        });

    }
    $scope.movie = function (id, type) {

        var movie_detail = {
            id: id,
            type: type
        }

        $cookieStore.put('detail', movie_detail);
        if (type == 'movies') {
            type = 'movie';
            $location.path('/' + type + '_detail');
        } else {
            $location.path('/' + type + '_detail');
        }


    }
    $scope.play_video = function (series_main_id, series_sub_id, type) {

        if (series_main_id) {
            var series_detail = {
                id: series_sub_id, //id of main series
                series_main_id: series_main_id, //id of indivisual series within a series
                type: type,
                adv_video: '',//$scope.adv_video,
                adv_id: '',//$scope.advertisement_id
            }
            $cookieStore.put('detail', series_detail);  //overwrite cookie value

            // var series_detail = {
            //     id: series_sub_id, //id of main series
            //     series_main_id: series_main_id, //id of indivisual series within a series
            //     type: type,
            //     adv_video: $scope.adv_video,
            //     adv_id: $scope.advertisement_id
            // }

            // $cookieStore.put('detail', series_detail);

            //=========insert viewed movie in history start===============//
            var user_id = $cookieStore.get('userinfo').id;
            var args = $.param({
                'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                'user_id': user_id,
                'viewed_id': series_sub_id,
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
                    //                    console.log(res.data.data);

                } else {

                    //Throw error if not logged in
                    model.show('Alert', res.data.responseMessage);
                }


            });
            //=========insert viewed movie in history close===============//

            $location.path('/series_detail');
        }

    }
    $scope.series_scroll = function (total_page) {
        $scope.tot_series_page = total_page;
    }
    $scope.movies_scroll = function (total_page) {
        $scope.tot_movie_page = total_page;
    }

    // $(window).scroll(function () {
    //     if ($scope.series_page <= $scope.tot_series_page) {
    //         if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    //             $scope.movie_by_category();
    //         }
    //     }
    //     if ($scope.movie_page <= $scope.tot_movie_page) {
    //         if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    //             $scope.movie_by_category();
    //         }
    //     }
    // });


});