//var app_url = 'http://projects.tekshapers.in/watchit/webservices/';
var app_url = 'http://192.168.1.43/watchit/webservices/';
var api_key = '0ed2e4b57d1f837276553b00d3fc2a29';

var storage = window.localStorage;

var app = angular.module("myApp", ['ngRoute', 'ngSanitize', 'ngCookies', 'ngSidebarJS', 'ngCordova', 'infinite-scroll', 'ngCordovaOauth', 'ngCordova']);

var currentUrl = '';

//Detect the Current Path
app.run(['$rootScope', '$location', '$routeParams', function($rootScope, $location, $routeParams, $cookieStore) {
    $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
        currentUrl = $location.path();

    });


}]);


var ress;
//Check the background page image from live path, every time the page is loaded
app.run(function($q, $http, $rootScope, $location, $interval, $cordovaToast, loading, model) {

    var act = window.console.log();

    // window.alert = function (type, content) {

    //     if (content == '' || content == undefined) {

    //         if (typeof type === 'string') {

    //             var j = type.toLowerCase();
    //             var a = j.indexOf("successfully");
    //             var b = j.indexOf("successful");
    //             var c = j.indexOf("success");
    //             // console.log(c)
    //             if (a >= 0 || b >= 0 || c >= 0) {
    //                 model.show('Info', type);
    //             } else {
    //                 model.show('Alert', type);
    //             }

    //         } else {

    //             //it will show when u passed the object
    //             model.show('Info', JSON.stringify(type));
    //         }
    //     } else {

    //         model.show(type, content);
    //     }
    // }


    var deferred = $q.defer();
    var promise = deferred.promise;
    var resolvedValue;
    $rootScope.abc = '';

    $rootScope.AppBackgroungImage = function(a) {

        $rootScope.abc = 'assets/images/background.jpg'; //res.data.responseCode;
    }

    $rootScope.userNavigation = function() {
        window.history.back()
    }


    $rootScope.AppBackgroungImage();

    //prefixes of implementation that we want to test
    window.indexedDB = window.indexedDB || window.mozIndexedDB ||
        window.webkitIndexedDB || window.msIndexedDB;

    //prefixes of window.IDB objects
    window.IDBTransaction = window.IDBTransaction ||
        window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange ||
        window.msIDBKeyRange

    if (!window.indexedDB) {
        window.alert("Your browser doesn't support a stable version of IndexedDB.")
    }

    const employeeData = [
        { id: "01", name: "Gopal K Varma", age: 35, email: "contact@tutorialspoint.com" },
        { id: "02", name: "Prasad", age: 24, email: "prasad@tutorialspoint.com" }
    ];

    var db;
    var request = window.indexedDB.open("newDatabase", 1);

    request.onerror = function(event) {
        alert("error: ");
    };

    request.onsuccess = function(event) {
        db = request.result;
        console.log("success: " + db);
    };

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        var objectStore = db.createObjectStore("employee", { keyPath: "id" });

        for (var i in employeeData) {
            objectStore.add(employeeData[i]);
        }
    }

    function read() {
        var transaction = db.transaction(["employee"]);
        var objectStore = transaction.objectStore("employee");
        var request = objectStore.get("00-03");

        request.onerror = function(event) {
            alert("Unable to retrieve daa from database!");
        };

        request.onsuccess = function(event) {
            // Do something with the request.result!
            if (request.result) {
                alert("Name: " + request.result.name + ", Age: " + request.result.age + ", Email: " + request.result.email);
            } else {
                alert("Kenny couldn't be found in your database!");
            }
        };
    }

    // function readAll() {



    // }

    function add() {
        var request = db.transaction(["employee"], "readwrite")
            .objectStore("employee")
            .add({ id: "03", name: "Kenny", age: 19, email: "kenny@planet.org" });

        request.onsuccess = function(event) {
            alert("Kenny has been added to your database.");
        };

        request.onerror = function(event) {
            alert("Unable to add data\r\nKenny is aready exist in your database! ");
        }
    }

    function remove() {
        var request = db.transaction(["employee"], "readwrite")
            .objectStore("employee")
            .delete("00-03");

        request.onsuccess = function(event) {
            alert("Kenny's entry has been removed from your database.");
        };
    }


});

//App Routing Configuration 
app.config(function($routeProvider, $httpProvider) {
    // $httpProvider.interceptors.push('timestampMarker');

    $routeProvider
        .when("/", {
            templateUrl: "module/splash/splash.html"
        })
        .when("/splash", {
            templateUrl: "module/splash/splash.html"
        }).when("/lock", {
            templateUrl: "module/lock/lock.html"
        }).when("/list", {
            templateUrl: "module/list/list.html"
        }).when("/home", {
            templateUrl: "module/home/home.html"
        }).when("/view", {
            templateUrl: "module/view/view.html"
        });


});

//Loading service for loading image , show and hide at a time using service  param
app.service('loading', function() {

    var process = {};
    var load = angular.element(document.querySelector('.loading-overlay'));
    process.active = function() {
        return load.removeClass('hide').addClass('show');
    };
    process.deactive = function() {
        return load.removeClass('show').addClass('hide');
    };


    return process;
});

//Conditional model box to give the redirect url where we want to redirec after click OK
app.service('model', ['$rootScope', '$location', function($rootScope, $location) {
    //////alert(window.location.path('/' + 'home'));
    var process = {};
    var url = '';
    var load = angular.element(document.querySelector('.modal-overlay'));
    $rootScope.load = angular.element(document.querySelector('.modal-overlay'));
    var title = angular.element(document.querySelector('.title'));
    var message = angular.element(document.querySelector('.message'));
    var CloseMark = angular.element(document.querySelector('.close-icon'));
    $rootScope.ok = angular.element(document.querySelector('.ok'));

    $rootScope.RedirectUrl = function() {
        load.removeClass('show').addClass('hide');
        // if (url != '') {

        //     $location.path('/' + url);
        // } else {
        //     load.removeClass('show').addClass('hide');
        // }
    }

    process.show = function(a, b) {

        if (typeof b === 'string') {
            var j = b.toLowerCase();

            var a = j.indexOf("successfully");
            var d = j.indexOf("successful");
            var c = j.indexOf("success");
            // console.log(c)
            if (a >= 0 || d >= 0 || c >= 0) {
                title.html('Info');
                message.html(b);
            } else {
                title.html('Alert');
                message.html(b);
            }

        }

        return load.removeClass('hide').addClass('show');
    };
    // It helps to redirect the page onclick of close button 
    process.ShowRedirectUrl = function(a, b, redirect) {

        if (typeof b === 'string') {
            var j = b.toLowerCase();

            var a = j.indexOf("successfully");
            var d = j.indexOf("successful");
            var c = j.indexOf("success");
            // console.log(c)
            if (a >= 0 || d >= 0 || c >= 0) {
                title.html('Info');
                message.html(b);
            } else {
                title.html('Alert');
                message.html(b);
            }

        }

        url = redirect;
        CloseMark.addClass('hide');
        return load.removeClass('hide').addClass('show');

    };
    process.ConfirmBox = function(a, b) {
        title.html(a); // title 
        message.html(b); //message for box
        $rootScope.ok.removeClass('hide').addClass('show'); //enable the Ok button
        return load.removeClass('hide').addClass('show');

    };
    process.hide = function() {
        return load.removeClass('show').addClass('hide');
    };

    return process;
}]);






app.directive('validateEmail', function() {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

    return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
            // only apply the validator if ngModel is present and Angular has added the email validator
            if (ctrl && ctrl.$validators.email) {

                // this will overwrite the default Angular email validator
                ctrl.$validators.email = function(modelValue) {
                    return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                };
            }
        }
    };
});
app.directive('onlyDigits', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attr, ctrl) {
            function inputValue(val) {
                if (val) {
                    var digits = val.replace(/[^0-9]/g, '');

                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});
app.directive('validNumber', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function(val) {
                if (angular.isUndefined(val)) {
                    var val = '';
                }
                var clean = val.replace(/[^0-9]+/g, '');
                if (val !== clean) {
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;
            });

            element.bind('keypress', function(event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});


app.directive('pwCheck', [function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function() {
                scope.$apply(function() {
                    var v = elem.val() === $(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}]);

app.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});



//Conditional model box to give the redirect url where we want to redirec after click OK
app.service('model', ['$rootScope', '$location', function($rootScope, $location) {
    //////alert(window.location.path('/' + 'home'));
    var process = {};
    var url = '';
    var load = angular.element(document.querySelector('.modal-overlay'));
    $rootScope.load = angular.element(document.querySelector('.modal-overlay'));
    var title = angular.element(document.querySelector('.title'));
    var message = angular.element(document.querySelector('.message'));
    var CloseMark = angular.element(document.querySelector('.close-icon'));
    $rootScope.ok = angular.element(document.querySelector('.ok'));

    $rootScope.RedirectUrl = function() {
        load.removeClass('show').addClass('hide');
        // if (url != '') {

        //     $location.path('/' + url);
        // } else {
        //     load.removeClass('show').addClass('hide');
        // }
    }

    process.show = function(a, b) {

        if (typeof b === 'string') {
            var j = b.toLowerCase();

            var a = j.indexOf("successfully");
            var d = j.indexOf("successful");
            var c = j.indexOf("success");
            // console.log(c)
            if (a >= 0 || d >= 0 || c >= 0) {
                title.html('Info');
                message.html(b);
            } else {
                title.html('Alert');
                message.html(b);
            }

        }

        return load.removeClass('hide').addClass('show');
    };
    // It helps to redirect the page onclick of close button 
    process.ShowRedirectUrl = function(a, b, redirect) {

        if (typeof b === 'string') {
            var j = b.toLowerCase();

            var a = j.indexOf("successfully");
            var d = j.indexOf("successful");
            var c = j.indexOf("success");
            // console.log(c)
            if (a >= 0 || d >= 0 || c >= 0) {
                title.html('Info');
                message.html(b);
            } else {
                title.html('Alert');
                message.html(b);
            }

        }

        url = redirect;
        CloseMark.addClass('hide');
        return load.removeClass('hide').addClass('show');

    };
    process.ConfirmBox = function(a, b) {
        title.html(a); // title 
        message.html(b); //message for box
        $rootScope.ok.removeClass('hide').addClass('show'); //enable the Ok button
        return load.removeClass('hide').addClass('show');

    };
    process.hide = function() {
        return load.removeClass('show').addClass('hide');
    };

    return process;
}]);