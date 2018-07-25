app.controller('list', function($scope, $http, $location, $cookieStore, $timeout, loading, model, $cordovaFile, $rootScope) {

    //  alert(storage);
    // if (!$cookieStore.get('userinfo')) {
    //     $location.path('/login');
    // }


    loading.deactive();
    $scope.views = function(id) {
        //alert(id);
        $cookieStore.put('detail', id);
        $location.path('/view');
    }

    $scope.listing = [
        { id: '1', name: 'John' },
        { id: '2', name: 'Ankit' },

    ];

    var arrayText = [];
    $scope.type = 'movies';
    $scope.listItem = function() {

        var db;
        var request = window.indexedDB.open("newDatabase", 1);

        request.onerror = function(event) {
            alert("error: ");
        };

        request.onsuccess = function(event) {
            db = request.result;
            console.log("success: " + db);
        };


        $scope.readAll = function() {

            var objectStore = db.transaction("employee").objectStore("employee");

            objectStore.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;

                if (cursor) {
                    arrayText.push(cursor.value);
                    // alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
                    cursor.continue();
                } else {
                    alert("No more entries!");
                }
            };
            console.log(arrayText);
            $scope.listing = arrayText;
            $scope.listItem();
        }



    }

    // setTimeout(function() {
    //     $scope.readAll();
    // }, 1000);


    $scope.view = function(id) {
        // alert(id);
        $cookieStore.put('detail', id);
        $location.path('/view');
    }


});;