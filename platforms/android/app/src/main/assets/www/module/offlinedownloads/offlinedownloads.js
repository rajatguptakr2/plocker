app.controller('offlinedownloads', function ($cordovaToast, $scope, $http, $location, $cookieStore, $timeout, loading, model, $rootScope, $cordovaFile) {

    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }


    $scope.home = function () {
        $location.path('/mydownload');
    }

    $scope.recent_views = function () {
        $scope.type = $cookieStore.get('type');
        loading.active();
        var args = $.param({
            user_id: $cookieStore.get('userinfo').id,
            type: $cookieStore.get('type'), //overwrite cookie value

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

                $scope.download_list = res.data.data.movie_list;

                console.log($scope.download_list);

            } else {

                //Throw error if not logged in
                //  model.show('//alert', res.data.responseMessage);
                $scope.download_list = '';
            }

        });

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


                        $rootScope.DeletedRecord.push(
                            {
                                typeID: typeID,
                                type: type,
                                banner: banner,
                                name: name,
                                playURL: playURl,
                                file_name: playURl
                            }
                        );
                        //alert(JSON.stringify($rootScope.DeletedRecord));
                        $cookieStore.put('DeletedRecord', $rootScope.DeletedRecord); //overwrite cookie value
                        $cordovaToast.showShortBottom('Deleted Successfully');
                        $('#id_' + index).fadeOut('2000');


                        if ($cookieStore.get('DeletedRecord')) {
                            //  //alert(JSON.stringify($cookieStore.get('DeletedRecord')))
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
                                loading.deactive();
                                res = response;
                                $scope.recent_views();
                                if (res.data.responseCode == '200') {
                                    $scope.download_list = res.data.data.movie_list;
                                    $scope.recent_views();
                                    $cookieStore.remove('DeletedRecord');
                                    setTimeout(function () {
                                        $cookieStore.remove('DeletedRecord');

                                    }, 300)
                                } else {
                                    $scope.recent_views();
                                    //Throw error if not logged in
                                    $cookieStore.remove('DeletedRecord');
                                    setTimeout(function () {
                                        $cookieStore.remove('DeletedRecord');

                                    }, 300)
                                    //  model.show('//alert', res.data.responseMessage);

                                }

                            });

                        }

                    }, function (error) {
                        // error
                        //alert('error')
                        $rootScope.DeletedRecord =
                                                    {
                                                        typeID: typeID,
                                                        type: type,
                                                        banner: banner,
                                                        name: name,
                                                        playURL: playURl,
                                                        file_name: playURl
                                                    }


                        //alert(JSON.stringify($rootScope.DeletedRecord));
                        $cookieStore.put('DeletedRecord', $rootScope.DeletedRecord); //overwrite cookie value
                        $cordovaToast.showShortBottom('Deleted Successfully');
                        $('#id_' + index).fadeOut('2000');


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
                                    $cookieStore.remove('DeletedRecord');
                                    setTimeout(function () {
                                        $cookieStore.remove('DeletedRecord');

                                    }, 300)
                                } else {
                                    //Throw error if not logged in
                                    $scope.recent_views();
                                    $cookieStore.remove('DeletedRecord');
                                    setTimeout(function () {
                                        $cookieStore.remove('DeletedRecord');

                                    }, 300)
                                    //  model.show('//alert', res.data.responseMessage);

                                }

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


});