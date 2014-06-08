/*
    PokéType Object has two useful functions:
        - makeApiCall() takes parameters:
            - URI to make an AJAX call to make resource-grabbing simpler
            - Callback function to perform some action on the retrieved data
        - speciesList() takes no parameters and returns the resource provided by
          a GET call to the pokedex part of the API

    Vignesh Kalidas, 2014
*/

function Poketype () {}

Poketype.prototype.makeApiCall = function(uri, callback) {
    var self = this;
    var api_uri = 'http://pokeapi.co/' + uri;
    var obj = $.ajax({
        'url'           : api_uri,
        'contentType'   : 'application/json',
        'type'          : 'GET',
        'dataType'      : 'jsonp',
        'success'       : function(response) {
                              callback(response);
                          }
    });

    return obj;
};

Poketype.prototype.speciesList = function() {
    return this.apiCall('api/v1/pokedex/1/');
}