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
            pkmn.apiCall('api/v1/pokemon/' + search.val().toLowerCase() + '/', cb);
        } else {
            pkmn.apiCall('api/v1/pokemon/' + search.val() + '/', cb);
        }
    });

    $('select').on('change', function(){
        pkmn.apiCall('api/v1/pokemon/' + $(this).val() + '/', function(response){
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

    pkmn.apiCall(response.sprites[0].resource_uri, function(reply){
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
}

function populateSelect(pkmn){
    pkmn.apiCall('api/v1/pokedex/1/', function(response){
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