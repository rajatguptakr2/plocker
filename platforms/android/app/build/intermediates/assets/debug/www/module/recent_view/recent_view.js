app.controller('recent_view', function ($scope, $http, $location, $cookieStore, $timeout, loading, model) {

    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }

    if ($cookieStore.get('ck_typeof')) {
        $scope.type = $cookieStore.get('ck_typeof');
    }

    $scope.home = function(){
        $location.path('/home');
    }
    $scope.recent_views = function () {

        var res = "";
        loading.active();
        //store cookie if check box for remember me is checked and codition goes true only otherwise none
        var args = $.param({
            'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
            'user_id': $cookieStore.get('userinfo').id,
            'type' : $scope.type

        });
        console.log(args);
       $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/get_recently_viewed',
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
           
            if (res.data.responseCode == '200') {
                //put cookie and redirect it 
                console.log(res.data.data); 
                $scope.type= res.data.data.type;
                $scope.recent_list = res.data.data.result;
                console.log($scope.type);
            } else {

                //Throw error if not logged in
                model.show('Alert', res.data.responseMessage);

            }


        });
        

    }
     $scope.play_series=function(series_main_id,series_sub_id,type){
        if(series_main_id){
             var series_detail = {
                id: series_main_id, //id of main series
                series_id:series_sub_id, //id of indivisual series within a series
                type: type
            }
        $cookieStore.put('detail', series_detail);  //overwrite cookie value
        $location.path('/playvideo');
     }
     }
     $scope.play_movie=function(mov_id,type,movie_type){
       console.log(mov_id+""+type+""+movie_type);
        if(mov_id)
        {
             var movie_detail = {
                id: mov_id,
                type: type,
                movie_type:movie_type, //movie_type =1 =>full movie video and 2 => traler video
        }
            $cookieStore.put('detail', movie_detail);  //overwrite cookie value
            $location.path('/playvideo');
     }
     }
     
     $scope.movie = function (id, type) {
        
        var movie_detail = {
            id: id,
            type: type
        }
        $cookieStore.put('detail', movie_detail);
        if(type == 'movies'){
            type    = 'movie';
            $location.path('/'+type+'_detail');
        }else{
            $location.path('/'+type+'_detail');
        }


    }

});