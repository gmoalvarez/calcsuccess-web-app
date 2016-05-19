'use strict';
// Declare app level module which depends on views, and components
angular

    .module('myApp', [
        'ngComponentRouter',
        'heroes',
        'videos',
        'youtube-embed',
        'angular.filter'
    ])

    .config(config)

    .value('$routerRootComponent', 'myApp')

    .component('myApp', {
        template: `
        <nav>
            <a ng-link="['Videos']" >Videos</a>
            <a ng-link="['Heroes']">Heroes</a>
        </nav>
        <ng-outlet></ng-outlet>
        `,
        $routeConfig: [
            {path: '/heroes/...', name: 'Heroes', component: 'heroes'},
            {path: '/...', name: 'Videos', component: 'videosMain', useAsDefault: true}
        ]
    });

config.$inject = ['$locationProvider'];
function config($locationProvider) {
    $locationProvider.html5Mode(true);
}