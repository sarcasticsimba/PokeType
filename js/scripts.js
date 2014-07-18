/*
    Main script to PokéType:
        - Constructs and populates elements on:
            - load (dropdown)
            - form submission (text field, search button, dropdown,
              Pokémon info and type calculations)
            - button click (creates the modal)
        - Contains some helper functions to make the $(document).ready() function
          slightly more readable

    Vignesh Kalidas, 2014
*/

$(document).ready(function() {
    var pkmn = new Poketype();

    var search = $('#search-field').focus();

    $('.searching').submit(function(e){
        e.preventDefault();
        var cb = function(response) {
            buildInfoBox(pkmn, response);
        }

        // Getting the pokemon info via an API call
        if(isNaN(parseInt(search.val()))) {
            pkmn.makeApiCall('api/v1/pokemon/' + search.val().toLowerCase() + '/', cb);
        } else {
            pkmn.makeApiCall('api/v1/pokemon/' + search.val() + '/', cb);
        }
    });
});

/*-------------------------- END of $('document').ready(...) --------------------------*/
/*-------------------------- Helper functions below -----------------------------------*/

function buildInfoBox(pkmn, response) {
    pkmn.species = response.name;
    pkmn.typing = response.types;
    pkmn.abilities = response.abilities;

    // Getting the sprite via an API call
    pkmn.makeApiCall(response.sprites[0].resource_uri, function(reply){
        $('#sprite').empty().append('<img src="http://pokeapi.co' + reply.image + '" />')
    });
    $('#species-name').empty().append(response.name.toUpperCase().split('').join(' '));
    var abs = [];
    for(var i = 0; i < response.abilities.length; i++) {
        abs.push(capitalizeFirstLetterAndRemoveDashes(response.abilities[i].name));
    }

    $('#abilities').empty().append('Abilities: ');
    for(var j = 0; j < abs.length; j++) {
        var comma = (j == 0)? '' :', ';
        $('#abilities').append(comma + '<a onclick="window.open(this.href); return false;" onkeypress="window.open(this.href); return false;" href="http://bulbapedia.bulbagarden.net/wiki/'+ abs[j].split(' ').join('_') + '_(Ability)">' + abs[j] + '</a>')
    }
    
    $('#content').removeAttr('style');
    $('#intro').hide();
    assignTypes(response);
    calculateTypeEffectiveness(pkmn, response);
}

function calculateTypeEffectiveness(pkmn, response) {
    var weaknesses = {
        fourx   :  [],
        twox    :  [],
        onex    :  typesList,
        halfx   :  [],
        qtrx    :  [],
        zerox   :  []
    }

    for(var i = 0; i < pkmn.typing.length; i++) {
        weaknesses.twox = weaknesses.twox.concat(effectiveness[pkmn.typing[i].name].super_effective);
        weaknesses.halfx = weaknesses.halfx.concat(effectiveness[pkmn.typing[i].name].not_very_effective);
        weaknesses.zerox = weaknesses.zerox.concat(effectiveness[pkmn.typing[i].name].immune);
    }


//  Sorts weaknesses arrays
    for(i in weaknesses){
        weaknesses[i].sort();
    }

//  Checking for immunities
    for(var i = 0; i < weaknesses.zerox.length; i++) {
        var imm = weaknesses.zerox[i];

        if(weaknesses.twox.indexOf(imm) !== -1) {
            weaknesses.twox.splice(weaknesses.twox.indexOf(imm), 1);
        }

        if(weaknesses.halfx.indexOf(imm) !== -1) {
            weaknesses.halfx.splice(weaknesses.halfx.indexOf(imm), 1);
        }

    }

//  Checking for x4
    weaknesses.twox.pushDuplicatesTo(weaknesses.fourx);
    weaknesses.twox.removeMatchingElementsFrom(weaknesses.fourx);

//  Checking for x0.25
    weaknesses.halfx.pushDuplicatesTo(weaknesses.qtrx);
    weaknesses.halfx.removeMatchingElementsFrom(weaknesses.qtrx);

//  Checking x2 versus x0.5
    Array.removeMatchingElementsAndStoreIn(weaknesses.twox, weaknesses.halfx, weaknesses.onex);

//  Sort and remove duplicates from x1
    weaknesses.onex.sort();
    weaknesses.onex = weaknesses.onex.removeDuplicates();

// //  Remove stuff from x1 that's in other columns
    for(i in weaknesses){
        if(i !== 'onex'){
            for(var j = 0; j < weaknesses[i].length; j++){
                if(weaknesses.onex.indexOf(weaknesses[i][j]) !== -1){
                    weaknesses.onex.splice(weaknesses.onex.indexOf(weaknesses[i][j]), 1);
                }
            }
        }
    }

    $('#super').empty();
    $('#normal').empty();
    $('#not-very').empty();
    $('#immune').empty();

    for(var i = 0; i < weaknesses.fourx.length; i++) {
        $('#super').append('<li style=color:' + typeColors[weaknesses.fourx[i]] + ';>' + capitalizeFirstLetterAndRemoveDashes(weaknesses.fourx[i]) + '    <span style="font-weight: normal">(x4)</span></li>');
    }
    for(var i = 0; i < weaknesses.twox.length; i++){
        $('#super').append('<li style=color:' + typeColors[weaknesses.twox[i]] + ';>' + capitalizeFirstLetterAndRemoveDashes(weaknesses.twox[i]) + '    <span style="font-weight: normal">(x2)</span></li>');
    }
    for(var i = 0; i < weaknesses.onex.length; i++){
        $('#normal').append('<li style=color:' + typeColors[weaknesses.onex[i]] + ';>' + capitalizeFirstLetterAndRemoveDashes(weaknesses.onex[i]) + '</li>');
    }
    for(var i = 0; i < weaknesses.qtrx.length; i++){
        $('#not-very').append('<li style=color:' + typeColors[weaknesses.qtrx[i]] + ';>' + capitalizeFirstLetterAndRemoveDashes(weaknesses.qtrx[i]) + '    <span style="font-weight: normal">(x0.25)</span></li>');
    }
    for(var i = 0; i < weaknesses.halfx.length; i++){
        $('#not-very').append('<li style=color:' + typeColors[weaknesses.halfx[i]] + ';>' + capitalizeFirstLetterAndRemoveDashes(weaknesses.halfx[i]) + '    <span style="font-weight: normal">(x0.5)</span></li>');
    }
    for(var i = 0; i < weaknesses.zerox.length; i++){
        $('#immune').append('<li style=color:' + typeColors[weaknesses.zerox[i]] + ';>' + capitalizeFirstLetterAndRemoveDashes(weaknesses.zerox[i]) + '</li>');
    }
}

function assignTypes(info) {
    $('#typing').empty();
    $('#type1').empty();
    $('#type2').empty();
    if(info.types.length == 1) {
        $('#typing').append('<span id="type1">' + info.types[0].name.toUpperCase() + '</span>');
        $('#type1').css('color', typeColors[info.types[0].name]);
    } else {
        $('#typing').append('<span id="type1">' + info.types[0].name.toUpperCase() + '</span> / <span id="type2">' + info.types[1].name.toUpperCase() + '</span>');
        $('#type1').css('color', typeColors[info.types[0].name]);
        $('#type2').css('color', typeColors[info.types[1].name]);
    }
}

function capitalizeFirstLetterAndRemoveDashes(string) {
    // console.log(string)
    var s = string.replace(/-/, ' ');
    s = s.split(' ');

    for(var i = 0; i < s.length; i++) {
        s[i] = s[i].charAt(0).toUpperCase() + s[i].slice(1);
    }

    return s.join(' ');
}