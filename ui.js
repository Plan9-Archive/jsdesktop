function htmlentities(input) {
	return input.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function startui() {
	window.dragging = false;
	window.resizing = false;
	window.windows = [];
	window.nwindows = 0;
	window.Nwindows = 0;

	var button = document.createElement('input');
	button.type = 'button';
	button.value = 'New';
	button.onclick = function () {
		document.body.appendChild(newWindow('' + window.Nwindows, true));
	}
	document.body.appendChild(button);

	document.onmousemove = function(event) {
		if (window.dragging != false) {
			var x = parseInt(window.dragging.style.left.replace('px', ''));
			var y = parseInt(window.dragging.style.top.replace('px', ''));

			x += (event.screenX - window.dragging.x);
			window.dragging.x = event.screenX;

			y += (event.screenY - window.dragging.y);
			window.dragging.y = event.screenY;

			window.dragging.style.top = y + 'px';
			window.dragging.style.left = x + 'px';
		} else if (window.resizing != false) {
			var dx = event.screenX - window.resizing.x;
			var dy = event.screenY - window.resizing.y;

			window.resizing.resizeDiv.style.width = (parseInt(window.resizing.resizeDiv.style.width.replace(/px$/, '')) + dx) + 'px';
			window.resizing.resizeDiv.style.height = (parseInt(window.resizing.resizeDiv.style.height.replace(/px$/, '')) + dy) + 'px';

			window.resizing.x = event.screenX;
			window.resizing.y = event.screenY;
		}
	}
}

function newWindow(id, canclose) {
	var div = document.createElement('div');
	window.windows.push(div);
	window.nwindows++;
	window.Nwindows++;

	div.id = id;
	div.userList = [];
	div.setAttribute('class', 'window');
	div.style.top = (window.nwindows * 10 + 10) + 'px';
	div.style.left = (window.nwindows * 10 + 10) + 'px';
	div.style.width = '320px';
	div.style.height = '320px';
	div.style.zIndex = window.nwindows;

	div.bg = document.createElement('div');
	div.bg.setAttribute('class', 'bg');

	div.output = document.createElement('textarea');
	div.output.div = div;
	div.output.setAttribute('class', 'output');
	div.output.write = function(data) {
		this.value += data;
		this.scrollTop = this.scrollHeight;
	}

	div.input = document.createElement('textarea');
	div.input.div = div;
	div.input.setAttribute('class', 'input');
	div.input.onkeydown = function(event) {
		if (event.keyCode == 13) {
			div.output.write(div.input.value+'\n');
			eval(div.input.value);
			div.input.value = '';
			return false;
		}
	}
	div.input.style.zIndex = 1;

	div.titleBar = document.createElement('div');
	div.titleBar.div = div;
	div.titleBar.setAttribute('class', 'title');
	div.titleBar.innerHTML = '<span class="name"><strong>' + unescape(div.id) + '</strong></span>';

	div.titleBar.onmousedown = function(event) {
		this.div.x = event.screenX;
		this.div.y = event.screenY;
		window.dragging = this.div;

		for (var i = 0; i < window.windows.length; i++)
			if (window.windows[i].style.zIndex > window.dragging.style.zIndex)
				window.windows[i].style.zIndex--;

		window.dragging.style.zIndex = window.nwindows;

		event.preventDefault();
		return false;
	}

	// avoid that trapping bug by using global not div.titleBar
	window.onmouseup = function(event) {
		window.dragging = false;

		if (window.resizing != false) {
			window.resizing.style.width = window.resizing.resizeDiv.style.width;
			window.resizing.style.height = window.resizing.resizeDiv.style.height;
			document.body.removeChild(window.resizing.resizeDiv);
			resizeCompute(window.resizing);
			window.resizing = false;
		}
	}

	var link = document.createElement('a');
	link.href = 'javascript:hideWindow(\'' + escape(id) + '\')';
	link.id = div.id + 'vis';

	var span = document.createElement('span');
	span.setAttribute('class', 'button');
	span.style.float = 'right';
	span.innerHTML = '<strong>&darr;</strong>';

	link.appendChild(span);
	div.titleBar.appendChild(link);

	if (canclose) {
		link = document.createElement('a');
		link.href = 'javascript:closeWindow(\'' + escape(id) + '\')';

		span = document.createElement('span');
		span.setAttribute('class', 'button');
		span.style.float = 'right';
		span.innerHTML = '<strong>x</strong>';

		link.appendChild(span);
		div.titleBar.appendChild(link);
	}

	div.resizeHandle = document.createElement('div');
	div.resizeHandle.div = div;
	div.resizeHandle.setAttribute('class', 'resizer');
	div.resizeHandle.onmousedown = function(event) {
		window.resizing = this.div;
		window.resizing.x = event.screenX;
		window.resizing.y = event.screenY;

		var rdiv = document.createElement('div');
		window.resizing.resizeDiv = rdiv;

		rdiv.div = this.div;
		rdiv.setAttribute('class', 'resizeBox');
		rdiv.style.zIndex = rdiv.div.style.zIndex + 1;
		rdiv.style.position = 'absolute';
		rdiv.style.width = window.resizing.style.width;
		rdiv.style.height = window.resizing.style.height;
		rdiv.style.top = window.resizing.style.top;
		rdiv.style.left = window.resizing.style.left;

		document.body.appendChild(rdiv);

		event.preventDefault();
		return false;
	}

	div.bottom = document.createElement('div');
	div.bottom.setAttribute('class', 'bottom');
	div.bottom.appendChild(div.resizeHandle);

	div.appendChild(div.bg);
	div.appendChild(div.output);
	div.appendChild(div.input);
	div.appendChild(div.titleBar);
	div.appendChild(div.bottom);

	resizeCompute(div);

	return div;
}

function closeWindow(id) {
	var win = document.getElementById(id);

	if (win != null)
		document.body.removeChild(win);

	window.nwindows--;
}

function hideWindow(id) {
	var div = document.getElementById(id);
	var button = document.getElementById(id + 'vis');

	div.oldheight = div.style.height;
	div.style.height = '1.2em';
	div.output.style.display = 'none';
	div.input.style.display = 'none';
	div.bg.style.display = 'none';
	div.bottom.style.display = 'none';
	div.resizeHandle.style.display = 'none';
	button.getElementsByTagName('span')[0].innerHTML = '<strong>&uarr;</strong>';
	button.href = 'javascript:showWindow(\'' + escape(id) + '\');';
}

function showWindow(id) {
	var div = document.getElementById(id);
	var button = document.getElementById(id + 'vis');

	div.style.height = div.oldheight;
	div.output.style.display = 'block';
	div.input.style.display = 'block';
	div.resizeHandle.style.display = 'block';
	div.bg.style.display = 'block';
	div.bottom.style.display = 'block';
	button.getElementsByTagName('span')[0].innerHTML = '<strong>&darr;</strong>';
	button.href = 'javascript:hideWindow(\'' + escape(id) + '\');';
}

function resizeCompute(div) {
	var width = div.style.width.replace(/px$/, '');
	var height = div.style.height.replace(/px$/, '');

	div.titleBar.style.width = width + 'px';
	div.input.style.width = (width - 20) + 'px';
	div.output.style.width = (width - 10) + 'px';
	div.output.style.height = (height - 140) + 'px';
	div.bg.style.height = (height - 80) + 'px';
}
