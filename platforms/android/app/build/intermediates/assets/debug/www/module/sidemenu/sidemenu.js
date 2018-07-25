app.controller('sidemenu', function ($scope, $http, $location, $interval, $cookieStore, $window, $rootScope) {







    if ($cookieStore.get('ck_typeof')) {
        $scope.type = $cookieStore.get('ck_typeof');
    }


    $scope.logout = function () {



        //  alert($rootScope.RemoveFile());

        //return false;

        $cookieStore.remove('DeletedRecord');
        $cookieStore.remove('ck_typeof');
        $cookieStore.remove('detail');
        $cookieStore.remove('slider_movies');
        $cookieStore.remove('slider_series');
        $cookieStore.remove('userinfo');
        $cookieStore.remove('userinfo');
        $cookieStore.remove('video_url');
        $cookieStore.remove('video_detailss');
        setTimeout(function () {

            $rootScope.RemoveFile();

        }, 500)
        $cookieStore.remove('userinfo');
        $cookieStore.remove('userinfo');
        $cookieStore.remove('userinfo');
        $cookieStore.remove('userinfo');
        $location.path('/login');
    };

    $scope.go_to_cms = function (cms_id) {
        var cms_detail = {
            id: cms_id
        }
        $cookieStore.put('cms_detail', cms_detail);  //overwrite cookie value
        $location.path('/cms');
    }

    $scope.changepassword = function () {
        $location.path('/changepassword');

    };
    $scope.myaccount = function () {
        $location.path('/myaccount');

    };

    $scope.recent_view = function () {
        $location.path('/recent_view');

    };
    $scope.mydownload = function () {
        $location.path('/mydownload');

    };
    $scope.myradio = function () {
        $location.path('/radio');

    };
    $scope.home = function (type) {
        $window.location.reload()
        if (type == "1") {
            //movie
            $cookieStore.put('ck_typeof', 'movies');
            $location.path('/home');
        } else {
            //series
            $cookieStore.put('ck_typeof', 'series');
            $location.path('/home');
        }
    }
    $scope.go_to_search = function (type) {
        console.log(type);
        $location.path('/search');
    }

    //  $scope.social_login = $cookieStore.get('userinfo').social_type;



});