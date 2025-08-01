/**
 * Helper method for clippy animation that calculates a new position for clippy.
 */
function makeNewPosition($container) {
    // Get viewport dimensions (remove the dimension of the div)
    var h = $container.height() - 50;
    var w = $container.width() - 50;
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    return [nh, nw];
}

/**
 * Animates a clippy object when clippy is called.
 */
function animateDiv($target) {
    var newq = makeNewPosition($target.parent());
    var oldq = $target.offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    $target.animate(
        {
            top: newq[0],
            left: newq[1],
        },
        speed,
        function () {
            animateDiv($target);
        }
    );
}

/**
 * Helper method for clippy animation that calculates clippys speed.
 */
function calcSpeed(prev, next) {
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    var greatest = x > y ? x : y;
    var speedModifier = 0.1;
    var speed = Math.ceil(greatest / speedModifier);
    return speed;
}

/**
 * Creates 3 clippy objects that randomly move around the screen. This is basically malware.
 */
function clippy() {
    clippys =
        "<div class='clippy clippy1'></div><div class='clippy clippy2'></div><div class='clippy clippy3'></div>";
    $('.desktop').prepend(clippys);
    animateDiv($('.clippy1'));
    animateDiv($('.clippy2'));
    animateDiv($('.clippy3'));
}

/**
 * Updates the time display in the taskbar with the current time.
 */
function updateTimeDisplay() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Add leading zero to minutes if needed
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var timeString = hours + ':' + minutes + ' ' + ampm;
    $('#time-display').text(timeString);
}

$(document).ready(function () {
    // Initialize time display
    updateTimeDisplay();

    // Update time every second
    setInterval(updateTimeDisplay, 1000);

    // toggle start menu
    $('#startbutton').click(function () {
        $('#startbutton').toggleClass('startbutton-on');
        $('#menu').toggle();
    });

    // close start menu if desktop clicked
    $('.desktop').click(function () {
        // Depress windows start button animation
        $('#startbutton').removeClass('startbutton-on');
        // hide start menu
        $('#menu').hide();
        // remove icon overlay
        //$("#desktop-icons div").removeClass("icon-overlay");
        //$("#recycle-container div").removeClass("icon-overlay");
    });
}); // end document ready
