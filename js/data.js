/*
    data.js contains useful objects:
        - Hex color code associated with each type
        - Type effectiveness for every type

    Vignesh Kalidas, 2014
*/

Array.prototype.removeMatchingElementsFrom = function(arr) {
    for(i in arr) {
        for(var j = 0; j < this.length; j++) {
            if(this[j] === arr[i]) {
                this.splice(j, 1)
                j--
            }
        }
    }
};

Array.prototype.pushDuplicatesTo = function(arr) {
    this.sort();

    for(i in this) {
        if (this[i] === this[parseInt(i)+1]) {
            arr.push(this[i]);
        }
    }
};

Array.prototype.removeDuplicates = function() {
    var newarray = [], initLength = this.length, found, x, y;

    for (x = 0; x < initLength; x++) {
        found = undefined;
        for (y = 0; y < newarray.length; y++) {
            if (this[x] === newarray[y]) {
                found = true;
                break;
            }
        }
        if (!found) {
            newarray.push(this[x]);
        }
    }

    return newarray;
}

Array.removeMatchingElementsAndStoreIn = function(one, two, store) {
    for(var i = 0; i < one.length; i++) {
        var elm = two.indexOf(one[i]);
        if(elm !== -1) {
            store.push(two[elm]);
            two.splice(elm, 1);

            one.splice(i, 1);
            i--;
        }
    }
}

var typeColors = {
    normal      :   "#979965",
    fire        :   "#EA6B25",
    fighting    :   "#B11D1F",
    water       :   "#5679EC",
    flying      :   "#9777EC",
    grass       :   "#67C13F",
    poison      :   "#8D278E",
    electric    :   "#F5C826",
    ground      :   "#D8B456",
    psychic     :   "#F43D75",
    rock        :   "#A9912B",
    ice         :   "#88D0CF",
    bug         :   "#98AD1A",
    dragon      :   "#5C0EF6",
    ghost       :   "#5C4286",
    dark        :   "#5C4638",
    steel       :   "#A9A8C5",
    fairy       :   "#E8849C"
}

var typesList = ['normal',
                 'fire',
                 'fighting',
                 'water',
                 'flying',
                 'grass',
                 'poison',
                 'electric',
                 'ground',
                 'psychic',
                 'rock',
                 'ice',
                 'bug',
                 'dragon',
                 'ghost',
                 'dark',
                 'steel',
                 'fairy']

var effectiveness = {
    normal      : {
        super_effective    : ['fighting'],
        not_very_effective : [],
        immune             : ['ghost']
    },
    fire        : {
        super_effective    : ['water', 'ground', 'rock'],
        not_very_effective : ['ice', 'bug', 'steel', 'grass', 'fire', 'fairy'],
        immune             : []
    },
    fighting    : {
        super_effective    : ['flying', 'psychic', 'fairy'],
        not_very_effective : ['rock', 'bug', 'dark'],
        immune             : []
    },
    water       : {
        super_effective    : ['grass', 'electric'],
        not_very_effective : ['fire', 'water', 'ice', 'steel'],
        immune             : []
    },
    flying      : {
        super_effective    : ['electric', 'rock', 'ice'],
        not_very_effective : ['fighting', 'grass', 'bug'],
        immune             : ['ground']
    },
    grass       : {
        super_effective    : ['fire', 'ice', 'bug', 'poison'],
        not_very_effective : ['water', 'grass', 'electric', 'ground'],
        immune             : []
    },
    poison      : {
        super_effective    : ['ground', 'psychic'],
        not_very_effective : ['fighting', 'grass', 'poison', 'bug', 'fairy'],
        immune             : []
    },
    electric    : {
        super_effective    : ['ground'],
        not_very_effective : ['flying', 'electric', 'steel'],
        immune             : []
    },
    ground      : {
        super_effective    : ['grass', 'water', 'ice'],
        not_very_effective : ['poison', 'rock'],
        immune             : ['electric']
    },
    psychic     : {
        super_effective    : ['bug', 'ghost', 'dark'],
        not_very_effective : ['fighting', 'psychic'],
        immune             : []
    },
    rock        : {
        super_effective    : ['fighting', 'water', 'grass', 'ground', 'steel'],
        not_very_effective : ['flying', 'normal', 'fire', 'poison'],
        immune             : []
    },
    ice         : {
        super_effective    : ['fire', 'fighting', 'rock', 'steel'],
        not_very_effective : ['ice'],
        immune             : []
    },
    bug         : {
        super_effective    : ['fire', 'flying', 'rock'],
        not_very_effective : ['grass', 'fighting', 'ground'],
        immune             : []
    },
    dragon      : {
        super_effective    : ['ice', 'dragon', 'fairy'],
        not_very_effective : ['fire', 'water', 'grass', 'electric'],
        immune             : []
    },
    ghost       : {
        super_effective    : ['ghost', 'dark'],
        not_very_effective : ['poison', 'bug'],
        immune             : ['normal', 'fighting']
    },
    dark        : {
        super_effective    : ['fighting', 'bug', 'fairy'],
        not_very_effective : ['ghost', 'dark'],
        immune             : ['psychic']
    },
    steel       : {
        super_effective    : ['fire', 'ground', 'fighting'],
        not_very_effective : ['normal', 'flying', 'grass', 'psychic', 'rock', 'ice', 'bug', 'dragon', 'steel', 'fairy'],
        immune             : ['poison']
    },
    fairy       : {
        super_effective    : ['poison', 'steel'],
        not_very_effective : ['fighting', 'bug', 'dark'],
        immune             : ['dragon']
    }
}