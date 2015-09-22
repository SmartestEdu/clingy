class Clingy {
    constructor(
        $rootScope,
        $window,
        clingyProvider
    ) {
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.clingies = [];
        this.clingyProvider = clingyProvider;
        this.eventIsBoundForState = false;
        this.eventIsBoundForWindow = false;
        this.unregisterRootScopeListener = angular.noop;
    }

    addEventListeners() {
        if (
            false === this.eventIsBoundForWindow &&
            true === this.clingyProvider.listenForWindowUnload
        ) {
            this.$window.onbeforeunload = this
                .pleaseDontLeaveMe
                .bind(this)
            ;
            this.eventIsBoundForWindow = true;
        }

        if (
            false === this.eventIsBoundForState &&
            true === this.clingyProvider.listenForStateChange
        ) {
            this.unregisterRootScopeListener = this
                .$rootScope
                .$on(
                    '$stateChangeStart',
                    this.pleaseDontLeaveMe.bind(this)
                )
            ;
            this.eventIsBoundForState = true;
        }
    }

    cling(message) {
        var clingy;
        var clingyId = this.generateUniqueId();

        if ('string' !== typeof message) {
            throw new TypeError(
                'Invalid message provided. You can\'t tell me to cling to ' +
                'something without telling me what to say!'
            );
        }

        clingy = {
            id: clingyId,
            breakup: function() {
                this.clingies = this.clingies.filter(
                    (clingy) => clingy.id !== clingyId
                );

                if (false === this.isClingy()) {
                    this.removeEventListeners();
                }
            }.bind(this),
            message: message,
        };

        this.clingies.push(clingy);

        this.addEventListeners();

        return clingy.breakup;
    }

    generateUniqueId() {
        return [
            new Date().getTime(),
            Math.round(
                Math.random() * 1e6
            ),
        ].join('.');
    }

    isClingy() {
        return 0 !== this.clingies.length;
    }

    pleaseDontLeaveMe(event) {
        var iCantQuitYou;
        var messages = [];

        if (false === this.isClingy()) {
            return;
        }

        this
            .clingies
            .forEach((clingy) => {
                if (-1 === messages.indexOf(clingy.message)) {
                    messages.push(clingy.message);
                }
            })
        ;

        if (1 === messages.length) {
            messages = messages
                .join('')
            ;
        } else {
            messages = messages
                .map((message) => '• ' + message)
                .join('\n')
            ;
        }

        if ('$stateChangeStart' === event.name) {
            iCantQuitYou = !confirm(messages);

            if (true == iCantQuitYou) {
                event.preventDefault();
            }

            return iCantQuitYou;
        }

        return messages;
    }

    removeEventListeners() {
        this.$window.onbeforeunload = undefined;
        this.unregisterRootScopeListener();
        this.eventIsBoundForState = false;
        this.eventIsBoundForWindow = false;
    }
}

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
