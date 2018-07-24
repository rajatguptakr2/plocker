app.controller('home', function ($scope, $http, $location, $cookieStore, $timeout, data, loading, model, $cordovaFile, $rootScope) {

    //alert(storage);
    $cookieStore.put('ck_search_keyword', '');
    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }

    if ($cookieStore.get('ck_typeof')) {
        $scope.type = $cookieStore.get('ck_typeof');
    }


    //====================================
    // Slick 3
    //====================================
    // $scope.slider_listing = [{image: 'http://projects.tekshapers.in/watchit/assets/movie_image/40bc35db1cb86df8649e801989c5866d_thumb.jpg'}, {image: 'http://projects.tekshapers.in/watchit/assets/movie_image/40bc35db1cb86df8649e801989c5866d_thumb.jpg'}, {image: 'http://projects.tekshapers.in/watchit/assets/movie_image/40bc35db1cb86df8649e801989c5866d_thumb.jpg'}, {image: 'http://projects.tekshapers.in/watchit/assets/movie_image/40bc35db1cb86df8649e801989c5866d_thumb.jpg'}];

    var args = $.param({
        user_id: $cookieStore.get('userinfo').id,
        type: $scope.type

    });
    $http({
        headers: {
            //'token': '40d3dfd36e217abcade403b73789d732',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        url: app_url + 'webservices/download_list',
        data: args //forms user object

    }).then(function (response) {
        loading.deactive();
        res = response;

        if (res.data.responseCode == '200') {

            $rootScope.download_list = res.data.data.movie_list;
            $cookieStore.put('download_list', res.data.data.movie_list);

        }

    });



    $scope.number0 = $cookieStore.get('slider_movies');
    $scope.series = $cookieStore.get('slider_series');
    console.log($cookieStore.get('slider_series'));

    $scope.slickConfig0Loaded = true;
    $scope.slickConfig0 = {
        method: {},
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    infinite: true,
                    dots: false,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

	
    $scope.category = function () {

        var res = "";
        loading.active();
        //store cookie if check box for remember me is checked and codition goes true only otherwise none
        var args = $.param({
            'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
            'country_id': $cookieStore.get('country').country_id,
            'user_id': $cookieStore.get('userinfo').id,
            'type': $cookieStore.get('ck_typeof')
        });

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/movies_by_category',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            //            console.log(res.data.data);
            if (res.data.responseCode == '200') {
                //put cookie and redirect it    
                $scope.listing = res.data.data;

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
            'user_id': $cookieStore.get('userinfo').id,
            'type': $cookieStore.get('ck_typeof')

        });

        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/movies_series',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
            console.log(res.data.data);
            if (res.data.responseCode == '200') {
                //put cookie and redirect it    
                $scope.movies_series = res.data.data;

            } else {

                //Throw error if not logged in
                model.show('Alert', res.data.responseMessage);

            }


        });

    }



    //====================================
    // Slick 3
    //====================================

    $scope.slickConfig1Loaded = true;
    $scope.slickConfig1 = {
        method: {},
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 7,
        slidesToScroll: 2,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 7,
                    infinite: true,
                    dots: false,
                }
            },
            {
                breakpoint: 568,
                settings: {
                    slidesToShow: 5,
                    infinite: true,
                    dots: false,
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 4,
                    infinite: true,
                    dots: false,
                }
            }
        ]
    };

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

    $scope.view_all = function (id) {
        $cookieStore.put('category_id', id);
        $location.path('view_all');
    }

});