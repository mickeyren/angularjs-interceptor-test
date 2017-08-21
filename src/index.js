import './styles/core.scss'
import angular from 'angular'
import swal from 'sweetalert2/dist/sweetalert2'

/**
* app configuration
*/
angular.module('app', []).config(['$locationProvider', '$httpProvider', function config($locationProvider, $httpProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    })
    $httpProvider.interceptors.push('httpInterceptor')
  }]
)

/**
* our http interceptor
*/
angular.module('app').factory('httpInterceptor', ['$rootScope', '$q', 'messages', function httpInterceptor($rootScope, $q, messages) {
    return {
      // intercept every request
      request: function(config) {
        messages.add('', config.url)

        config.headers = config.headers || {};
        return config;
      },
      // intercept response
      response: function(response) {
        messages.add(response.status, response.data)
        salert(
          response.statusText,
          'your request has been fulfilled',
          'success'
        )
        return $q.reject(response);
      },
      // catch errors
      responseError: function(response) {
        messages.add(response.status, response.data || response.xhrStatus)
        salert(
          response.statusText,
          'there has been an error making the request',
          'error'
        )
        return $q.reject(response);
      }
    }
  }
])

/**
* run block
*/
angular.module('app').run(['$rootScope', '$location', function run($rootScope, $location) {
  }]
)

/**
* service class that will store the data between the interceptor and the controller
*/
angular.module('app').service('messages', function() {
  var messages = {}
  messages.list = []

  messages.add = function(statusCode, responseText) {
    if(typeof(responseText) == Object) {
      responseText = JSON.stringify(responseText)
    }
    messages.list.unshift({timestamp: (+ new Date()), statusCode: statusCode, responseText: responseText})
  }

  return messages
})

/* controller */
angular.module('app').controller('AppCtrl', ['$scope', '$http', 'messages', function($scope, $http, messages) {
    $scope.url = ''
    $scope.number = 0
    $scope.list = messages.list

    $scope.makeRequest = function($event) {
      $event.currentTarget.blur()

      if($scope.inputForm.$invalid) {
        return salert('', 'Some of your inputs are invalid. Numbers can only be between 0.00 and 10000.00')
      }
      if(!/^(f|ht)tps?:\/\//i.test($scope.url)) {
        return salert('', 'You will need to prefix your url with http(s)://')
      }
      let url = $scope.url + '?' + $scope.number
      $http({
        method: 'GET',
        url: url
      }).catch(e => {
        // console.log('error', e)
      })
    }
  }
]);

function salert(title, text = null,  type = null) {
  swal(title, text, type).then(() => {
    angular.element(document.getElementsByClassName('swal2-container')).remove()
  }, () => {
    angular.element(document.getElementsByClassName('swal2-container')).remove()
  })
}
