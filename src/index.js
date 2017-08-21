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
angular.module('app').factory('httpInterceptor', ['$rootScope', '$q', function httpInterceptor($rootScope, $q, $location) {
    return {
      // intercept every request
      request: function(config) {
        appendToList('', config.url)
        config.headers = config.headers || {};
        return config;
      },
      // intercept response
      response: function(response) {
        appendToList(response.status, response.data)
        salert(
          response.statusText,
          'your request has been fulfilled',
          'success'
        )      
        return $q.reject(response);
      },
      // catch errors
      responseError: function(response) {
        appendToList(response.status, response.data)
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

/* controller */
angular.module('app').controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.url = ''
    $scope.number = 0

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

function appendToList(statusCode, responseText) {
  let list = angular.element(document.getElementsByClassName('list-group'))
  list.prepend(
    `<li class="list-group-item list-group-item-action justify-content-between">
      <span class="float-left"> ${+ new Date()}
      <span class="badge badge-info">${statusCode}</span>
      </span>
      ${JSON.stringify(responseText)}
    </li>`)  
}