angular.module('dialog',[])

.service('dialogService', DialogService);

DialogService.$inject = ['$q'];
function DialogService($q) {
    this.confirm = function(message) {
        return $q.when(window.confirm(message || 'Is it ok?'));
    }
}