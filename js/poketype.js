function Poketype () {
    this.species;
    this.typing = [];
    this.abilities = [];
}

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