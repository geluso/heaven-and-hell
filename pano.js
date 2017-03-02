var WIDTH = 1010;
var HEIGHT = 59;
var frame_width = 144;
var frame_height = 59;
var screen;
var loaded = [];
var frames_per_reel = 100;
var total_frames = 472;
var pixels_per_frame = 2;

var frame_rate = 1;

var cursor = 0;
var reverse = false;
var single_frame = false;

var on_screen = false;
var ticker;

function draw_frame_at_cursor() {
  var x = cursor;
  var frame_num = Math.floor((x + frame_width / 2) / pixels_per_frame);
  var reel_num = Math.floor(frame_num / frames_per_reel);
  var frame = frame_num % frames_per_reel;
  if (frame_num < total_frames && reel_num < loaded.length) {
    paint_frame(loaded[reel_num], screen, frame, x);
  }
}

function update_cursor() {
  if (reverse) {
    cursor--;
  } else {
    cursor++;
  }
}

function wrap_cursor() {
  var max_cursor_pos = total_frames * pixels_per_frame;
  if (cursor > (max_cursor_pos)) {
    cursor = 0;
  } else if (cursor < 0) {
    cursor = max_cursor_pos;
  }
}

function stop_sweep() {
  clearInterval(ticker);
}

function paint_frame(film, screen, frame, x) {
  var offset = frame_height * frame;
  var frame = film.getImageData(0, offset, frame_width, frame_height);
  if (single_frame) {
    screen.fillRect(0, 0, WIDTH, HEIGHT);
  }
  screen.putImageData(frame, x, 0);
}

function update_cursor_pos(e) {
  cursor = e.offsetX - frame_width / 2;
  if (cursor < 0) {
    cursor = 0 - frame_width / 2;
  }
}

window.onload = function () {
  // Reverse
  var reverse_checkbox = $("#reverse");
  reverse = reverse_checkbox[0].checked;

  reverse_checkbox.click(function(e) {
    reverse = reverse_checkbox[0].checked;
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

  draw_frame_loop = new Loop(function() {
    draw_frame_at_cursor();
    update_cursor();
    wrap_cursor();
  }, frame_rate);


  // Mouse events.
  $("#screen").mouseenter(function(e) {
    draw_frame_loop.stop();
    update_cursor_pos(e);
  });

  $("#screen").mouseleave(function(e) {
    update_cursor_pos(e);
    draw_frame_loop.start();
  });

  $("#screen").mousemove(function(e) {
    if (!draw_frame_loop.is_running()) {
      update_cursor_pos(e);
      draw_frame_at_cursor(screen);
    }
  });

  draw_frame_loop.start();
}
