app.controller('list', function ($scope, $http, $location, $cookieStore, $timeout, loading, model, $cordovaFile, $rootScope) {

    //  alert(storage);
    // if (!$cookieStore.get('userinfo')) {
    //     $location.path('/login');
    // }



    loading.deactive();
    $scope.type = 'movies';
    $scope.listing = [
        { id: '1', name: 'John' },
        { id: '2', name: 'Ankit' },

    ];

    $scope.view = function (id) {
        alert(id);
    }
});