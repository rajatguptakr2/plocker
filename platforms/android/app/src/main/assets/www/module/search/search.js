app.controller('search', function ($scope, $http, $location, $cookieStore, $timeout, loading, model) {
   
   if (!$cookieStore.get('userinfo')) {
        $location.path('/login');
    }

    if ($cookieStore.get('ck_typeof')) {
        
    }
    $scope.back = function(){
        $location.path('/home');
    }
	if(window.localStorage.getItem("cachedKeyword"))
	{
		var gatheredPosts = JSON.parse(window.localStorage.getItem("cachedKeyword"));
	}else{
		var gatheredPosts = new Array();
		gatheredPosts.push({indx:''});
	}
	window.localStorage.setItem("cachedKeyword", JSON.stringify(gatheredPosts));
    gatheredPosts = window.localStorage.getItem("cachedKeyword");
	console.log(JSON.parse(gatheredPosts));
    $scope.recent_search_data = JSON.parse(gatheredPosts);
	
	
    $scope.movie = function (id, type) {
        //gatheredPosts = JSON.parse(window.localStorage.getItem("cachedKeyword"));    
        
        
        var gatheredPosts = JSON.parse(window.localStorage.getItem("cachedKeyword"));  
		var word_is_exist = '';
		$.each(gatheredPosts, function( index, value ) {
		//	alert(value.indx);
			if(value.indx == $scope.search_word)
			{
				word_is_exist = true;
			}else{
				word_is_exist = false;
			}
		});
		//alert(word_is_exist);
		if(!word_is_exist){
			var gatheredPosts = JSON.parse(window.localStorage.getItem("cachedKeyword"));  
			gatheredPosts.push({indx:$scope.search_word});
			window.localStorage.setItem("cachedKeyword", JSON.stringify(gatheredPosts));    
		}
        //gatheredPosts = window.localStorage.getItem("cachedKeyword");
        //$scope.recent_search_data = JSON.parse(gatheredPosts);
        
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
    /*recent search keyword*/
        $scope.type_recent  =   'recent_search_keyword';
    /*End of recent search keyword*/
    //var gatheredPosts = new Array();
    
    //var gatheredPosts = JSON.parse(window.localStorage.getItem("cachedKeyword"));
    
    
	
	
	
    
        
    $scope.search_keyword = function (key) {
        
        if(!$scope.search_word){
            $scope.type_recent  =   'recent_search_keyword';
        }else{
            $scope.type_recent  =   '';
        }
        $scope.type = $cookieStore.get('ck_typeof');
        /*putting search keyword in cookies*/
        
        $cookieStore.put('ck_search_keyword',$scope.search_word);
        
        //alert($cookieStore.get('ck_search_keyword'));
        
        $scope.search_word = key;//$cookieStore.get('ck_search_keyword');

        if($cookieStore.get('ck_search_keyword'))
        {
            $scope.search_word = $cookieStore.get('ck_search_keyword');
            
        }
        var res = "";
        loading.active();
        //store cookie if check box for remember me is checked and codition goes true only otherwise none
        var args = $.param({
            'csrf_test_name': '40d3dfd36e217abcade403b73789d732', //$cookieStore.get('csrf_test_name'),
            'country_id': $cookieStore.get('country').country_id,
            'keyword'   : $scope.search_word,
             
        });
        
        if($cookieStore.get('ck_typeof') == 'movies'){
            var url1 = app_url + 'webservices/search_movies';
        }else if($cookieStore.get('ck_typeof') == 'series'){
            var url1 = app_url + 'webservices/search_series';
        }
        
        
        
        $http({
            headers: {
                //'token': '40d3dfd36e217abcade403b73789d732',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: url1,
            data: args //forms user object

        }).then(function (response) {
            loading.deactive();
            res = response;
			//console.log(res.data.data.movie_count);
            if (res.data.responseCode == '200') {
                //put cookie and redirect it    
                $scope.listing = res.data.data;
                $scope.count =  res.data.data.count;
				//console.log($scope.count);
            } else {

                //Throw error if not logged in
                model.show('Alert', res.data.responseMessage);

            }
        });
    }
    
    $scope.search_type= function(key){
        
        
        $cookieStore.put('ck_search_keyword',key)
        $scope.search_keyword(key);
        $scope.type_recent  =   '';
    }
    if($cookieStore.get('ck_search_keyword'))
    {
        $scope.search_word = $cookieStore.get('ck_search_keyword');
        $scope.search_keyword();
    }
});