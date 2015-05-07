function mapScrollTo(sel){	
	$('html, body').animate({
		scrollTop: $(sel).offset().top
	}, 500);
}

function getURLParameter(name) { return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search[location.search.length - 1] == '/' ? location.search.substring(0, location.search.length - 1) : location.search)||[,""])[1].replace(/\+/g, '%20'))||null }

function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash,
        newUrl;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            newUrl = url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            newUrl = url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            newUrl = url;
        }
        else
            newUrl = url;
    }
    //window.location.search = newUrl;
    //history.replaceState(null, "A new title!", "http://localhost:8080/cardinal/ngo/social-finance/?country")
    return newUrl;
}

function updateUrl(newUrl, newTitle){
	history && history.replaceState && history.replaceState(null, newTitle, newUrl);
}

/*
L.FeatureGroup.prototype.setDivRadius = function(radius){
	this.eachLayer(function(layer){
		radius = typeof radius == 'number' ? radius : radius(layer);
		d3.select(layer._path).style({
			 width: radius * 2 + 'px'
			,height: radius * 2 + 'px'
			,'margin-top': -radius + 'px'
			,'margin-left': -radius + 'px'
			,'font-size': radius + 'px'
		})
		layer.text && d3.select(layer._path).text(layer.text);
	})
	return this;
}
*/
L.Popup.prototype._updatePosition = function () {
	if (!this._map) { return; }

	var pos = this._map.latLngToLayerPoint(this._latlng),
	    animated = this._animated,
	    offset = L.point(this.options.offset);

	if (animated) {
		L.DomUtil.setPosition(this._container, pos);
	}

	this._containerHeight = this._container.offsetHeight;

	this._containerBottom = -Math.round(this._containerHeight / 2) -offset.y - (animated ? 0 : pos.y);
	this._containerLeft = -Math.round(this._containerWidth) + offset.x + (animated ? 0 : pos.x);

	// bottom position the popup in case the height of the popup changes (images loading etc)
	this._container.style.bottom = this._containerBottom + 'px';
	this._container.style.left = this._containerLeft + 'px';
}

L.Path.prototype._updateStyle = function () {
	if (this.options.stroke) {
		this._path.setAttribute('stroke', this.options.color);
		this._path.setAttribute('stroke-opacity', this.options.opacity);
		this._path.setAttribute('stroke-width', this.options.weight);
		if (this.options.dashArray) {
			this._path.setAttribute('stroke-dasharray', this.options.dashArray);
		} else {
			this._path.removeAttribute('stroke-dasharray');
		}
		if (this.options.lineCap) {
			this._path.setAttribute('stroke-linecap', this.options.lineCap);
		}
		if (this.options.lineJoin) {
			this._path.setAttribute('stroke-linejoin', this.options.lineJoin);
		}
	} else {
		this._path.setAttribute('stroke', 'none');
	}
	if (this.options.fill) {
		this._path.setAttribute('fill', this.options.fillColor || this.options.color);
		this._path.setAttribute('fill-opacity', this.options.fillOpacity);
	} else {
		this._path.setAttribute('fill', 'none');
	}
	if (typeof this.options.zIndex == 'number') {
		this._container.style.zIndex = this.options.zIndex;
	}
}
