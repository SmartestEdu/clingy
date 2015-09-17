import Clingy from 'Clingy';

class ClingyProvider {
    constructor() {
        this.$get = [
            '$rootScope',
            '$window',
            function(
                $rootScope,
                $window
            ) {
                return new Clingy(
                    $rootScope,
                    $window,
                    this
                );
            }
        ];
        this.listenForStateChange = false;
        this.listenForWindowUnload = true;
    }

    setListenForStateChange(listenForStateChange) {
        this.listenForStateChange = listenForStateChange;

        return this;
    }

    setListenForWindowUnload(listenForWindowUnload) {
        this.listenForWindowUnload = listenForWindowUnload;

        return this;
    }
}

angular.module('clingy', []).provider(
    'clingy',
    ClingyProvider
);
