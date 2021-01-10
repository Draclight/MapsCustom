
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

    directions.on('route', function(e){

        tabElevation = [];
        tabPoint = [];

        var route = e.route[0];
        var leg = route.legs[0];
        var steps = leg.steps;

        steps.forEach(function (step, i) {
            
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
    });
}

function getElevation(lng, lat) {
    // make API request
    var query = 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/' + lng + ',' + lat + '.json?layers=contour&limit=50&access_token=' + mapboxgl.accessToken;
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
        return parseFloat(highestElevation);
    });
}

function clearCanvas(){
    var canvas = document.getElementById('myChart');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function affichage(){

        clearCanvas()

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
        document.getElementById('canvas').hidden = false;
}

function myFunction() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }