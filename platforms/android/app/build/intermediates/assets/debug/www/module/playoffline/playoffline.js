app.controller('playoffline', function ($scope, $injector, $http, $location, $route, $cookieStore, $cordovaFile, $cordovaToast, $timeout, $q, $sce, loading, model) {


    // alert($location.url().split('/')[1]);



    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }


    //===========play movie after skip or compltion of advertise================//
    //------------initialize video player------------------//
    var controller = this;
    controller.API = null;



    //alert(video_url);
    //------------initialize video player------------------//
    //=========start movie player with video and poster image=====//
    $scope.start_player = function (video_url, poster_img) {
        // alert(video_url + ' ' + poster_img);
        if (video_url != '') {
            var poster_img = (poster_img != '') ? poster_img : '';
            //---------for video player--------------------------//

            controller.config = {
                autoPlay: true,
                preload: "none",
                autohide: true,
                autohideTime: 2000,
                sources: [
                    { src: $sce.trustAsResourceUrl(video_url), type: "video/mp4" },
                    { src: $sce.trustAsResourceUrl("assets/videos/video.webm"), type: "video/webm" },
                    { src: $sce.trustAsResourceUrl("assets/videos/video.ogg"), type: "video/ogg" }
                ],
                tracks: [{
                    src: "assets/video/pale-blue-dot.vtt",
                    kind: "subtitles",
                    srclang: "en",
                    label: "English",
                    default: ""
                }],
                theme: {
                    url: "assets/video/videogular.css"
                },
                plugins: {
                    poster: poster_img
                }
            };


            //-------- for video player close-----------------------//
        }
    }

    controller.onPlayerReady = function (API) {

        if ($cookieStore.get('offline_video')) {
            var val = $cookieStore.get('offline_video');
            $scope.start_player(val.file_name, val.banner);
        }
        // alert('ready')
        controller.API = API;

        controller.API.playPause = function (API) {

            if (this.mediaElement[0].paused) {
                // //request for play 
                // //                alert($cookieStore.get('video_url').adv_video);
                // var events = {
                //     current: this.currentTime,
                //     left: this.timeLeft,
                //     total: this.totalTime,
                //     src: this.mediaElement[0].src
                // };
                // $cookieStore.put('video_details', events);

                // this.mediaElement[0].src = $cookieStore.get('video_url').adv_video;
                // $scope.is_skippeds = '2';

                // //                this.seekTime('135', null);
                this.play();
            } else {
                this.pause();
            }
        }

        controller.Complete = function (API) {

        }
    };




    //=========start movie player with video and poster image=====//
    //==============on completion of advertise video start movie video=================//

    //==============on completion of advertise video start movie video=================//

    // $cookieStore.put('offline_video');
    if ($cookieStore.get('offline_video')) {

        var storageUrl = cordova.file.externalDataDirectory;
        // alert(storageUrl);
        var filename = storageUrl + $cookieStore.get('offline_video').file_name;
        // alert(filename);
        var file = $cookieStore.get('offline_video').file_name;
        // alert(file);
        $cordovaFile.checkFile(cordova.file.externalDataDirectory, file)
            .then(function (success) {
                // success  
                $scope.start_player(filename, $cookieStore.get('offline_video').banner)
                //alert(JSON.stringify(success))
            }, function (error) {
                // error
                if (navigator.connection.type == 'none') {

                    $location.path('/offline');
                } else {
                    // clearInterval(myVar);
                    $location.path('/mydownload');
                }
                $cordovaToast.showShortBottom('File Not Found');
                //alert(JSON.stringify(error))
            });

    } else {
        $cordovaToast.showShortBottom('Record Not Found');
        if (navigator.connection.type == 'none') {

            $location.path('/offline');
        } else {
            // clearInterval(myVar);
            $location.path('/mydownload');
        }
    }








});