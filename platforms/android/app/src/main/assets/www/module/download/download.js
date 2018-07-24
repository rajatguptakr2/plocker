app.controller('download', function ($scope, $http, $cordovaFileTransfer, $location, $cookieStore, $timeout, loading, model, $rootScope, $cordovaFile, $cordovaToast) {

    // //alert(JSON.stringify($cookieStore.get('DeletedRecord')));
    // model.ConfirmBox('Confirmation Box', 'Are You Sure Want To Delete ?');




    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }

    if ($cookieStore.get('ck_typeof')) {
        $scope.type = $cookieStore.get('ck_typeof');
    }

    $scope.home = function () {
        $location.path('/home');
    }

    // $rootScope.DeletedRecords = [];

    // $rootScope.DeletedRecords.push(
    //     {
    //         typeID: 'typeID',
    //         type: 'type',
    //         banner: 'banner',
    //         name: 'name',
    //         playURL: 'playURl',
    //         file_name: 'file_name'
    //     }
    // );

    // (console.log($rootScope.DeletedRecords));

    // alert(JSON.stringify($cookieStore.get('DeletedRecord')))
    if ($cookieStore.get('DeletedRecord')) {

        //alert('downloa  djs at 23 inside ');
        var args = $.param({
            user_id: $cookieStore.get('userinfo').id,
            type: $cookieStore.get('DeletedRecord')

        });
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/delete_download',
            data: args //forms user object

        }).then(function (response) {
            //alert(JSON.stringify($cookieStore.get('DeletedRecord')))
            //alert('1')

            loading.deactive();
            res = response;

            if (res.data.responseCode == '200') {
                //alert('2')
                $scope.download_list = res.data.data.movie_list;
                $rootScope.countcheck();

                $cookieStore.put('DeletedRecord', '');
                $cookieStore.remove('DeletedRecord');
                setTimeout(function () {

                    $cookieStore.remove('DeletedRecord');

                }, 300)
            } else {
                //Throw error if not logged in
                //alert('3')
                $cookieStore.put('DeletedRecord', '');
                $cookieStore.remove('DeletedRecord');
                setTimeout(function () {
                    $cookieStore.remove('DeletedRecord');

                }, 300)
                //  model.show('//alert', res.data.responseMessage);

            }

        });

    }

    $scope.recent_views = function () {
        $scope.type = $cookieStore.get('type');
        loading.active();


        if ($cookieStore.get('download_type')) {

            var args = $.param({
                user_id: $cookieStore.get('userinfo').id,
                type: $cookieStore.get('download_type'), //overwrite cookie value

            });


        } else if ($cookieStore.get('type')) {

            // alert($cookieStore.get('type'))
            var args = $.param({
                user_id: $cookieStore.get('userinfo').id,
                type: $cookieStore.get('type'), //overwrite cookie value

            });

        } else {
            var args = $.param({
                user_id: $cookieStore.get('userinfo').id,
                type: 'series', //overwrite cookie value

            });


        }
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/download_list',
            data: args //forms user object

        }).then(function (response) {

            res = response;
            $rootScope.countcheck();
            if (res.data.responseCode == '200') {

                $scope.download_list = res.data.data.movie_list;

            } else {

                //Throw error if not logged in
                //  model.show('//alert', res.data.responseMessage);
                $scope.download_list = '';
            }

        }).finally(function () {

            $rootScope.countcheck();
            setTimeout(function () {
                loading.deactive();
            }, 3000)
        });

    }


    $rootScope.init = function (a) {

        // $scope.download_list = '';
        $cookieStore.put('download_type', a);



        loading.active();
        var args = $.param({
            user_id: $cookieStore.get('userinfo').id,
            type: a

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

            res = response;

            if (res.data.responseCode == '200') {

                $scope.download_list = res.data.data.movie_list;

            } else {

                //Throw error if not logged in
                //  model.show('//alert', res.data.responseMessage);
                $scope.download_list = '';
            }

        }).finally(function () {
            // $rootScope.countcheck();
            setTimeout(function () {
                loading.deactive();
            }, 3000)
            if (a == 'series') {
                $('.movies').addClass('higlight');
                $('.' + a).removeClass('higlight');
            } else {
                $('.series').addClass('higlight');
                $('.' + a).removeClass('higlight');
            }
        });


    }

    if ($cookieStore.get('download_type')) {

        $rootScope.init($cookieStore.get('download_type'))

    } else if ($cookieStore.get('type')) {

        // alert($cookieStore.get('type'))
        $rootScope.init($cookieStore.get('type'));
    } else {
        $rootScope.init('series');

    }


    $scope.delete_media = function (playURl, banner, type, name, index, typeID) {


        var playURl = playURl;
        var banner = banner;
        var type = type;
        var name = name;
        var index = index;
        var typeID = typeID;


        model.ConfirmBox('Delete ' + type, 'Are you sure want to delete ?');
        $rootScope.Response = function (resp) {
            if (resp) {
                //alert(playURl)
                $cordovaFile.removeFile(cordova.file.externalDataDirectory, playURl)
                    .then(function (success) {


                        $rootScope.DeletedRecord = [{
                            typeID: typeID,
                            type: type,
                            banner: banner,
                            name: name,
                            playURL: playURl,
                            file_name: playURl
                        }]


                        $cookieStore.put('DeletedRecord', $rootScope.DeletedRecord); //overwrite cookie value
                        $cordovaToast.showShortBottom('Deleted Successfully');
                        $('#id_' + index).fadeOut('2000');


                        if ($cookieStore.get('DeletedRecord')) {
                            var args = $.param({
                                user_id: $cookieStore.get('userinfo').id,
                                type: $cookieStore.get('DeletedRecord')

                            });
                            //alert(args);
                            $http({
                                headers: {
                                    //'token': '40d3dfd36e217abcade403b73789d732',
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                method: 'POST',
                                url: app_url + 'webservices/delete_download',
                                data: args //forms user object

                            }).then(function (response) {

                                res = response;

                                if (res.data.responseCode == '200') {


                                    $cookieStore.remove('DeletedRecord');
                                    setTimeout(function () {

                                        $rootScope.DeletedRecord = '';
                                        $cookieStore.remove('DeletedRecord');

                                    }, 300)
                                } else {

                                    //Throw error if not logged in
                                    $cookieStore.remove('DeletedRecord');
                                    setTimeout(function () {

                                        $rootScope.DeletedRecord = '';
                                        $cookieStore.remove('DeletedRecord');

                                    }, 300)
                                    //  model.show('//alert', res.data.responseMessage);

                                }

                            }).finally(function () {
                                $rootScope.countcheck();
                                setTimeout(function () {
                                    $scope.recent_views();
                                    loading.deactive();
                                    $rootScope.DeletedRecord = '';
                                    $cookieStore.remove('DeletedRecord');
                                }, 300)
                            });

                        }

                    }, function (error) {
                        // error
                        //alert('error')
                        $rootScope.DeletedRecord =
                            [{
                                typeID: typeID,
                                type: type,
                                banner: banner,
                                name: name,
                                playURL: playURl,
                                file_name: playURl
                            }]


                        $cookieStore.put('DeletedRecord', $rootScope.DeletedRecord); //overwrite cookie value
                        $cordovaToast.showShortBottom('Deleted Successfully');
                        $('#id_' + index).fadeOut('2000');
                        // alert('4')
                        // alert(JSON.stringify($cookieStore.get('DeletedRecord')))

                        if ($cookieStore.get('DeletedRecord')) {
                            //  //alert(JSON.stringify($cookieStore.get('DeletedRecord')))
                            var args = $.param({
                                user_id: $cookieStore.get('userinfo').id,
                                type: $cookieStore.get('DeletedRecord')

                            });
                            $http({
                                headers: {
                                    //'token': '40d3dfd36e217abcade403b73789d732',
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                method: 'POST',
                                url: app_url + 'webservices/delete_download',
                                data: args //forms user object

                            }).then(function (response) {
                                loading.deactive();
                                res = response;
                                $scope.recent_views();
                                if (res.data.responseCode == '200') {
                                    $scope.download_list = res.data.data.movie_list;
                                    $scope.recent_views();
                                    // alert('5')
                                    $rootScope.DeletedRecord = '';
                                    $cookieStore.remove('DeletedRecord');
                                    setTimeout(function () {
                                        $cookieStore.remove('DeletedRecord');

                                    }, 300)
                                } else {
                                    //Throw error if not logged in
                                    $scope.recent_views();
                                    $cookieStore.remove('DeletedRecord');
                                    setTimeout(function () {
                                        // alert('6')
                                        $rootScope.DeletedRecord = '';
                                        $cookieStore.remove('DeletedRecord');

                                    }, 300)
                                    //  model.show('//alert', res.data.responseMessage);

                                }

                            }).finally(function () {
                                $rootScope.countcheck();
                                setTimeout(function () {
                                    loading.deactive();
                                    // alert('7')
                                    $rootScope.DeletedRecord = '';
                                    $cookieStore.remove('DeletedRecord');
                                }, 300)
                            });

                        }


                    });


                $rootScope.ok.removeClass('show').addClass('hide');
                $rootScope.load.removeClass('show').addClass('hide');
            }
        }


    }

    $scope.playoffline = function (file_name, banner, type, name) {
        // console.log()
        var offline_video = {
            file_name: file_name,
            banner: banner,
            type: type,
            name: name
        }

        $cookieStore.put('offline_video', offline_video); //overwrite cookie value
        $location.path('/playoffline');


    }

    $scope.progress_data = function (id, type) {
        // //alert('2')
        ////alert(JSON.stringify($rootScope.transferPromise))
        // $rootScope.transferPromise.abort(function(a){
        //     ////alert(JSON.stringify(a));
        // });
        model.ConfirmBox('Remove ' + type, 'Are you sure want to remove ' + type + ' from list ?');
        $rootScope.Response = function (resp) {
            if (resp) {
                $cordovaToast.showShortBottom('Removed From List');
                $('#id_' + id).fadeOut('2000');
                $rootScope.progresss.splice(id, 1);
                model.hide();
            }

        }

        ////alert('25')
        // $rootScope.progresss = [];
    }


    $scope.recent_status = function () {

        $scope.offline = function (type) {
            $cookieStore.put('type', type); //overwrite cookie value
            // $location.path('/offlinedownloads');

        }



        $rootScope.countcheck();

    }
    $scope.play_series = function (series_main_id, series_sub_id, type) {
        if (series_main_id) {
            var series_detail = {
                id: series_main_id, //id of main series
                series_id: series_sub_id, //id of indivisual series within a series
                type: type
            }
            $cookieStore.put('detail', series_detail); //overwrite cookie value
            $location.path('/playvideo');
        }
    }
    $scope.play_movie = function (mov_id, type, movie_type) {
        console.log(mov_id + "" + type + "" + movie_type);
        if (mov_id) {
            var movie_detail = {
                id: mov_id,
                type: type,
                movie_type: movie_type, //movie_type =1 =>full movie video and 2 => traler video
            }
            $cookieStore.put('detail', movie_detail); //overwrite cookie value
            $location.path('/playvideo');
        }
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

});