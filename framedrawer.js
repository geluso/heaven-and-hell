var WIDTH = 1010;
var HEIGHT = 59;
var frame_width = 144;
var frame_height = 59;

var frames_per_reel = 100;
var total_frames = 472;
var pixels_per_frame = 2;

class FrameDrawer {
  constructor(cursor, frameRate) {
    this.cursor = cursor || 0;
    this.frameRate = frameRate || 30;
    this.pixelsPerFrame = 2;
    this.reverse = false;
    
    this.rippleShift = 0;
  }
  
  draw() {
    this.draw_frame_at_cursor();
    this.update_cursor();
    this.wrap_cursor();
  }
  
  draw_frame_at_cursor() {
    var x = this.cursor;
    var frame_num = Math.floor((x + frame_width / 2) / this.pixelsPerFrame);
    var reel_num = Math.floor(frame_num / frames_per_reel);
    var frame = frame_num % frames_per_reel;
    if (frame_num < total_frames && reel_num < loaded.length) {
      paint_frame(loaded[reel_num], screen, frame, x, this.rippleShift);
    }
  }

  update_cursor() {
    this.rippleShift = (this.rippleShift + 1) % frame_width;
    if (this.reverse) {
      this.cursor--;
    } else {
      this.cursor++;
    }
  }
  
  cursor_from_mouse(e) {
    this.cursor = e.offsetX - frame_width / 2;
  }
  
  wrap_cursor() {
    var max_cursor_pos = total_frames * pixels_per_frame;
    if (this.cursor > (max_cursor_pos)) {
      this.cursor = 0;
    } else if (this.cursor < 0) {
      this.cursor = max_cursor_pos;
    }
  }
}
