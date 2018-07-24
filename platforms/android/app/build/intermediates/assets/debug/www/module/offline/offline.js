app.controller('offline', function ($scope, $http, $location, $cordovaToast, $interval, $cookieStore, $timeout, loading, model, $rootScope, $cordovaFile) {



    if ($cookieStore.get('userinfo')) {
        if ($cookieStore.get('userinfo') != undefined || $cookieStore.get('userinfo') != '') {
            var setUserid = $cookieStore.get('userinfo').id;
        } else {
            var setUserid = '';
        }
    }
    //  alert(setUserid)
    loading.active();
    // return false;
    $scope.offline_init = function () {
        loading.active();
        $scope.list = [];
        $scope.arrayText = [];
        function listDir(path) {
            window.resolveLocalFileSystemURL(path,
                function (fileSystem) {
                    var reader = fileSystem.createReader();
                    reader.readEntries(
                        function (entries) {
                            //   alert(setUserid);
                            angular.forEach(entries, function (value, key, ele) {


                                if (ele[key].isFile == true) {

                                    var az = JSON.stringify(ele[key].fullPath).split('/')[1];
                                    var kz = az.split('.')[0];
                                    var cz = window.atob(kz);

                                    var tz = cz.split('_');

                                    var len = tz.length;

                                    // alert(JSON.stringify(tz));

                                    if (tz[len - 1] == setUserid) {
                                        // alert(ChangeName);
                                        $scope.arrayText.push(
                                            {
                                                liveUrl: tz[3] + '_' + tz[4] + tz[5],
                                                typeID: tz[1],
                                                type: tz[2],
                                                total: ele[key],
                                                name: ele[key].name,
                                                playURL: cordova.file.externalDataDirectory + ele[key].name,
                                                nativeURL: ele[key].nativeURL,
                                                ChangeName: tz[len - 2],
                                                userid: tz[len - 1],
                                            }
                                        );

                                    }

                                }
                            });
                            setTimeout(function () {
                                loading.deactive();
                            }, 5000);

                        },
                        function (err) {
                            $scope.list = (err);
                        }
                    );
                }, function (err) {
                    $scope.list = (err);
                }
            );
        }

        $scope.list = listDir(cordova.file.externalDataDirectory);

    }


    $rootScope.DeletedRecord = [];
    $scope.delete_media = function (playURl, banner, type, name, file_name, index, typeID) {

        var playURl = playURl;
        var banner = banner;
        var type = type;
        var name = name;
        var file_name = file_name;
        var index = index;
        var typeID = typeID;

        model.ConfirmBox('Delete ' + type, 'Are you sure want to delete ?');
        $rootScope.Response = function (resp) {
            if (resp) {

                loading.active()
                $cordovaFile.removeFile(cordova.file.externalDataDirectory, file_name)
                    .then(function (success) {

                        //  alert('1')
                        $rootScope.DeletedRecord.push(
                            {
                                typeID: typeID,
                                type: type,
                                banner: banner,
                                name: name,
                                playURL: playURl,
                                file_name: file_name
                            }
                        );

                        // alert(JSON.stringify($rootScope.DeletedRecord));
                        setTimeout(function () {

                            $cookieStore.put('DeletedRecord', $rootScope.DeletedRecord); //overwrite cookie value
                            $cordovaToast.showShortBottom('Deleted Successfully');

                            // alert(JSON.stringify($cookieStore.get('DeletedRecord')))

                        }, 500)

                        $('#id_' + index).fadeOut('2000');

                        $scope.offline_init(function () {
                            listDir(cordova.file.externalDataDirectory);
                            loading.deactive();
                        });

                    }, function (error) {
                        // error
                        // alert('error')
                    });

                $rootScope.ok.removeClass('show').addClass('hide');
                $rootScope.load.removeClass('show').addClass('hide');
            }
        }


    }


    $scope.playoffline = function (playURl, banner, type, name, file_name) {



        var offline_video = {
            file_name: file_name,
            banner: 'assets/images/logo-splash.png',
            type: type,
            name: name
        }
        // alert(JSON.stringify(offline_video));
        // return false;
        console.log(offline_video);

        $cookieStore.put('offline_video', offline_video); //overwrite cookie value
        $location.path('/playoffline');


    }




    $scope.CheckConnection = function () {
        // alert()


        if (navigator.connection.type != 'none') {

            loading.active();
            $('#connect').slideUp(500);


            setTimeout(function () {


                function myCount() {
                    var count = 0;
                    var point = '.';

                    if (count == 0) {
                        // alert(count)
                        count += 1;
                        $("#append").append('<b>.</b>');

                    } else if (count > 3) {
                        // alert(count)
                        count = 0;
                        $("#append").text('.');
                    }

                }

                var jq = $interval(myCount, 800);

                $('#connectoffline').removeClass('hide').addClass('show').fadeOut(5000, function () {
                    $('#connectoffline').removeClass('show').addClass('hide');
                    $interval.cancel(jq);
                    $("#append").text('.');
                });
                $location.path('/home');
                loading.deactive();
            }, 1000);

        } else {
            $('#connect').slideUp(500).slideDown(500);
        }
    }


});