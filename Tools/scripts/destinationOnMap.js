let macarte;

// On s'assure que la page est chargée
window.onload = function(){
    // On initialise la carte sur les coordonnées GPS de Paris
    macarte = L.map('carte').setView([48.852969, 2.349903], 13)

    // On charge les tuiles depuis un serveur au choix, ici OpenStreetMap France
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte)

    // Cette méthode est à insérer juste après avoir initialisé la carte
    L.Routing.control({
        // Nous personnalisons le tracé
        lineOptions: {
            styles: [{color: '#ff8f00', opacity: 1, weight: 7}]
        },
    
        // Nous personnalisons la langue et le moyen de transport
        router: new L.Routing.osrmv1({
            language: 'fr',
            profile: 'car', // car, bike, foot
        }),
    
        geocoder: L.Control.Geocoder.nominatim()
    }).addTo(macarte)
}