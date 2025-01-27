const jeunameField = document.querySelector('#jeu-name');
const jeuDescriptionField = document.querySelector('#jeu-description');
const addJeuForm = document.querySelector('#add-jeu-form');

addJeuForm.addEventListener('submit', evt => {
    evt.preventDefault();
    const payload = {
        // 9.1 Infrastructure
        id: Date.now(),
        name: jeunameField.value,
        description: jeuDescriptionField.value,
    }

    //9.3 Branchement de notre Bdd Firebase
    fetch('https://us-central1-pwa-appgame.cloudfunctions.net/addJeu', { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(resp => {
            console.log('resp to post to /jeux', resp);
        })
        // 9.1 Infrastructure
        .catch(() => {
            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                console.log('SyncManager supported by browser');
                console.log('we are probably offline');
                navigator.serviceWorker.ready.then(registration => {
                    // put jeu in IndexedDB for later syncing
                    return putJeu(payload, payload.id).then(() => {
                        // register a sync with the ServiceWorker
                        return registration.sync.register('sync-jeux')
                    });
                })
            } else {
                // TODO browser does NOT support SyncManager: send data to server via ajax
                console.log('SyncManager NOT supported by your browser');
            }
        })
        .then(() => {
            clearForm();
        })
        .catch(error => console.error(error));

        // 9.1 Infrastructure
        const clearForm = () => {
            jeunameField.value = '';
            jeuDescriptionField.value = '';
            jeunameField.focus();
        }; 
})