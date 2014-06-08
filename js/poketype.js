function Poketype () {
    this.species;
    this.typing = [];
    this.abilities = [];
}

Poketype.prototype.apiCall = function(uri, callback) {
    var self = this;
    var endpt = 'http://pokeapi.co/' + uri;
    var obj = $.ajax({
        'url'           : endpt,
        'contentType'   : 'application/json',
        'type'          : 'GET',
        'dataType'      : 'jsonp',
        'success'       : function(response) {
                              callback(response);
                          },
        'error'         : function() {
                              self.callFail();
                          }
    });

    return obj;
};

Poketype.prototype.callFail = function() {
    console.log('NOPE');
};

Poketype.prototype.speciesList = function() {
    return this.apiCall('api/v1/pokedex/1/');
}