let macarte, marqueur;
var tabDestination = [];
var tabAlt = [];

// On s'assure que la page est chargée
window.onload = function(){
    // On initialise la carte sur les coordonnées GPS de Paris
    macarte = L.map('carte').setView([48.852969, 2.349903], 8)

    // On charge les tuiles depuis un serveur au choix, ici OpenStreetMap France
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte)

    document.querySelector('#loadChart').addEventListener('click', Chart);

    // Cette méthode est à insérer juste après avoir initialisé la carte
    var routing = L.Routing.control({
        // Nous personnalisons le tracé
        lineOptions: {
            styles: [{color: '#ff8f00', opacity: 1, weight: 7}]
        },
    
        // Nous personnalisons la langue et le moyen de transport
        router: new L.Routing.osrmv1({
            language: 'fr',
            profile: 'bike', // car, bike, foot
        }),
    
        geocoder: L.Control.Geocoder.nominatim()
    }).addTo(macarte)

    routing.on("routesfound", function(e) {
        var tab = e.waypoints;
        for (let i = 0; i < tab.length; i++) {
            var destination = tab[i].name.split(',');
            tabDestination[i] = destination[0];
        }
        console.log(tabDestination);
    });

}

function Chart(){
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tabDestination,
            datasets: [{
                label: 'Altitude',
                data: [2, 5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}