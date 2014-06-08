$(document).ready(function() {
    var api = new Poketype();

    var search = $('#search-field').focus().submit(function(e){e.preventDefault(); return false;}).keypress(function(key) {
        if(key.which == 13) {
            $(this).blur();
            $('#SearchSubmitButton').focus().click();
        }
    });

    // jQueryUI Elements
    $('#SearchSubmitButton').button({label:'Submit'}).click(function() {
        var query = search.val();
        var data;
        if(isNaN(parseInt(query))) {
            data = api.apiCall('api/v1/pokemon/' + query.toLowerCase() + '/');
        } else {
            data = api.apiCall('api/v1/pokemon/' + query + '/');
        }
    });

    $('#HelpButton').button().click(function(){
        $('#help-modal').dialog({ modal: true,
                                  title: 'Help',
                                  width:  500})
    });
});

$.prototype.formSubmit = function(field) {

};