//function that will be passed to the "onerror" attribute in the script that calls the google map
function gmapsErrorHandling() {
    alert('Google maps are unavailable right now, try refreshing the page!');
}

//Google MAPS function handling
//our initial city zone
var initialLat = 45.797321;
var initialLng = 24.148644;

var restaurantMarkers = [];
var barMarkers = [];
var totalMarkers = [];
var map = "";

//----------------------------------------JSON data fetching-------------------------------------------------------------------

//styles variable to hold all the information about the style of the map
var styles;

//styles copied from : "https://snazzymaps.com/explore?text=blue&color=blue&page=2"

function fetchFunction(){
    fetch('js/styles.json').then(function(response) {
    if (response.status !== 200) {
        alert('A problem occured while trying to load the JSON data, please refresh the page');
        return;
    }
    response.json().then(function(data) {
            //assign the obtained data to our "styles" variable
            styles = data;
        //call the initMap function here to be sure it only gets invoked after having the JSON data
        initMap();
        })
        .catch(function(error) {
            alert(' JSON Request failed. Please refresh the page');
        });
    });
}

//------------------------------------------------------------------------------------------------------------------------------

function initMap() {

        //code copied from: "https://stackoverflow.com/questions/15421369/responsive-google-map" to make the map responsive
        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });


        //Creating our map
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: initialLat,
                lng: initialLng
            },
            scrollwheel: true,
            zoom: 15,
            streetViewControl: false,
            disableDefaultUI: true,
            styles: styles
        });

        var barPlaces = [{
                title: 'Music Pub',
                location: {
                    lat: 45.7985787,
                    lng: 24.1517972
                },
                facebookLink: 'https://www.facebook.com/MusicPubSibiu/',
                type: 'pub'
            },
            {
                title: 'Kultur Cafe',
                location: {
                    lat: 45.7980599,
                    lng: 24.1510961
                },
                facebookLink: 'https://www.facebook.com/KulturacfeSigi/',
                type: 'pub'
            },
            {
                title: 'Cafe Einstein',
                location: {
                    lat: 45.7978234,
                    lng: 24.1492921
                },
                facebookLink: 'https://www.facebook.com/einsteincafe2008/',
                type: 'pub'
            },
            {
                title: 'Nod Pub',
                location: {
                    lat: 45.79825839999999,
                    lng: 24.1520637
                },
                facebookLink: 'https://www.facebook.com/nod.pub/',
                type: 'pub'
            },
            {
                title: 'Lili\'s Cafe',
                location: {
                    lat: 45.7979433,
                    lng: 24.152176
                },
                facebookLink: 'https://www.facebook.com/LilisSibiu/',
                type: 'pub'
            }
        ];

        var restaurantPlaces = [{
                title: 'Crama Sibiana',
                location: {
                    lat: 45.79791609999999,
                    lng: 24.151994
                },
                facebookLink: 'https://www.facebook.com/CramaSibiana/',
                type: 'pizza'
            },
            {
                title: 'Delis',
                location: {
                    lat: 45.7981077,
                    lng: 24.1521138
                },
                facebookLink: 'https://www.facebook.com/DelisRestaurant/',
                type: 'pizza'
            },
            {
                title: 'Go In',
                location: {
                    lat: 45.7973671,
                    lng: 24.1508156
                },
                facebookLink: 'https://www.facebook.com/pages/Go-In/174974039217322',
                type: 'pizza'
            },
            {
                title: 'Kulinarium',
                location: {
                    lat: 45.797723,
                    lng: 24.151169
                },
                facebookLink: 'https://www.facebook.com/kulinarium.sibiu/',
                type: 'pizza'
            }
        ];


        //create a google maps Info Window
        var largeInfoWindow = new google.maps.InfoWindow();

        //create holder variables for the url that will be passed as a source for the picture inside the infoWindow
        var farm;
        var id;
        var secret;
        var server;
        var pictureUrl;
        //flickr API key
        var flickrAPIKey = '7dea4bd689af723bce90bcea3987ea9c';

        //function declaration zone with the purpose of just calling them inside our loops without actually creating a new function on every iteration

        //------------------------------------------------------------------------------------------------------------------------------------------

        //constructor function to be called while executing the loop for creating every marker
        function markerCreation() {
            var latlng = {
                lat: marker.position.lat(),
                lng: marker.position.lng()
            };
            map.panTo(latlng);
        }


        //ajax infoWindow bar information display
        function infoWindowBarContent() {

            var keywords = marker.title;
            var closureMarkerBar = marker;

            return function() {
                $.ajax({
                    type: 'GET',
                    url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickrAPIKey + '&text=' + keywords + '&format=json&nojsoncallback=1',
                    success: function(data) {
                        //generated a random number to use for different indexes to grab different pictures
                        var randomNumberBar = Math.floor(Math.random() * 10);
                        console.log(randomNumberBar);
                        farm = data.photos.photo[randomNumberBar].farm;
                        id = data.photos.photo[randomNumberBar].id;
                        secret = data.photos.photo[randomNumberBar].secret;
                        server = data.photos.photo[randomNumberBar].server;

                        //store the picture url in the "pictureUrl" just to have this part modified, when the setContent method of the infoWindow runs
                        pictureUrl = "http://farm" + farm + ".staticflickr.com/" + server + "/" + id + "_" + secret + ".jpg";
                        //populate the infoWindow with information about the clicked marker
                        populateInfoWindow(closureMarkerBar, largeInfoWindow);

                    },
                    error: function(error) {
                        alert('Sorry, the data could not be retrieved, please refresh the page');
                    }
                });
            };
        }

        //ajax infoWindow restaurant information display
        function infoWindowRestaurantContent() {
            var keywords = restaurantMarker.title;
            var closureMarkerRestaurant = restaurantMarker;

            return function() {
                $.ajax({
                    type: 'GET',
                    url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickrAPIKey + '&text=' + keywords + '&format=json&nojsoncallback=1',
                    success: function(data) {
                        var randomNumberRestaurant = Math.floor(Math.random() * 10);
                        farm = data.photos.photo[randomNumberRestaurant].farm;
                        id = data.photos.photo[randomNumberRestaurant].id;
                        secret = data.photos.photo[randomNumberRestaurant].secret;
                        server = data.photos.photo[randomNumberRestaurant].server;
                        pictureUrl = "http://farm" + farm + ".staticflickr.com/" + server + "/" + id + "_" + secret + ".jpg";

                        populateInfoWindow(closureMarkerRestaurant, largeInfoWindow);

                    },
                    error: function(error) {
                        alert('Sorry, the data could not be retrieved, please refresh the page');
                    }
                });
            };
        }


        //color change on hover for the blue markers
        function blueHover() {
            this.setIcon(hoveredIcon);
        }

        //change color of the marker back to blue when having the mouse cursor out
        function blueOut() {
            this.setIcon(blueMarkerIcon);
        }

        //color change on hover for the red markers
        function redHover() {
            this.setIcon(darkRedMarkerIcon);
        }
        //change color of the marker back to red when having the mouse cursor out
        function redOut() {
            this.setIcon(redMarkerIcon);
        }
        //-----------------------------------------------------------------------------------------------------------------------------------------


        //function that changes our initial marker color
        function createMarkerIcon(markerColor) {
            //sample marker image url copied from the course lectures
            var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
                new google.maps.Size(21, 34),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 34),
                new google.maps.Size(21, 34));
            return markerImage;
        }

        var blueMarkerIcon = createMarkerIcon('73C2FF');
        var hoveredIcon = createMarkerIcon('F39C12');
        var redMarkerIcon = createMarkerIcon('F75448');
        var darkRedMarkerIcon = createMarkerIcon('c0392b');



        // picture where the image of the city will be displayed on click
        //loop to display the bar places (blue markers)
        for (var i = 0; i < barPlaces.length; i++) {
            var position = barPlaces[i].location;
            var title = barPlaces[i].title;
            var content = barPlaces[i].facebookLink;
            var marker = new google.maps.Marker({
                map: map,
                position: position,
                title: title,
                content: content,
                icon: blueMarkerIcon,
                animation: google.maps.Animation.DROP,
                id: i
            });


            barMarkers.push(marker);
            totalMarkers.push(marker);

            marker.addListener('click', (infoWindowBarContent)());

            marker.addListener('click', markerCreation);


            //add two event listeners below for every created marker to change its color on hover
            marker.addListener('mouseover', blueHover);

            marker.addListener('mouseout', blueOut);

            //add listener to run the function  that will make the marker bounce on click
            marker.addListener('click', toggleBounce(marker));
        }


        //loop to display the restaurant places (red markers);
        for (var j = 0; j < restaurantPlaces.length; j++) {
            var restaurantPosition = restaurantPlaces[j].location;
            var restaurantTitle = restaurantPlaces[j].title;
            var restaurantContent = restaurantPlaces[j].facebookLink;

            var restaurantMarker = new google.maps.Marker({
                map: map,
                position: restaurantPosition,
                title: restaurantTitle,
                content: restaurantContent,
                icon: redMarkerIcon,
                animation: google.maps.Animation.DROP,
                id: j
            });
            //push the marker in the restaurantMarkers array for later use
            restaurantMarkers.push(restaurantMarker);

            //push the marker in another array where we will have all markers on the map , regardless of their type
            totalMarkers.push(restaurantMarker);

            restaurantMarker.addListener('click', (infoWindowRestaurantContent)());

            restaurantMarker.addListener('click', markerCreation);

            restaurantMarker.addListener('mouseover', redHover);

            restaurantMarker.addListener('mouseout', redOut);

            restaurantMarker.addListener('click', toggleBounce(restaurantMarker));
        }


        //code pasted from "https://developers.google.com/maps/documentation/javascript/examples/marker-animations"
        function toggleBounce(marker) {

            //function written to return a function for closure purposes, to have the click event tied to each and every point of interest on the map
            return function() {
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);

                    //setting up a time-out to stop the marker from continuously bouncing after clicking on it; the value of the miliseconds accounts for exact 2 marker jumps
                    setTimeout(function() {
                        marker.setAnimation(null);
                    }, 1400);
                }
            };
        }
        //populate the info window with the information about the clicked place
        function populateInfoWindow(marker, infowindow) {
            if (infowindow.marker != marker) {
                infowindow.marker = marker;

                infowindow.setContent('<div class="infoWindow-title">' + marker.title + '</div>' +
                    '<img alt="Picture of the place" class="place-picture" src="' + pictureUrl + '"' + '>' +
                    '<div class="infoWindow-content">Check out their facebook page: <a class="facebookLink" href="' + marker.content + '"' + 'target="_blank">' + marker.content + '</a></div>&nbsp<div>Powered by: <a class="api-mention" href="https://www.flickr.com/" target="_blank"><b>Flickr</b></a></div>');

                //                    if the "pictureUrl" does not get the values loaded from the ajax request on click, we will display an alert prompting the user to click another marker

                infowindow.open(map, marker);
            }
        }

        //    function that is responsible for resetting the map position to its default values
        function setCenter(newLat, newLng) {
            map.setCenter({
                lat: newLat,
                lng: newLng,
            });
            map.setZoom(15);
        }


        //---------Knockout.JS related part below-------------------------------------------------------------------------------------
        var barReferenceMarkers = barMarkers;
        var restaurantReferenceMarkers = restaurantMarkers;

        var MyViewModel = function() {
            var self = this;
            self.restaurantItems = restaurantReferenceMarkers;
            self.barItems = barReferenceMarkers;

            //make the corresponding marker active by bouncing and having the infoWindow opened by referring to its own click event
            self.listClick = function(listItem) {
                google.maps.event.trigger(listItem, 'click');
            };

            //returning the setCenter function with the default values for latitude and longitude
            self.centerMap = function() {
                return setCenter(45.797321, 24.148644);
            };

            //    //Css class toggling with Knockout - trigger building for control flow

            //first set of trigger to show specific classes
            self.trigger = ko.observable(false);
            //second set of trigger to hide specific classes
            self.trigger2 = ko.observable(true);

            self.clicker = function() {
                self.trigger(!self.trigger());
                self.trigger2(!self.trigger2());
            };


            //inspiration for this last part was drawn from this post: "https://stackoverflow.com/questions/36272535/connecting-list-view-in-knockout-js-with-map-markers"
            self.restaurantPlaces = ko.observableArray(restaurantReferenceMarkers);
            self.barPlaces = ko.observableArray(barReferenceMarkers);
            //store the input of the user
            self.userInput = ko.observable('');
            //check for input that matches names in the restaurant marker array
            self.checkRestaurantItems = ko.computed(function() {
                return ko.utils.arrayFilter(self.restaurantPlaces(), function(listItem) {
                    return listItem.title.toLowerCase().indexOf(self.userInput().toLowerCase()) >= 0;
                });
            });
            //check for input that matches names in the bar marker array
            self.checkBarItems = ko.computed(function() {
                return ko.utils.arrayFilter(self.barPlaces(), function(listItem) {
                    return listItem.title.toLowerCase().indexOf(self.userInput().toLowerCase()) >= 0;
                });
            });
            //hide the bar markers on user input for the elements that do not match
            self.hideBarMarkers = ko.computed(function() {
                return ko.utils.arrayFilter(self.barPlaces(), function(listItem) {
                    var indexCheck = listItem.title.toLowerCase().indexOf(self.userInput().toLowerCase());
                    if (indexCheck === -1) {
                        listItem.setVisible(false);
                        largeInfoWindow.close();
                    } else {
                        listItem.setVisible(true);
                    }
                });
            });
            //hide the restaurant markers on user input;
            self.hideRestaurantMarkers = ko.computed(function() {
                return ko.utils.arrayFilter(self.restaurantPlaces(), function(listItem) {
                    var indexCheck = listItem.title.toLowerCase().indexOf(self.userInput().toLowerCase());
                    if (indexCheck === -1) {
                        listItem.setVisible(false);
                    } else {
                        listItem.setVisible(true);
                    }
                });
            });

        }.bind(this);

        //apply binding for our ViewModel
        ko.applyBindings(MyViewModel());

}