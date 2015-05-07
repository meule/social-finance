L.Path.prototype.fill = function(color){
	if (typeof color == 'string')
		this._path.setAttribute('fill', color)
	else if (typeof color == 'function')
		this._path.setAttribute('fill', color(this));
	return this;
}


L.Path.prototype.addClass = function(className){
	L.DomUtil.addClass(this._path, className);
	return this;
}

L.Path.prototype.removeClass = function(className){
	if (typeof className == 'string') 
		L.DomUtil.removeClass(this._path, className)
	else if (className.forEach)
		className.forEach(function(name){
			L.DomUtil.removeClass(this._path, name)
		})
	return this;
}

L.FeatureGroup.prototype.addClass = function(className, filter){
	this.eachLayer(function(layer){
		if (!filter || filter(layer))
			layer.addClass(className);
	})
	return this;
}

L.FeatureGroup.prototype.removeClass = function(className, filter){
	this.eachLayer(function(layer){
		if (!filter || filter(layer))
			layer.removeClass(className);
	})
	return this;
}

L.FeatureGroup.prototype.fill = function(color){
	this.eachLayer(function(layer){
		if (typeof color == 'string')
			layer.fill(color)
		else if (typeof color == 'function')
			layer.fill(color(layer));
	})
	return this;
}

L.FeatureGroup.prototype.setRadius = function(radius){
	this.eachLayer(function(layer){
		if (typeof radius == 'number')
			layer.setRadius(radius)
		else
			layer.setRadius(radius(layer));
	})
	return this;
}

L.TopoJSON = L.GeoJSON.extend({ 
	addData: function(jsonData) {  
		if (jsonData.type === "Topology") { 
			for (key in jsonData.objects) { 
				geojson = topojson.feature(jsonData, jsonData.objects[key]); 
				L.GeoJSON.prototype.addData.call(this, geojson); 
			} 
		} else { 
			L.GeoJSON.prototype.addData.call(this, jsonData); 
		} 
	} 
});

// load topojson data
function loadTopo(map,url,options,callback){  
	d3.json(url,function(error,data){
		if (error) {
			console.log(error)
		}
		console.log(data)
		if (data){
			var layer = new L.TopoJSON(data, options)
			layer.addTo(map);
			//console.log(layer)
		}
		callback()
	})			
}
