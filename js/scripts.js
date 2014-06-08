$(document).ready(function() {
    var pkmn = new Poketype();
    var data;
    var image;
    var types;

    populateSelect(pkmn);

    // jQueryUI Elements
    var search = $('#search-field').focus();

    $('#SearchSubmitButton').button({label:'Submit'});

    $('#HelpButton').button().click(function(){
        $('#help-modal').dialog({ modal: true,
                                  title: 'Help',
                                  width:  500});
        $(this).blur();
    }).tooltip({
        show: null,
        position: {
        my: "left top",
        at: "left bottom"},
        open: function( event, ui ) {
            ui.tooltip.animate({ top: ui.tooltip.position().top + 10 }, "fast" );
        }
    });

    $('.searching').submit(function(e){
        e.preventDefault();
        var cb = function(response) {
            buildInfoBox(pkmn, response);
        }

        if(isNaN(parseInt(search.val()))) {
            pkmn.makeApiCall('api/v1/pokemon/' + search.val().toLowerCase() + '/', cb);
        } else {
            pkmn.makeApiCall('api/v1/pokemon/' + search.val() + '/', cb);
        }
    });

    $('select').on('change', function(){
        pkmn.makeApiCall('api/v1/pokemon/' + $(this).val() + '/', function(response){
            $('#help-modal').dialog('close');
            $('#HelpButton').blur();
            buildInfoBox(pkmn, response);
        });
    });
});

function buildInfoBox(pkmn, response) {
    pkmn.species = response.name;
    pkmn.typing = response.types;
    pkmn.abilities = response.abilities;

    pkmn.makeApiCall(response.sprites[0].resource_uri, function(reply){
        $('#sprite').empty().append('<img src="http://pokeapi.co' + reply.image + '" />')
    });
    $('#species-name').empty().append(response.name.toUpperCase().split('').join(' '));
    var abs = [];
    for(i in response.abilities) {
        abs.push(capitalizeFirstLetterAndRemoveDashes(response.abilities[i].name));
    }
    $('#abilities').empty().append('Abilities: ' + abs.join(', '));
    $('#content').removeAttr('style');
    $('#intro').hide();
    assignTypes(response);
    calculateTypeEffectiveness(pkmn, response);
}

function calculateTypeEffectiveness(pkmn, response) {
    var weaknesses = {
        fourx   :  [],
        twox    :  [],
        onex    :  [],
        halfx   :  [],
        qtrx    :  [],
        zerox   :  []
    }

    for(i in pkmn.typing) {
        for(x in effectiveness[pkmn.typing[i].name]) {
            var eff = effectiveness[pkmn.typing[i].name];
            if(eff[x] === 2){
                weaknesses.twox.push(x);
            } else if(eff[x] === 0.5) {
                weaknesses.halfx.push(x);
            } else if(eff[x] === 0) {
                weaknesses.zerox.push(x);
            } else {
                weaknesses.onex.push(x);
            }
        }
    }
    for(i in weaknesses){
        weaknesses[i].sort();
    }

// Checking for immunities
    for(i in weaknesses.zerox) {
        var imm = weaknesses.zerox[i];
        if(weaknesses.fourx.indexOf(imm) !== -1){
            weaknesses.fourx.splice(weaknesses.fourx.indexOf(imm), 1);
        } else if(weaknesses.twox.indexOf(imm) !== -1){
            weaknesses.twox.splice(weaknesses.twox.indexOf(imm), 1);
        } else if(weaknesses.onex.indexOf(imm) !== -1){
            weaknesses.onex.splice(weaknesses.onex.indexOf(imm), 1);
        } else if(weaknesses.halfx.indexOf(imm) !== -1){
            weaknesses.halfx.splice(weaknesses.halfx.indexOf(imm), 1);
        } else if(weaknesses.qtrx.indexOf(imm) !== -1){
            weaknesses.qtrx.splice(weaknesses.qtrx.indexOf(imm), 1);
        }
    }

// // Checking for x4
    for (var i = 0; i < weaknesses.twox.length - 1; i++) {
        if (weaknesses.twox[i] == weaknesses.twox[i+1]) {
            weaknesses.fourx.push(weaknesses.twox[i]);
        }
    }
    for(i in weaknesses.fourx) {
        while(weaknesses.twox.indexOf(weaknesses.fourx[i]) !== -1) {
            weaknesses.twox.splice(weaknesses.twox.indexOf(weaknesses.fourx[i]), 1);
        }
    }

// // Checking for x0.25
    for (var i = 0; i < weaknesses.halfx.length - 1; i++) {
        if (weaknesses.halfx[i] == weaknesses.halfx[i+1]) {
            weaknesses.qtrx.push(weaknesses.halfx[i]);
        }
    }
    for(i in weaknesses.qtrx) {
        while(weaknesses.halfx.indexOf(weaknesses.qtrx[i]) !== -1) {
            weaknesses.halfx.splice(weaknesses.halfx.indexOf(weaknesses.qtrx[i]), 1);
        }
    }

// // Checking x2 versus x0.5
    var tmp = [];
    for(i in weaknesses.twox) {
        if(weaknesses.halfx.indexOf(weaknesses.twox[i]) !== -1) {
            tmp.push(weaknesses.halfx[weaknesses.halfx.indexOf(weaknesses.twox[i])]);
            weaknesses.onex.push(weaknesses.halfx[weaknesses.halfx.indexOf(weaknesses.twox[i])]);
            weaknesses.halfx.splice(weaknesses.halfx.indexOf(weaknesses.twox[i]), 1);
        }
    }
    for(i in tmp){
        weaknesses.twox.splice(weaknesses.twox.indexOf(tmp[i]), 1);
    }

// // Sort and remove duplicates from x1
    weaknesses.onex.sort();
    weaknesses.onex = removeDuplicates(weaknesses.onex);

// // Remove stuff from x1 that's in other columns
    for(i in weaknesses){
        if(weaknesses[i] !== weaknesses.onex){
            for(j in weaknesses[i]){
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

    for(i in weaknesses.fourx) {
        $('#super').append('<li style=color:' + typeColors[weaknesses.fourx[i]] + ';>' + capitalizeFirstLetterAndRemoveDashes(weaknesses.fourx[i]) + '    <span style="font-weight: normal">(x4)</span></li>');
    }
    for(i in weaknesses.twox){
        $('#super').append('<li style=color:' + typeColors[weaknesses.twox[i]] + ';>' + capitalizeFirstLetterAndRemoveDashes(weaknesses.twox[i]) + '    <span style="font-weight: normal">(x2)</span></li>');
    }
    for(i in weaknesses.onex){
        $('#normal').append('<li style=color:' + typeColors[weaknesses.onex[i]] + ';>' + capitalizeFirstLetterAndRemoveDashes(weaknesses.onex[i]) + '</li>');
    }
    for(i in weaknesses.qtrx){
        $('#not-very').append('<li style=color:' + typeColors[weaknesses.qtrx[i]] + ';>' + capitalizeFirstLetterAndRemoveDashes(weaknesses.qtrx[i]) + '    <span style="font-weight: normal">(x0.25)</span></li>');
    }
    for(i in weaknesses.halfx){
        $('#not-very').append('<li style=color:' + typeColors[weaknesses.halfx[i]] + ';>' + capitalizeFirstLetterAndRemoveDashes(weaknesses.halfx[i]) + '    <span style="font-weight: normal">(x0.5)</span></li>');
    }
    for(i in weaknesses.zerox){
        $('#immune').append('<li style=color:' + typeColors[weaknesses.zerox[i]] + ';>' + capitalizeFirstLetterAndRemoveDashes(weaknesses.zerox[i]) + '</li>');
    }
}

var removeDuplicates = function(arr) {
    var newarray = [], initLength = arr.length, found, x, y;

    for (x = 0; x < initLength; x++) {
        found = undefined;
        for (y = 0; y < newarray.length; y++) {
            if (arr[x] === newarray[y]) {
                found = true;
                break;
            }
        }
        if (!found) {
            newarray.push(arr[x]);
        }
    }
    return newarray;
}


function populateSelect(pkmn){
    pkmn.makeApiCall('api/v1/pokedex/1/', function(response){
        for(i in response.pokemon) {
            $('select').append('<option value="' + response.pokemon[i].name + '">' + capitalizeFirstLetterAndRemoveDashes(response.pokemon[i].name) + '</option>');   
        }
    });
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
    var s = string.replace(/-/, ' ');
    s = s.split(' ');
    for(i in s) {
        s[i] = s[i].charAt(0).toUpperCase() + s[i].slice(1);
    }
    return s.join(' ');
}