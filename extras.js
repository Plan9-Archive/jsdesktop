function c(tagName) {
	return document.createElement(tagName);
}

function win(N) {
	return document.getElementById(N);
}

function n(e) {
	document.body.appendChild(e);
}

function youtube(id, url) {
	var d = c('div');
	var re = /watch\?v\=/
	url.replace(re, 'embed/');
	d.innerHTML='<iframe width="100%" height="100%" src="' + url + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
	document.getElementById(id).bg.appendChild(d);
	document.getElementById(id).output.style.display='none';
}

function get(id, url) {
	var d = c('iframe');
	d.style.width='100%';
	d.style.height='100%';
	d.src = url;
	document.getElementById(id).bg.appendChild(d);
	document.getElementById(id).output.style.display='none';
}

function image(id, url) {
	var d = c('img');
	d.style.width='100%';
	d.src = url;
	document.getElementById(id).bg.appendChild(d);
	document.getElementById(id).output.style.display='none';
}

function clock(id) {
	document.getElementById(id).interval = setInterval(function() {
		document.getElementById(id).output.value = new Date();
	}, 1000);
}
