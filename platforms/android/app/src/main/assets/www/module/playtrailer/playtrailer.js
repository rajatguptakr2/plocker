app.controller('playtrailer', function ($rootScope, $scope, $injector, $http, $location, $route, $cookieStore, $timeout, $q, $sce, loading, model) {



    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        $rootScope.deviceplatform = device.platform;

    }

    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    } else {
        var userinfo = $cookieStore.get('userinfo');
    }

    if ($cookieStore.get('ck_typeof')) {
        $scope.type = $cookieStore.get('ck_typeof');
    }


    var controller = this;
    controller.API = null;


    //------------initialize video player------------------//
    //=========start movie player with video and poster image=====//
    $scope.start_player = function (video_url, poster_img) {
        
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
                    { src: $sce.trustAsResourceUrl("assets/videos/video.ogg"), type: "video/ogg" },
                    { src: $sce.trustAsResourceUrl("assets/videos/video.mov"), type: "video/quicktime" },
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
    console.log($cookieStore.get('detail'))
    controller.onPlayerReady = function (API) {

        controller.API = API;

        controller.API.playPause = function (API) {
            loading.active();
            if (this.mediaElement[0].paused) {
                // request for play 

                this.mediaElement[0].src = $cookieStore.get('trailer_details').src;
                controller.API.seekTime($cookieStore.get('trailer_details').current / 1000, null);
                loading.deactive();
                this.play();

            } else {

                var events = {
                    current: this.currentTime,
                    left: this.timeLeft,
                    total: this.totalTime,
                    src: this.mediaElement[0].src
                };

                $cookieStore.put('trailer_details', events);
                loading.deactive();
                this.pause();

            }
        }


        controller.Complete = function (API) {
            loading.active();

            poster_img = $cookieStore.get('trailer_video').banner_image;
            $scope.start_player($cookieStore.get('trailer_video').trailer_video, poster_img);
            loading.deactive();
            $cookieStore.remove('trailer_details');
            controller.API.play();
        }


    };

    var advertise_video = $cookieStore.get('trailer_video').trailer_video;
    var poster_img = '';

    $scope.start_player(advertise_video, poster_img);

});