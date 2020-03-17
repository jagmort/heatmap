var address = {'пустой': [0, 0]};

ymaps.ready(init);

function init(){
    var myMap = new ymaps.Map("map", {
        center: [55.85, 51.52],
        zoom: 6
    });
    ymaps.modules.require(['Heatmap'], function (Heatmap) {
        heatmap = new Heatmap([]);
        heatmap.options.set('radius', 10);
        heatmap.options.set('gradient', {'0.1': 'orange', '0.9': 'red'});
        heatmap.setMap(myMap);
    });

    var regions = ["Кировская область", "Марий Эл", "Мордовия", "Нижегородская область", "Оренбургская область", "Пензенская область", "Самарская область", "Саратовская область", "Удмуртия", "Ульяновская область", "Чувашия", "Татарстан", "Башкортостан"];
    regions.forEach((reg) => {
        ymaps.geoQuery(ymaps.regions.load("RU", {lang: "ru",  quality: 3})).search('properties.hintContent = "' + reg + '"').setOptions('fillOpacity', 0.2).setOptions('strokeOpacity', 0.2).addToMap(myMap);
    })
}

setInterval(function() {
    var url = 'address.txt';
    var storedText;

    fetch(url)
      .then(function(response) {
        response.text().then(function(text) {
          storedText = text;
          done();
        });
      });

    function done() {
        addr = storedText.split(/\n/);
        var count = addr.length - 2;
        var data = [];
        addr.forEach((element) => {
            if(element !== '') {
                if(address.hasOwnProperty(element)) {
                    data.push(address[element]);
                    count--;
                }
                else {
                    var coords = getCoords(element);
                    if(coords['error'] === 'OK') {
                        address[element] = [coords['lat'], coords['long']];
                        data.push(address[element]);
                        count--;
                    }
                    else {
                        var myGeocoder = ymaps.geocode('Приволжский федеральный округ ' + element);
                        myGeocoder.then(function(res) {
                            address[element] = res.geoObjects.get(0).geometry.getCoordinates();
                            console.log((count * 1 + 1.0) + ': ' + element + ' ' + address[element][0] + ', ' + address[element][1]);
                            putCoords(element, address[element][0], address[element][1]);
                            data.push(address[element]);
                            count--;
                        });
                    }
                }
                if(count <= 0) {
                    heatmap.setData(data);
                }
            }
            else {
                count--;
            }
        });
    }
}, 30000);

function getCoords(addr) {
    var request = new XMLHttpRequest();
    request.open('GET', "addr.php?addr=" + encodeURIComponent(addr), false); 
    request.send(null);

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    }
}

function putCoords(addr, lat, long) {
    var request = new XMLHttpRequest();
    request.open('GET', "addr.php?addr=" + encodeURIComponent(addr) + '&' + 'lat=' + encodeURIComponent(lat) + '&' + 'long=' + encodeURIComponent(long), false); 
    request.send(null);

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    }
}
