# Sahara offline Aluva map

`aluva.osm` contains OpenStreetMap road data within approximately 5 km of central Aluva, Kerala (10.1076, 76.3516). It was exported through the Overpass API for offline use.

OpenStreetMap data is © OpenStreetMap contributors and is available under the Open Database License (ODbL): https://www.openstreetmap.org/copyright

The application reads this local file, extracts walkable highways, builds an in-memory graph, and calculates routes locally with A*. It does not contact a tile server or routing API at runtime.
