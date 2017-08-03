# Neighbourhood map app

__This project is meant to show a couple of nice places to go out in the beautiful city of Sibiu in Romania.__

## APIS that have been used

  - Google maps JavaScript API
  - Flickr image search API


### Present elements in the app:
  - 9 markers representing bars and restaurants
  - Center Map button
  - Input search field for list filtering
 
- - -
### How to get arround the map
- the entire project needs to run locally(localhost) and setting up a local server can be done by using Python like so: 
__Python 3__ :
-- python -m http.server 8080
__Python 2__ :
--python -m SimpleHTTPServer 8080

- click the index.html file to open the page or click the following link to access it online: https://zimann.github.io/Neighborhood-map/
- clicking the __hamburger button__ will slide in a full linked list of the represented places
- clicking a marker will display a facebook link for that place and an image within roughly the same context will be fetched and placed alongside it.
- clicking a list item on the left will automatically take us to that marker and the information window will appear
- list filtering is done simply by typing a corresponding name from the list, this will also hide any marker that does not match the search
- centering the map is done by clicking the "Center Map" button on top



### Other libraries/frameworks used
- jQuery
- Knockout


