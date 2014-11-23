
var n = 7;

// generate gray code
function grayCode (n) {
    if (n === 1) {
        return ['0', '1'];
    }
    var code = grayCode (n - 1);
    return code.map (function (a) { return '0' + a; } ).
        concat (code.reverse ().map (function (a) { return '1' + a; }));
}
var code = grayCode (n);

// map gray code to notes
var noteMap = ['c', 'd', 'e', 'f', 'g', 'a', 'b', 'c'];
var val,
    scales = [];
for (var i in code) {
    scales.push (code[i].split ('').map (function (bit, i) { 
        return noteMap[i] + (bit === '1' ? '#' : '');
    }));
    scales[scales.length - 1].push (scales[scales.length - 1][0]);
}

// build scales tape
var scale,
    band$,
    note;
function buildTape (tape$) {
    for (var i in scales) {
        scale = scales[i];
        band$ = $('<div>', {
            'class': 'band',
        });
        for (var j in scale) {
            note = scale[j];
            var noteElems = [];
            if (note.match (/#/)) {
                noteElems.push ($('<span>', { 

                    text: note.replace (/#/, '')
                }));
                noteElems.push ($('<sup>', { text: '#' }));
            } else {
                noteElems.push ($('<span>', { text: note }));
            }

            band$.append ($('<span>', {
                'class': 'note',
            }).append (noteElems));
        }
        tape$.append (band$);
    }
}
buildTape ($('#tape'));
buildTape ($('#tape2'));

var scaleNum = 0;
var noteNum = 0;
var bandHeight = $('.band').first ().height () + 10;
var tapeOrder = true;
var tape$ = $('#tape');
var tape2$ = $('#tape2');
var note;
var octave;
var interval = null;

function start () {
    interval = setInterval (function () {
        note = scales[scaleNum][noteNum++];
        //console.log (note);
        if (noteNum === 8) {
            tones.play (note, 4);
        } else {
            octave = (note === 'b#') ? 4 : 3;
            if (note === 'e#') note = 'f';
            if (note === 'b#') note = 'c';
            tones.play (note, octave);
        }
        if (noteNum === 8) {
            noteNum = 0;
            scaleNum++;
            if (scaleNum === scales.length) {
                scaleNum = 0;
            }
            $('.tape').each (function () {
                $(this).attr (
                    'style',
                    'top: ' + 
                        ($(this).offset ().top - bandHeight) + 'px;');
            });
            if (tapeOrder &&
                tape$.offset ().top + tape$.height () < 0) {

                tape$.attr (
                    'style',
                    'top: ' + 
                        (tape2$.offset ().top + tape2$.height () - 10) + 
                        'px;');
                tapeOrder = !tapeOrder;
            }
            if (!tapeOrder &&
                tape2$.offset ().top + tape2$.height () < 0) {

                tape2$.attr (
                    'style',
                    'top: ' + 
                        (tape$.offset ().top + tape$.height () - 10) + 
                        'px;');

                tapeOrder = !tapeOrder;
            }
        }
    }, 200);
}

$('#play-button').click (function () {
    $(this).hide ().next ().show ();
    $('#overlay').fadeOut ();
    start ();
});
$('#pause-button').click (function () {
    clearInterval (interval);
    $(this).hide ().prev ().show ();
    $('#overlay').fadeIn ();
});


