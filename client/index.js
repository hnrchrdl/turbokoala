require('font-awesome-webpack');
require('./styles.less');

require('jquery');
require('lodash');
require('bootstrap');

const angular = require('angular');
require('angular-animate');
require('angular-ui-router');
require('restangular');
require('angular-sanitize');

require('client/app.module.js')

angular.bootstrap(document, ['app']);

// $('body').tooltip({
//     selector: '[data-toggle="tooltip"]'
// });