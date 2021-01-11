mapboxgl.accessToken = 'pk.eyJ1IjoiZHJhY2xpZ2h0IiwiYSI6ImNramswY2FiaDl5N2oycWxia2N5cmNxc3IifQ.yQMl4nh6wdmh75dHTyP3pg';

var tabElevation = [];
var tabPoint = [];

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
});

function successLocation(position) {
    setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation(){
    setupMap([2.295753,49.894067])
}

function setupMap(center){
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center, center,
        zoom: 13
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken
    });

    map.addControl(directions, "top-left");

    directions.on('route', function(e) {
        tabElevation = [];
        tabPoint = [];

        var route = e.route[0];
        var leg = route.legs[0];
        var steps = leg.steps;

        hideCanvas();

        steps.forEach(function (step, i) {
            var location = step.maneuver.location;
            
            var query = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/' + location[0] + ',' + location[1] + '.json?layers=contour&limit=50&access_token=' + mapboxgl.accessToken;
            $.ajax({
                method: 'GET',
                url: query,
            }).done(function(data) {
                // Get all the returned features
                var allFeatures = data.features;
                // Create an empty array to add elevation data to
                var elevations = [];
                // For each returned feature, add elevation data to the elevations array
                for (i = 0; i < allFeatures.length; i++) {
                    elevations.push(allFeatures[i].properties.ele);
                }
                // In the elevations array, find the largest value
                highestElevation = Math.max(...elevations);
                // Display the largest elevation value
                tabElevation.push(highestElevation);
                tabPoint.push(step.name);
            });  
        });

        snackbarShow();
    });
}

function affichage(){
    //cache la snackbar
    snackbarHide();

    //affiche le graphique
    showCanvas();

    //affectation graphique
    var canvas = document.getElementById('myChart');
    var myChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: tabPoint,
            datasets: [{
                label: 'Altitude by ft',
                data: tabElevation,
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

    window.scrollTo(0, findPosition(document.getElementById("canvas")));
}

function showCanvas(){
    var canvas = document.getElementById('canvas');
    canvas.hidden = false;
}

function hideCanvas(){
    var canvas = document.getElementById('canvas');
    canvas.hidden = true;
    //var context = canvas.getContext('2d');
    //context.clearRect(0, 0, canvas.width, canvas.height);
}

function snackbarShow() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";
}

function snackbarHide() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "hide";
}

function findPosition(obj) { 
    var currenttop = 0; 
    if (obj.offsetParent) { 
        do { 
            currenttop += obj.offsetTop; 
        } while ((obj = obj.offsetParent)); 
        return [currenttop]; 
    } 
}