function Loop(loop, delay) {
  var default_delay = 100;

  this.interval_id = null;
  this.loop = loop;
  this.delay = delay || default_delay;
}

Loop.prototype.start = function() {
  this.interval_id = setInterval(this.loop, this.delay);
};

Loop.prototype.stop = function() {
  clearInterval(this.interval_id);
  this.interval_id = null;
};

Loop.prototype.is_running = function() {
  return this.interval_id != null;
};
