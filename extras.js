function c(tagName) {
	return document.createElement(tagName);
}

function win(N) {
	return document.getElementById(N);
}

function n(e) {
	document.body.appendChild(e);
}

function oset(id, trans) {
	win(id).output.style.opacity = trans;
}

function oshow(id, boo) {
	win(id).output.style.display = boo? 'block': 'none';
}

function youtube(id, url) {
	var d = c('div');
	var re = /watch\?v=/;
	url = url.replace(re, 'embed/');
	url = url.split('&');
	url = url[0];
	d.innerHTML='<iframe width="100%" height="100%" src="' + url + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
	win(id).bg.appendChild(d);
	win(id).output.style.display='none';
}

function get(id, url) {
	var d = c('iframe');
	d.style.width='100%';
	d.style.height='100%';
	d.src = url;
	win(id).bg.appendChild(d);
	win(id).output.style.display='none';
}

function image(id, url) {
	var d = c('img');
	d.style.width='100%';
	d.src = url;
	win(id).bg.appendChild(d);
	oshow(id, false);
}

function clock(id) {
	win(id).interval = setInterval(function() {
		win(id).output.value = new Date();
	}, 1000);
	image(id, 'https://i.imgur.com/4hhET9w.jpg');
	oshow(id, true);
	oset(id, 0.6);
}

function video(id, url) {
	var v = c('video');
	v.style.width='100%';
	v.src = url;
	win(id).bg.appendChild(v);
	win(id).output.style.display='none';
}

function bgset(color) {
	document.body.style.backgroundColor = color;
}

function embed(id, code) {
	win(id).bg.innerHTML = code;
	oshow(id, false);
}

function clear(id) {
	win(id).bg.innerHTML = '';
	oshow(id, true);
}
