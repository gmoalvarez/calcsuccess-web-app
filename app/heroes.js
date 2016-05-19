angular.module('heroes', [])

    .service('heroService', HeroService)

    .component('heroes', {
        template: `
        <h2>Heroes</h2>
        <ng-outlet></ng-outlet>
        `,
        $routeConfig: [
            {path: '/', name: 'HeroList', component: 'heroList', useAsDefault: true},
            {path: '/:id', name: 'HeroDetail', component: 'heroDetail'}
        ]
    })

    .component('heroList', {
        template: `
        <div ng-repeat="hero in $ctrl.heroes"
             ng-class="{ selected: $ctrl.isSelected(hero) }">
            <a ng-link="['HeroDetail', {id: hero.id}]">{{hero.name}}</a>
        </div>
        `,
        controller: HeroListComponent
    })

    .component('heroDetail', {
        template: `
        <div ng-if="$ctrl.hero">
            <h3>{{$ctrl.hero.name}}</h3>
            <div>
                <label>Id: </label>{{$ctrl.hero.id}}
            </div>
            <div>
                <label>Name: </label>
                <input ng-model="$ctrl.hero.name" placeholder="name">
            </div>
            <button ng-click="$ctrl.gotoHeroes()">Back</button>
        </div>
        `,
        bindings: { $router: '<' },
        controller: HeroDetailComponent
    });

//HEROSERVICE
HeroService.$inject = ['$q'];
function HeroService($q) {
    var heroesPromise = $q.when([
        { id: 11, name: 'Mr. Nice' },
        { id: 12, name: 'Narco' },
        { id: 13, name: 'Bombasto' },
        { id: 14, name: 'Celeritas' },
        { id: 15, name: 'Magneta' },
        { id: 16, name: 'RubberMan' }
    ]);

    this.getHeroes = function() {
        return heroesPromise;
    };

    this.getHero = function(id) {
        console.log(id);
        return heroesPromise.then(function(heroes) {
            for(var i=0; i<heroes.length; i++) {
                if ( heroes[i].id == id) return heroes[i];
            }
        });
    }
}

HeroListComponent.$inject = ['heroService'];
function HeroListComponent(heroService) {
    var $ctrl = this;
    var selectedId = null;

    this.$routerOnActivate = function(next) {
        heroService.getHeroes().then(function (heroes) {
            $ctrl.heroes = heroes;
            selectedId = next.params.id;
        })
    }

    this.isSelected = function(hero) {
        return (hero.id == selectedId);
    };
}

HeroDetailComponent.$inject = ['heroService'];
function HeroDetailComponent(heroService) {
    var $ctrl = this;

    this.$routerOnActivate = function(next,previous) {
        //Get the hero identified by the route parameter
        var id = next.params.id;
        return heroService.getHero(id).then(function(hero) {
            $ctrl.hero = hero;
        })
    }

    this.gotoHeroes = function() {
        var heroId = this.hero && this.hero.id;
        this.$router.navigate(['HeroList', {id: heroId}]);
    }
}