var screen;
var loaded = [];

var frame_rate = 30;
var single_frame = false;

function paint_frame(film, screen, frame, x) {
  var offset = frame_height * frame;
  if (offset < 0) {
    return
  }
  var frame = film.getImageData(0, offset, frame_width, frame_height);
  if (single_frame) {
    screen.fillRect(0, 0, WIDTH, HEIGHT);
  }
  screen.putImageData(frame, x, 0);
}

window.onload = function () {
  var reverse_checkbox = $("#reverse");
  reverse_checkbox.click(function(e) {
    reverse = reverse_checkbox[0].checked;
    drawer.reverse = reverse;
  });

  // single_frame
  var single_frame_checkbox = $("#single_frame");
  single_frame = single_frame_checkbox[0].checked;

  single_frame_checkbox.click(function(e) {
    single_frame = single_frame_checkbox[0].checked;
  });

  // show_reels
  var show_reels_checkbox = $("#show_reels");
  show_reels = show_reels_checkbox[0].checked;

  show_reels_checkbox.click(function(e) {
    show_reels = show_reels_checkbox[0].checked;
    if (show_reels) {
      $("#reels").removeClass("none");
    } else {
      $("#reels").addClass("none");
    }
  });

  var film = document.getElementById("film");
  var zeros = document.getElementById("zeros");

  var reels = document.getElementById("reels").children;
  var film = document.getElementById("film").children;
  for (var i = 0; i < reels.length; i++) {
    var reel = reels[i];
    reel.width = 144;
    reel.height = 5900;
    reel = reel.getContext("2d");
    loaded.push(reel);

    var film_strip = film[i];
    reel.drawImage(film_strip, 0, 0);
  }

  screen = document.getElementById("screen");
  screen.width = WIDTH;
  screen.height = HEIGHT;
  screen = screen.getContext("2d");
  screen.fillRect(0, 0, WIDTH, HEIGHT);

  var drawer = new FrameDrawer();
  draw_frame_loop = new Loop(function() {
    drawer.draw();
  }, frame_rate);

  // Mouse events.
  $("#screen").mouseenter(function(e) {
    draw_frame_loop.stop();
    drawer.cursor_from_mouse(e);
  });

  $("#screen").mouseleave(function(e) {
    drawer.cursor_from_mouse(e);
    draw_frame_loop.start();
  });

  $("#screen").mousemove(function(e) {
    if (!draw_frame_loop.is_running()) {
      drawer.cursor_from_mouse(e);
      drawer.draw_frame_at_cursor(screen);
    }
  });

  draw_frame_loop.start();
}
