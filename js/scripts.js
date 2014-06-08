$(document).ready(function() {
    var api = new Poketype();
    var data;
    var image;
    var types;
    var typeColors = {
        Normal:     "#979965",
        Fire:       "#EA6B25",
        Fighting:   "#B11D1F",
        Water:      "#5679EC",
        Flying:     "#9777EC",
        Grass:      "#67C13F",
        Poison:     "#67C13F",
        Electric:   "#F5C826",
        Ground:     "#D8B456",
        Psychic:    "#F43D75",
        Rock:       "#A9912B",
        Ice:        "#88D0CF",
        Bug:        "#98AD1A",
        Dragon:     "#5C0EF6",
        Ghost:      "#5C4286",
        Dark:       "#5C4638",
        Steel:      "#A9A8C5",
        Fairy:      "#E8849C"
    }

    var search = $('#search-field').focus().submit(function(e){e.preventDefault(); return false;}).keypress(function(key) {
        if(key.which == 13) {
            $(this).blur();
            $('#SearchSubmitButton').focus().click();
        }
    });

    // jQueryUI Elements
    $('#SearchSubmitButton').button({label:'Submit'}).click(function() {
        submitSearch(api, search.val());
    });

    $('#HelpButton').button().click(function(){
        $('#help-modal').dialog({ modal: true,
                                  title: 'Help',
                                  width:  500})
    });
});

var submitSearch = function(api, query) {
    var cb = function(response) {
        data = response;
        image = response.sprites[0].resource_uri;
        console.log(response);

        api.apiCall(image, function(reply){
            $('#sprite').append('<img src="http://pokeapi.co' + reply.image + '" />')
        });

        $('#species-name').append(response.name.toUpperCase().split('').join(' '));
        var abs = [];
        for(i in response.abilities) {
            abs.push(capitalizeFirstLetterAndRemoveDashes(response.abilities[i].name));
        }
        $('#abilities').append(abs.join(', '))
    }

    if(isNaN(parseInt(query))) {
        api.apiCall('api/v1/pokemon/' + query.toLowerCase() + '/', cb);
    } else {
        api.apiCall('api/v1/pokemon/' + query + '/', cb);
    }

    $('#content').removeAttr('style');
    $('#intro').hide();
}

function capitalizeFirstLetterAndRemoveDashes(string)
{
    var s = string.replace(/-/, ' ');
    s = s.split(' ');
    for(i in s) {
        s[i] = s[i].charAt(0).toUpperCase() + s[i].slice(1);
    }
    return s.join(' ');
}