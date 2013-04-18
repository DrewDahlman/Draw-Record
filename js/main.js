(function() {
	canvas_record = function() {
		var self = this;
		var canvas = document.getElementById('canvas'),
			ctx = canvas.getContext('2d'),
			_recorder = $("#recorder"),
			_wrapper = $("#wrapper"),
			_drawIt = $("#draw_it"),
			_saveIt = $("#save_it"),
			_clearIt = $("#clear_it"),
			_timer = 0,
			_y = 0,
			_x = 0,
			x = [],
			y = [],
			_recording = false;

		self.init = function() {
			_wrapper.mousedown(self.record);
			_wrapper.mouseup(self.stop_record);
			_wrapper.mousemove(self.track_mouse);
			_drawIt.click(self.draw_it);
			_saveIt.click(self.share);
			_clearIt.click(self.clear_it);

			if (window.location.hash) {

				var s_x = self.decode().x;
				var s_y = self.decode().y;

				var arr = s_x.split(',');
				var i;

				for(i in arr){
					x.push(arr[i]);
				}

				var arr = s_y.split(',');
				var i;

				for(i in arr){
					y.push(arr[i]);
				}

				self.draw_it();
			}
		}

		self.decode = function() {
			var url = location.href;
			var qs = url.substring(url.indexOf('?') + 1).split('&');
			for (var i = 0, result = {}; i < qs.length; i++) {
				qs[i] = qs[i].split('=');
				result[qs[i][0]] = decodeURIComponent(qs[i][1]);
			}
			return result;
		}
		self.track_mouse = function(event) {
			_x = event.pageX;
			_y = event.pageY;
			self.recording();
		}

		self.record = function(event) {
			_recording = true;

		}

		self.stop_record = function(event) {
			_recording = false;
		}

		self.recording = function() {
			if (_recording) {
				var x_val = $("#x").text() + _x + ",";
				var y_val = $("#y").text() + _y + ",";

				_recorder.children('#x').text(x_val);
				_recorder.children('#y').text(y_val);

				x.push(_x);
				y.push(_y);

				ctx.beginPath();
				ctx.moveTo(x[x.length - 2], y[y.length - 2]);
				ctx.lineTo(_x, _y);
				ctx.fill();
				ctx.stroke();

			}
		}

		self.share = function() {
			window.location.hash = "?x=" + x + "&y=" + y;
		}

		self.clear_it = function(){
			window.location.hash = "";
			ctx.clearRect(0, 0, 1024, 768);
			x = [];
			y = [];
			$("#x,#y").text("");
		}
		self.draw_it = function() {

			var i = 0;

			_x = 0;
			_y = 0;

			ctx.clearRect(0, 0, 1024, 768)

			_timer = setInterval(function() {

				_x = x[i];
				_y = y[i];
				ctx.beginPath();
				ctx.moveTo(_x, _y);
				if (i < x.length + 1 && x[i] != "break") {
					i = i + 1;
				} else {
					clearInterval(_timer);
				}
				_x = x[i];
				_y = y[i];
				ctx.lineTo(_x, _y);
				ctx.fill();
				ctx.stroke();
			}, 16);
		}
		self.init();
		return self;
	}
})();

$(function() {
	var _draw = new canvas_record();
});