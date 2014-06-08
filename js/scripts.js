$(document).ready(function() {
    var api = new Poketype();
    var data;
    var image;
    var types;

    // jQueryUI Elements
    var search = $('#search-field').focus();
    $('#SearchSubmitButton').button({label:'Submit'});

    $('#HelpButton').button().click(function(){
        $('#help-modal').dialog({ modal: true,
                                  title: 'Help',
                                  width:  500})
    });

    $('.searching').submit(function(e){
        e.preventDefault();
        var cb = function(response) {
            console.log(response);
    
            api.apiCall(response.sprites[0].resource_uri, function(reply){
                $('#sprite').empty().append('<img src="http://pokeapi.co' + reply.image + '" />')
            });
    
            $('#species-name').empty().append(response.name.toUpperCase().split('').join(' '));
            var abs = [];
            for(i in response.abilities) {
                abs.push(capitalizeFirstLetterAndRemoveDashes(response.abilities[i].name));
            }
            $('#abilities').empty().append('Abilities: ' + abs.join(', '));
    
            assignTypes(response);
        }

        if(isNaN(parseInt(search.val()))) {
            api.apiCall('api/v1/pokemon/' + search.val().toLowerCase() + '/', cb);
        } else {
            api.apiCall('api/v1/pokemon/' + search.val() + '/', cb);
        }
    
        $('#content').removeAttr('style');
        $('#intro').hide();
    });
});

function assignTypes(info) {
    var typeColors = {
        normal:     "#979965",
        fire:       "#EA6B25",
        fighting:   "#B11D1F",
        water:      "#5679EC",
        flying:     "#9777EC",
        grass:      "#67C13F",
        poison:     "#8D278E",
        electric:   "#F5C826",
        ground:     "#D8B456",
        psychic:    "#F43D75",
        rock:       "#A9912B",
        ice:        "#88D0CF",
        bug:        "#98AD1A",
        dragon:     "#5C0EF6",
        ghost:      "#5C4286",
        dark:       "#5C4638",
        steel:      "#A9A8C5",
        fairy:      "#E8849C"
    }
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