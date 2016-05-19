angular.module('videos', [])

    .service('videoService', VideoService)

    .component('videosMain', {
        template: `
        <h3>Videos</h3>
        <ng-outlet></ng-outlet>
        `,
        $routeConfig: [
            { path:'/', name: 'VideoList', component: 'videoList', useAsDefault: true }
            // { path: '/:id', name: 'videoDetail', component: 'videoDetail'}
        ]
    })

    .component('videoList', {
        template: `

        <!--<div class="container">-->
            <!--<div class="col-xs-4">-->
                <!--<div ng-repeat="video in $ctrl.videos"-->
                 <!--class="video-list"-->
                 <!--ng-class="{ selected : $ctrl.isSelected(video) }">-->
                    <!--<a ng-click="$ctrl.changeVideo(video)">{{video.chapter}}.{{video.section}}-{{video.title}}</a>-->
                <!--</div>            -->
            <!--</div>-->
            <!--<div class="col-xs-8">-->
                <!--<youtube-video video-id="$ctrl.currentVideoId"></youtube-video>-->
            <!--</div>-->
        <!--</div>-->
  <div class="input-lg">
    Search: <input type="search" ng-model="$ctrl.query" placeholder="Narrow down the list">
  </div>

  <div class="col-sm-3 videolist">
    <ul class="list-group list-unstyled">
      <li class="list-group-item-info video-link" ng-repeat="(chapter,videos) in $ctrl.videos | groupBy: 'chapter' ">
        <h2>Chapter {{chapter}}</h2>
        <ul class="list-unstyled">
          <li ng-repeat="video in videos | filter:$ctrl.query">
            <a ng-click="$ctrl.changeVideo(video)" class="list-group-item">
              <h5>{{video.chapter}}.{{video.section}}-{{video.title}}</h5></a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="col-xs-8">
      <youtube-video video-id="$ctrl.currentVideoId"></youtube-video>
  </div>
        `,
        bindings: { $router: '<' },
        controller: VideoListComponent,
        $canActivate: ['$nextInstruction', '$prevInstruction',function($nextInstruction, $prevInstruction) {
            console.log('$canActivate', arguments);
        }]
    })

    .service('videoOrderingService', VideoOrderingService)

const MY_CALC_VIDEO_LIST_URL = 'resources/calc_video_list.json';
VideoService.$inject = ['$http'];
function VideoService($http) {
    var videosPromise = $http.get(MY_CALC_VIDEO_LIST_URL);

    this.getVideos = function() {
        return videosPromise;
    };

    this.getVideo = function(id) {
        return videosPromise.then(function(videos) {
            for(var i=0; i<videos.length; i++) {
                if ( videos[i].id == id) return videos[i];
            }
        });
    };
}

VideoListComponent.$inject = ['videoService', 'videoOrderingService', '$scope'];
function VideoListComponent(videoService, videoOrderingService, $scope) {
    var $ctrl = this;
    $ctrl.query = '';
    $ctrl.currentVideoId = '2busxQ-3FQ4';
    this.$routerOnActivate = function() {
        videoService.getVideos().then(function(videos) {
            $ctrl.videos = videos.data;
            // videoOrderingService.orderByChapter($ctrl.videos);

        })
    };

    this.isSelected = function (video) {
        return (video.youtubeId == $ctrl.currentVideoId);
    };

    this.changeVideo = function (video) {
        console.log('Change video to ');
        console.log(video);
        this.currentVideoId = video.youtubeId;
    };

    //an example of reacting to events. We will use this to update the database
    //in the future
    $scope.$on('youtube.player.ended', function ($event, player) {
        console.log($event);
        console.log('the player just ended');
        player.playVideo();
    });
}


VideoOrderingService.$inject = [];
function VideoOrderingService() {

    //this takes an array of videos and returns a two-dimensional array
    //A[x][y] where x contains an array of videos for that chapter
    this.orderByChapter = function (videos) {
        let numChap = maxChapter(videos);

    };


    //private function to find the maximum number of chapters
    function maxChapter(videos) {
        maxChapter = 0;
        angular.forEach(videos, function (video) {
            if (video.chapter > maxChapter) {
                maxChapter = video.chapter;
            }
        });
        return maxChapter;
    }
}