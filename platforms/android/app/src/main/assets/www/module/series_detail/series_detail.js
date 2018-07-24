app.controller('series_detail', function ($rootScope, $scope, $http, $location, $cookieStore, $timeout, loading, model) {

    //this.items = [];
    //this.busy = false;
    //this.after = '';
    //$scope.reddit = new Reddit();
    //$scope.series_list = new Reddit();
    //console.log($scope.series_list);
    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }

    if ($cookieStore.get('ck_typeof')) {
        $scope.type = $cookieStore.get('ck_typeof');
    }

    if ($cookieStore.get('detail')) {
        if ($cookieStore.get('detail').type == 'series') {
            var res = "";
            loading.active();
            $scope.page++;
            //store cookie if check box for remember me is checked and codition goes true only otherwise none
            //    alert('1')
            console.log($cookieStore.get('detail'));
            if ($cookieStore.get('detail').series_main_id) {

                var args = $.param({
                    'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                    'series_id': $cookieStore.get('detail').series_main_id,
                    'page': $scope.page,
                    'country_id': $cookieStore.get('country').country_id
                });
            } else {
                var args = $.param({
                    'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                    'series_id': $cookieStore.get('detail').id,
                    'page': $scope.page,
                    'country_id': $cookieStore.get('country').country_id
                });

            }
            console.log(args);
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
                    $rootScope.series = $scope.series = res.data.data;
                    $scope.series_list = res.data.data.series_list;

                    //console.log(res.data.data.series_list);
                    /*angular.forEach(res.data.data.series_list, function (value, key) {
                         $scope.series_list.push(value);
                       
                     });*/
                    // console.log($scope.series_list);
                } else {

                    //Throw error if not logged in
                    model.show('alert', res.data.responseMessage);
                }


            });
        } else {


        }
    }
    //}


    $scope.home = function () {
        //$location.path('/home');
        window.history.back();
    }

    $scope.go_to_search = function (type) {
        //  console.log(type);
        $location.path('/search');
    }



    $scope.play_video = function (series_main_id, series_sub_id, type) {

        if (series_main_id) {

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
                    // model.show('//alert', res.data.responseMessage);
                }


            });
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
                    var series_detail = {
                        id: series_sub_id, //id of main series
                        series_main_id: series_main_id, //id of indivisual series within a series
                        type: type,
                        adv_video: '',//$scope.adv_video,
                        adv_id: $scope.advertisement_id,
                    }

                    $cookieStore.put('detail', series_detail);  //overwrite cookie value
                    $location.path('/series_view');

                } else {

                    //Throw error if not logged in
                    model.show('alert', res.data.responseMessage);
                }


            });
            //=============get advertisement video and id if user has free subscription==============// 
        }

    }
    /* var i = 0;
     $scope.abc = function () {
         // console.log(i);
         i++;
     }
  
      $(window).scroll(function () {
          if ($(window).scrollTop() == $(document).height() - $(window).height()) {
              $scope.google();
          }
      });*/

    $scope.downloadinvoices = function (contentid, type, img, name, link_url) {
        loading.active();

        $rootScope.downloadinvoice($rootScope.reck, contentid, type, img, name, link_url);
        $scope.a = $rootScope.reck;



        $scope.active = true;
        $rootScope.reck++;


    }

});