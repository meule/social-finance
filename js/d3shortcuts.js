
/* d3js style selection shortcuts by Konstantin@Varik.ru */

(function(){
	d3.selection.prototype.opacity =
	d3.selection.enter.prototype.opacity =
	d3.transition.prototype.opacity =
	function(opacity){
		if (typeof opacity == 'number')
			return this.style('opacity', opacity)
		else
			return this.style('opacity');
	};
})();
(function(){
	d3.selection.prototype.display =
	d3.selection.enter.prototype.display =
	function(display){
		if (display==0)
			return this.style('display', 'none');
		if (display==1)
			return this.style('display', null);
		if (!display)
			return this.style('display') == 'none' ? false : true;
	};
})();
(function(){
	d3.selection.prototype.show =
	d3.selection.enter.prototype.show =
	d3.transition.prototype.show =
	function(duration,delay){
		if (duration > 0 || delay > 0) 
			if (delay > 0)
				return this.display(1).transition().duration(duration).delay(delay).opacity(1);
			else
				return this.display(1).transition().duration(duration).opacity(1);
		else 
			return this.opacity(1).display(1)
	};
})();

(function(){
	d3.selection.prototype.hide =
	d3.selection.enter.prototype.hide =
	d3.transition.prototype.hide =
	function(duration,delay){
		if (duration > 0 || delay > 0) 
			if (delay > 0)
				return this.transition().duration(duration).delay(delay).opacity(0).each('end', function(){ return d3.select(this).display(0); })
			else
				return this.transition().duration(duration).opacity(0).each('end', function(){ return d3.select(this).display(0); })
		else 
			return this.opacity(0).display(0)
	};
})();

(function(){
	d3.selection.prototype.id =
	d3.selection.enter.prototype.id =
	d3.transition.prototype.id =
	function(id){
		if (arguments.length)
			return this.attr('id', id)
		else
			return this.attr('id');
	};
})();

(function(){
	d3.selection.prototype.class =
	d3.selection.enter.prototype.class =
	d3.transition.prototype.class =
	function(className){
		if (arguments.length)
			return this.classed(className, 1)
		else
			return this.classed(className);
	};
})();

