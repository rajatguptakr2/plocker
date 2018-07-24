app.controller('playvideo', function ($rootScope, $scope, $injector, $http, $location, $route, $cookieStore, $timeout, $q, $sce, loading, model) {


    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        $rootScope.deviceplatform = device.platform;
        // alert($rootScope.deviceplatform);
    }


    if ($cookieStore.get('detail').adv_video != '') {

        var trans = $cookieStore.get('detail');
        $cookieStore.put('video_url', trans);
    }


    if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    } else {
        var userinfo = $cookieStore.get('userinfo');
    }

    if ($cookieStore.get('ck_typeof')) {
        $scope.type = $cookieStore.get('ck_typeof');
    }

    $scope.FetchTrailer = function () {
        loading.active();
        var args = $.param({
            country_id: $cookieStore.get('country').country_id,
            income_level_id: userinfo.income_level,
            content_id: $cookieStore.get('detail').id,
            type: $scope.type,
            user_id: $cookieStore.get('userinfo').id,
            age: userinfo.age

        });
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: app_url + 'webservices/get_trailers',
            data: args //forms user object

        }).then(function (response) {

            res = response;
            if (res.data.responseCode == '200') {
                
                $scope.getdata = res.data.data.result;

            } else if (res.data.responseCode == '201') {
                //Throw error if not logged in
                // model.show('', res.data.responseMessage);
                $scope.getdata = undefined;
            }
        }).finally(function () {

            // loading.deactive();
        });

    }

    $scope.FetchTrailer();

    if ($scope.type == 'series' || $scope.type == 'movies') {
        
        loading.active();
        $scope.save_trailer_history = function () {
            var args = $.param({
                csrf_test_name: '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                user_id: $cookieStore.get('userinfo').id,
                trailer_id: $scope.getdata,//$cookieStore.get('detail').id,
                type: $cookieStore.get('ck_typeof')
            });
            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'webservices/save_viewed_trailer',
                data: args //forms user object

            }).then(function (response) {

                res = response;
                if (res.data.responseCode == '200') {
                    console.log(res.data.data);
                } else {
                    //Throw error if not logged in
                    // model.show('', res.data.responseMessage);
                }
            });


            return true;
        }


        //==============on click skip advertise=================//
        //------------make entry in db of viewed advertisement--------------//
        $scope.save_advertise_history = function () {

            setTimeout(function () {
                $scope.save_trailer_history();
            }, 300);

            var args = $.param({
                'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                'user_id': $cookieStore.get('userinfo').id,
                'advertise_id': $scope.getdata,
                'type': $cookieStore.get('ck_typeof')
            });
            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'webservices/save_viewed_advertise',
                data: args //forms user object

            }).then(function (response) {

                res = response;
                if (res.data.responseCode == '200') {
                    console.log(res.data.data);
                } else {
                    //Throw error if not logged in
                    //model.show('', res.data.responseMessage);
                }
            });


            return true;
        }



        var controller = this;
        controller.API = null;


        //------------initialize video player------------------//
        //=========start movie player with video and poster image=====//
        $scope.start_player = function (video_url, poster_img) {
            // alert(video_url)
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
            var count = 0;

            controller.API = API;
            loading.active();
            setTimeout(function () {

                if ($scope.getdata != undefined) {
                    // alert($scope.getdata);
                    if ($scope.getdata.length != 0) {
                        console.error($scope.getdata[0].video);
                        $scope.start_player($scope.getdata[0].video, 'jhk');
                        $scope.save_advertise_history()
                        $scope.is_skippeds = '2';
                        count = '1';

                    }
                } else {

                    loading.deactive();
                    $scope.is_skippeds = '0';
                    $scope.start_player($cookieStore.get('detail').movie_url, poster_img);
                }

            }, 800)

            controller.API.playPause = function (API) {
                loading.active();
                count = '0';
                if (this.mediaElement[0].paused) {
                    // request for play 
                    var events = {
                        current: this.currentTime,
                        left: this.timeLeft,
                        total: this.totalTime,
                        src: this.mediaElement[0].src
                    };

                    $cookieStore.put('video_details', events);

                    if ($scope.getdata != undefined) {
                        $scope.start_player($scope.getdata[0].video, 'jhk');
                        count = '1';
                        $scope.is_skippeds = '2';
                        loading.deactive();
                    }
                    loading.deactive();
                    this.play();

                } else {
                    var events = {
                        current: 0,//this.currentTime,
                        left: 0,//this.timeLeft,
                        total: 0,//this.totalTime,
                        src: this.mediaElement[0].src
                    };

                    // alert(events)
                    $cookieStore.put('video_detailss', events);
                    loading.deactive();
                    this.pause();

                }
            }


            controller.Complete = function (API) {
                loading.active();
                if ($scope.getdata != undefined) {
                    var total_len = $scope.getdata.length;


                    if (total_len == count) {

                        var a = $cookieStore.get('video_details');
                        if (a) {
                            // alert(JSON.stringify(a));
                            if (a.src == undefined) {

                                controller.API.mediaElement[0].src = a.src;
                            } else {
                                controller.API.mediaElement[0].src = a.src;

                            }
                            controller.API.seekTime(a.current / 1000, null);
                            $scope.is_skippeds = '0';
                            $scope.is_skipped = '0';
                            // $cookieStore.remove('video_details');
                            // alert(controller.API.mediaElement[0].src)
                            loading.deactive();
                            controller.API.play();

                        } else {

                            // alert(JSON.stringify(a));
                            loading.deactive();
                            // $scope.play_movie();
                            $scope.is_skippeds = '0';
                            $scope.start_player($cookieStore.get('detail').movie_url, poster_img);
                        }
                    } else {
                        // alert($scope.getdata[count]);
                        if ($scope.getdata[count] != undefined) {

                            poster_img = '';
                            loading.deactive();
                            $scope.start_player($scope.getdata[count].video, poster_img);
                        }
                        else {
                            // alert(JSON.stringify(a));
                            var a = $cookieStore.get('video_details');
                            if (a == undefined) {

                                var a = $cookieStore.get('video_detailss');
                                // alert(a.src)
                            }
                            controller.API.mediaElement[0].src = $cookieStore.get('detail').movie_url;
                            controller.API.seekTime(0 / 1000, null);
                            $scope.is_skippeds = '0';
                            $scope.is_skipped = '0';
                            $cookieStore.remove('video_details');
                            loading.deactive();
                            controller.API.play();
                        }
                    }
                } else {
                    loading.deactive();
                    // $scope.play_movie();
                    $scope.is_skippeds = '0';
                    $scope.start_player($cookieStore.get('detail').movie_url, poster_img);
                }
                count++;
            }


        };


    } else {
      
        return false;

        if ($cookieStore.get('detail').adv_video != '') {
            $scope.is_skippeds = '2';
            $scope.is_skipped = '1'; //to show skip button
        } else {
            $scope.is_skipped = '0'; //to hide skip button
        }





        $scope.save_trailer_history = function () {
            var args = $.param({
                csrf_test_name: '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                user_id: $cookieStore.get('userinfo').id,
                trailer_id: $scope.getdata,//$cookieStore.get('detail').id,
                type: $cookieStore.get('ck_typeof')
            });
            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'webservices/save_viewed_trailer',
                data: args //forms user object

            }).then(function (response) {
                loading.deactive();
                res = response;
                if (res.data.responseCode == '200') {
                    console.log(res.data.data);
                } else {
                    //Throw error if not logged in
                    // model.show('', res.data.responseMessage);
                }
            });


            return true;
        }


        //==============on click skip advertise=================//
        //------------make entry in db of viewed advertisement--------------//
        $scope.save_advertise_history = function () {

            setTimeout(function () {
                $scope.save_trailer_history();
            }, 300);

            var args = $.param({
                'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
                'user_id': $cookieStore.get('userinfo').id,
                'advertise_id': $scope.getdata,
                'type': $cookieStore.get('ck_typeof')
            });
            $http({
                headers: {
                    //'token': '40d3dfd36e217abcade403b73789d732',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                url: app_url + 'webservices/save_viewed_advertise',
                data: args //forms user object

            }).then(function (response) {
                loading.deactive();
                res = response;
                if (res.data.responseCode == '200') {
                    console.log(res.data.data);
                } else {
                    //Throw error if not logged in
                    //model.show('', res.data.responseMessage);
                }
            });


            return true;
        }



        //------------make entry in db of viewed advertisement--------------//
        //===========play movie after skip or compltion of advertise by replacing cookie value ================//
        $scope.play_movie = function () {
            if ($scope.type == 'movies') {
                var movie_detail = {
                    id: $cookieStore.get('detail').id,
                    type: $cookieStore.get('detail').type,
                    adv_video: '', //make empty advertise video url and id
                    adv_id: '', //make empty advertise id
                    movie_type: $cookieStore.get('detail').movie_type //movie_type =1 =>full movie video and 2 => traler video
                }
                $cookieStore.put('detail', movie_detail); //overwrite cookie value 
            } else if ($scope.type == 'series') {
                var series_detail = {
                    id: $cookieStore.get('detail').id, //id of main series
                    series_id: $cookieStore.get('detail').series_id, //id of indivisual series within a series
                    series_main_id: $cookieStore.get('detail').series_main_id,
                    type: $cookieStore.get('detail').type,
                    adv_video: '', //make empty advertise video url and id
                    adv_id: '' //make empty advertise id
                }
                // alert(JSON.stringify($cookieStore.get('detail')))
                $cookieStore.put('detail', series_detail); //overwrite cookie value
            }

            $route.reload();
        }
        //===========play movie after skip or compltion of advertise================//
        //------------initialize video player------------------//
        var controller = this;
        controller.API = null;



        //(video_url);
        //------------initialize video player------------------//
        //=========start movie player with video and poster image=====//
        $scope.start_player = function (video_url, poster_img) {
            // alert(video_url);
            // alert(poster_img)
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


        // var aud = document.getElementById("myvideo");
        // aud.onpause = function () {
        //     alert("The audio has been paused");
        // };

        controller.onPlayerReady = function (API) {

            if ($cookieStore.get('detail').adv_video != '') {

                $scope.save_advertise_history(); //save history
            }


            console.log(this);
            controller.API = API;

            controller.API.playPause = function (API) {
                loading.active();
                if (this.mediaElement[0].paused) {
                    // request for play 
                    var events = {
                        current: this.currentTime,
                        left: this.timeLeft,
                        total: this.totalTime,
                        src: this.mediaElement[0].src
                    };

                    $cookieStore.put('video_details', events);

                    this.mediaElement[0].src = $cookieStore.get('video_url').adv_video;
                    $scope.is_skippeds = '2';
                    loading.deactive();
                    this.play();

                } else {
                    var events = {
                        current: 0,//this.currentTime,
                        left: 0,//this.timeLeft,
                        total: 0,//this.totalTime,
                        src: this.mediaElement[0].src
                    };

                    // alert(events)
                    $cookieStore.put('video_detailss', events);
                    loading.deactive();
                    this.pause();

                }
            }

            var count = 0;
            controller.Complete = function (API) {
                loading.active();
                var total_len = $scope.getdata.length;


                if (total_len == count) {

                    var a = $cookieStore.get('video_details');
                    if (a) {
                        // alert(JSON.stringify(a));
                        if (a.src == undefined) {

                            controller.API.mediaElement[0].src = a.src;
                        } else {
                            controller.API.mediaElement[0].src = a.src;

                        }
                        controller.API.seekTime(a.current / 1000, null);
                        $scope.is_skippeds = '0';
                        $scope.is_skipped = '0';
                        // $cookieStore.remove('video_details');
                        // alert(controller.API.mediaElement[0].src)
                        loading.deactive();
                        controller.API.play();

                    } else {

                        // alert(JSON.stringify(a));
                        loading.deactive();
                        $scope.play_movie();
                    }
                } else {
                    // alert($scope.getdata[count]);
                    if ($scope.getdata[count] != undefined) {

                        poster_img = '';
                        loading.deactive();
                        $scope.start_player($scope.getdata[count].video, poster_img);
                    }
                    else {
                        // alert(JSON.stringify(a));
                        var a = $cookieStore.get('video_details');
                        if (a == undefined) {

                            var a = $cookieStore.get('video_detailss');
                            // alert(a.src)
                        }
                        controller.API.mediaElement[0].src = a.src;
                        controller.API.seekTime(a.current / 1000, null);
                        $scope.is_skippeds = '0';
                        $scope.is_skipped = '0';
                        $cookieStore.remove('video_details');
                        loading.deactive();
                        controller.API.play();
                    }
                }
                count++;
            }


        };

        //==============on completion of advertise video start movie video=================//

        if ($cookieStore.get('detail').id) {
            console.log($cookieStore.get('detail'));
            if ($cookieStore.get('detail').type == 'movies') //if response from movie details page 
            {
                var advertise = '';
                if ($cookieStore.get('detail').adv_video != '') //if user has free subscription then has to view advertise first
                {
                    var advertise_video = $cookieStore.get('detail').adv_video;
                    var poster_img = '';

                    $scope.start_player(advertise_video, poster_img);

                } else {
                    var res = "";
                    loading.active();
                    var args = $.param({
                        'csrf_test_name': '40d3dfd36e217abcade403b73789d732',
                        'movie_id': $cookieStore.get('detail').id,
                    });
                    if ($cookieStore.get('detail').movie_type) {
                        var movie_type = $cookieStore.get('detail').movie_type;
                    }
                    console.log(movie_type);
                    $http({
                        headers: {
                            //'token': '40d3dfd36e217abcade403b73789d732',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        method: 'POST',
                        url: app_url + 'webservices/movies_details',
                        data: args //forms user object

                    }).then(function (response) {
                        loading.deactive();
                        res = response;
                        if (res.data.responseCode == '200') {
                            console.log(res.data.data);
                            var movie_url = '';
                            //movie_type =1 =>full movie video and 2 => triler video
                            if (movie_type == '1') {
                                movie_url = res.data.data.movie_details.movie_video;
                            } else if (movie_type == '2') {
                                movie_url = res.data.data.movie_details.trailer_video;
                            }
                            if (movie_url != '') {


                                $scope.start_player(movie_url, res.data.data.movie_details.banner_image);

                            } else {
                                //model.show('', "Video not found");
                            }

                        } else {
                            //Throw error if not logged in
                            model.show('', res.data.responseMessage);
                        }


                    });
                }
            }
            if ($cookieStore.get('detail').type == 'series') //if response from series details page
            {
                var res = "";
                loading.active();
                var advertise = '';
                if ($cookieStore.get('detail').adv_video != '') //if user has free subscription then has to view advertise first
                {
                    var advertise_video = $cookieStore.get('detail').adv_video;
                    var poster_img = '';
                    $scope.start_player(advertise_video, poster_img);
                } else {
                    var args = $.param({
                        'csrf_test_name': '40d3dfd36e217abcade403b73789d732',
                        'series_id': $cookieStore.get('detail').id,
                    });

                    $http({
                        headers: {
                            //'token': '40d3dfd36e217abcade403b73789d732',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        method: 'POST',
                        url: app_url + 'webservices/series_details',
                        data: args //forms user object

                    }).then(function (response) {

                        loading.deactive();
                        res = response;
                        if (res.data.responseCode == '200') {
                            var poster_img = res.data.data.series_details.banner_image;
                            $scope.start_player(res.data.data.series_details.video, poster_img);
                        } else {
                            //Throw error if not logged in
                            model.show('', res.data.responseMessage);
                        }


                    });
                }
            }

        } else {
            //model.show('', 'Movie details not found');
            $location.path('/movie_detail');
        }



    }



});