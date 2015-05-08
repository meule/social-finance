// queue lib
!function(){function n(n){function e(){for(;i=a<c.length&&n>p;){var u=a++,e=c[u],o=t.call(e,1);o.push(l(u)),++p,e[0].apply(null,o)}}function l(n){return function(u,t){--p,null==s&&(null!=u?(s=u,a=d=0/0,o()):(c[n]=t,--d?i||e():o()))}}function o(){null!=s?m(s):f?m(s,c):m.apply(null,[s].concat(c))}var r,i,f,c=[],a=0,p=0,d=0,s=null,m=u;return n||(n=1/0),r={defer:function(){return s||(c.push(arguments),++d,e()),r},await:function(n){return m=n,f=!1,d||o(),r},awaitAll:function(n){return m=n,f=!0,d||o(),r}}}function u(){}var t=[].slice;n.version="1.0.7","function"==typeof define&&define.amd?define(function(){return n}):"object"==typeof module&&module.exports?module.exports=n:this.queue=n}();

//(function(){
	
	var	 dir = window.ngoDir || ''
		,insertAfter = '#mapScript'
		,baseMapUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
		,sqlUrl = 'http://socialfinanceuk.cartodb.com/api/v2/sql/?q='
		,sql = "SELECT * FROM ngo_projects_geo"
		,sqlCountries = 'select * from world_borders&format=geojson'
		,que = queue(1)
		,pageTitle = document.title

		,map
		,data = {}
		,templates = {}

		,fixName = {
			 'England': 'United Kingdom'
			,'Scotland': 'United Kingdom'
			,'Wales': 'United Kingdom'
		}
		,colors = {
			 select: '#fff'
			,countryBorder: '#eee'
			,countryNoData: '#a7a5a6'//'#ccc'
			,countryColor: '#0073a2'
			,countryColors: [ '#a7a5a6', '#0073a2' ]
		}
		,fieldMap = {
			 id: 'id'
			,country: 'country'
			,location: 'project_name'
			,issue_area_short: 'issue_area_short'
			,service_provider: 'service_provider'
			,launch_date: 'launch_date'
			,issue_area: 'issue_area'
			,field_8: 'field_8'
			,capital_raised_m: 'capital_raised_m'
			,_: '_'
			,__people: '__people'
			,changing_lives_for: 'changing_lives_for'
			,max_outcomes_payments: 'max_outcomes_payments'
			,_2: '_2'
			,project_duration_years: 'project_duration_years'
			,active: 'project_status'
			,investors: 'investors'
			,outcomes_funder: 'outcomes_funder'
			,intermediary: 'intermediary'
			,service_provider2: 'service_provider2'
			,the_problem_incl_both_social_issue_and_brief_sib_overview: 'the_problem_incl_both_social_issue_and_brief_sib_overview'
			,the_social_value_and_economic_case: 'the_social_value_and_economic_case'
			,intervention_and_outcomes_metrics: 'intervention_and_outcomes_metrics'
			,financial_terms: 'financial_terms'
			,performance: 'performance'
			,links: 'links'
			,geo_reference: 'geo_reference'
			,lat: 'lat'
			,lng: 'lng'
			,the_geom: 'the_geom'
			,cartodb_id: 'cartodb_id'
			,created_at: 'created_at'
			,updated_at: 'updated_at'
			,the_geom_webmercator: 'the_geom_webmercator'
			,project_overview: 'project_overview'
		}
		,fieldsAsArray = [
			 'investors'
			,'outcomes_funder'
		]
		,filterNames = [
			 'issue_area'
			,'development_stage'
			,'investors'
			,'outcomes_funder'
			,'service_provider' 
		]
		,filters = {}
		,currentFilters = {}
		,currentStatusFilter = {}

	var init = function(){

		console.log('init');

		loadDeps();
		que.defer(initMain);
		que.defer(initMap);
		que.defer(loadData);
		que.defer(addCountries);
		que.defer(initMapFilter);
		//que.defer(processProjects);
		//que.defer(initMapControls);
		//que.defer(initFilters);
		que.defer(start);

	}

	var loadDeps = function(cb){
		// load scripts, css and html templates
		[
			 'd3.min.js'
			,'d3shortcuts.js'
			,'handlebars.min.js'
			,'jquery-autobars.js'
			,'leaflet.js'
			,'leaflet.plus.js'
			,'leaflet.markercluster-src.js'
			,'topojson.v1.min.js'
			,'utils.js'

		].forEach(function(s){
			que.defer(function(cb){
				$.getScript( dir + 'js/' + s , function() {
					cb();
				});
			})
		});
		
		[
			 'leaflet.css'
			,'MarkerCluster.css'
			,'MarkerCluster.Default.css'
			,'main.css'
			,'map.css'

		].forEach(function(c){
			$('<link>')
				.appendTo('head')
				.attr({type : 'text/css', rel : 'stylesheet'})
				.attr('href', dir + 'css/' + c );
		});

		que.defer(function(cb){
			$(document).autoBars({
				 partial_template_from_list: [ dir + 'templates/templates.hbs' ]
				,callback: function(a,b,c){ cb(); }
			});
			templates = $.handlebarTemplates.partials;
		});
	}

	var initMain = function(cb){
		// insert main div after our script tag and compile main template into it
		$('<div id="ngo">')
			.insertAfter(insertAfter)
			.html( templates.main() );
		cb();
	}
/*
	var initMapControls = function(cb){
		var	context = test;

		$('.map-controls').html( templates.mapcontrols(context) );

		cb();
	}
*/
	var initMapFilter = function(cb){
		d3.selectAll('#ngo .map-filter li')
			.each(function(){
				currentStatusFilter[this.id.replace('filter_status_','')] = d3.select(this).classed('active');
				console.log(this.id.replace('filter_status_',''),currentStatusFilter)
			})
			.on('click', function(){
				var status = !d3.select(this).classed('active');
				d3.select(this).classed('active', status);
				currentStatusFilter[this.id.replace('filter_status_','')] = status;
				filterProjects();
				map.mapFilterInited = true;
			});
		cb();
	}
	var initFilters = function(projects){
		console.log('initFilters',projects.length)
		projects = projects || data.projects;

		var values;

		filters.class = {};
		filterNames.forEach(function(name){
			values = [];
			projects.forEach(function(p){
				if (!p[name])
					values.push('No data')
				else if (typeof p[name] == 'string' || typeof p[name] == 'number')
					values.push({ value: p[name], visible: p.visible })
				else 
					p[name].forEach(function(value){
						values.push({ value: value, visible: p.visible })
					})
			});

			filters[name] = d3.nest()
				.key(function(d){ return d.value; })
				.entries( values )
				.map(function(d,i){ return { 
						 optionId: i + 1
						,option: d.key
						,number: d.values.length
						,filterName: name
						,class: i + 1 == currentFilters[name] ? 'active' : ( !d.values.filter(function(dd){return dd.visible;}).length ? 'hidden' :'')
					}; })
				.sort(function(a,b){ return b.number - a.number; });
			filters[name].unshift({
				 optionId: 0
				,option: 'All ' + name
				,number: projects.length
				,filterName: name
				,class: !currentFilters[name] ? 'active' : ''
			})
			filters.class[name] = currentFilters[name]  ? 'active' : '';
		})

		$('#ngo .filters').html( templates.filters(filters) );

		$('#ngo .filters li').on('click', function(){
			var params = this.id.split('-');
			changeFilter(params[1], params[2]);
		})


	}

	var changeFilter = function(filterName, optionId, isActive){
		//filterName && console.log(filterName, optionId, filters[filterName][parseInt(optionId)])
		if (!filterName) {
			for(var name in currentFilters) {
				currentFilters[name] = 0;
			}
			d3.selectAll('#ngo .map-filter li').classed('active', 1);
			for (var status in currentStatusFilter)
				currentStatusFilter[status] = true;

		} else if (filters[filterName] && filters[filterName][parseInt(optionId)]) 
			currentFilters[filterName] = parseInt(optionId);
		
		filterProjects();
	}

	var filterProjects = function(){
		var option;
		data.projects.forEach(function(project){
			project.visible = true;
			for (var name in filters){
				if (currentFilters[name]) {
					console.log(name,currentFilters[name],filters[name])
					option = filters[name][currentFilters[name] || 0].option;
					if (typeof project[name] == 'string' || typeof project[name] == 'number') {
						if ((project[name] || 'No data') != option)
							project.visible = false
					} else 
						if (project[name].indexOf(option) == -1)
							project.visible = false;
					//console.log(name,project.project_name, project[name], option || -1, project.visible)
				}
			}
			//a=d3.entries(currentStatusFilter).filter(function(d){ return d.value; }).map(function(d){ return d.key; })
			//console.log(a,project.project_status.toLowerCase(),a.indexOf(project.project_status.toLowerCase()))
			if (project.visible && d3.entries(currentStatusFilter).filter(function(d){ return d.value; }).map(function(d){ return d.key; }).indexOf(project.project_status.toLowerCase()) == -1)
				project.visible = false;

		})

		if (map.mode == 'countries') 
			showCountries()
		else if (map.mode == 'projects' || map.mode == 'project') 
			showProjects(map.currentCountry);

	}

	var initMap = function(cb){
		//var container = d3.select(opt.container).node();
		map = new L.Map('mapmap', {
			center: [50, 0]
			,zoom: 2
			,maxZoom: 10
			,minZoom: 2
			,detectRetina:true
			,zoomControl: false
			,closePopupOnClick: false
		});

		map.on('popupclose',function(){
			map.currentPopupDot = null;
		});
		map.on('popupopen', function(e){
			popupOpened(e.popup);
		});
		map.on('mouseover', function(){
			if(!map.scrolledToMap){
				map.scrolledToMap = true;
				mapScrollTo('#mapmap');
			}
		})


		// show zoom control on the right side
		new L.Control.Zoom({ position: 'topleft' }).addTo(map);

		d3.select('.reset-btn').on('click', function(){

			resetMap();
		})

		map.projects = L.featureGroup();
		// baselayer
		/*
		L.tileLayer(baseMapUrl, {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		}).addTo(map);
		*/	

		cb();
	}

	var start = function(cb){
		var parameter;

		if (parameter = getURLParameter('project')) {
			var project = data.projects.filter(function(p){ return p.project_name && p.project_name.toLowerCase() == parameter.toLowerCase(); })[0];
			if (project){
				console.log(project.country,project)
				showProjects(project.country);
				showProject(project);
			}
		} else if (parameter = getURLParameter('country'))
			showProjects(parameter)
		else 
			resetMap();
		cb();
	}

	var resetMap = function (cb){
		map.mode = 'countries';

		removeProjects();

		changeFilter();

		showCountries();

		//map.setView([20,0], 2);
		map.fitWorld();

		updateUrl( UpdateQueryString('project', null, UpdateQueryString('country')), pageTitle);

		cb && cb();
	}

	var showCountries = function (){
		map.mode = 'countries';

		var projects = data.projects.filter(function(p){ return p.visible; });

		initFilters(data.projects);

		styleCountries(projects);

		
		var	context = {
			 lives_changed: d3.sum(projects, function(d){ return d.__people; })
			,capital_raised_m: d3.format('.3r')( d3.sum(projects, function(d){ return d._; }) )
			,recent: projects.filter(function(d, i){ return i<3; })
			,impact_bonds: d3.sum(projects, function(d){ return d.capital_raised_m ? 1 : 0; })
		};

		$('#ngo .content').html( templates.countries(context) );

		makeChart(projects);

	}

	var showProjects = function (country){
		console.log('showProjects')
		map.mode = 'projects';
		map.currentCountry = country;

		var projects = data.countries[country].filter(function(p){ return p.visible; });
		//console.log(data.countries[country].length, projects.length)

		initFilters(data.countries[country]);
		
		var	context = {
			 lives_changed: d3.sum(projects, function(d){ return d.__people; })
			,capital_raised_m: d3.format('.3r')( d3.sum(projects, function(d){ return d._; }) )
			,recent: projects.filter(function(d, i){ return i<3; })
			,impact_bonds: d3.sum(projects, function(d){ return d.capital_raised_m ? 1 : 0; })
		};

		console.log(country, projects)

		showProjectsOnMap(projects, country);


		//console.log(context,templates.projects(context))
		$('#ngo .content').html( templates.projects(context) );

		makeChart(projects);

		updateUrl( UpdateQueryString('country', country, UpdateQueryString('project')), country + ' | ' + pageTitle);
	}

	var showProjectsOnMap = function(projects, country){
		console.log('showProjectsOnMap')
		
		styleCountries(projects, country);

		removeProjects();

		map.countriesMap[country] && map.fitBounds(map.countriesMap[country]);

		map.projects = new L.MarkerClusterGroup({
			 maxClusterRadius: 42
			,showCoverageOnHover: false
		});

		var  dot
			,dots
			/*
			,dotScale = d3.scale.sqrt()
				.range([ 3, 5, 10 ])
				.domain([ 1, 2, d3.max(data.countries[country], function(p){ return p.length; }) ]);
			*/

		projects.forEach(function(p){
			dot = L.circleMarker( [p.lat, p.lng], { 
				 className: 'dot' 
				,radius: 6
				,weight: 2
				,fillColor: colors.countryColors[1]
				,color: '#fff'
				,opacity: 1
				,fillOpacity: 1
			});
			dot.data = p;
			map.projects.addLayer(dot);
		})

		map.projects.addTo(map);

		map.projects.on('mouseover', function (a) {
			
			dot = a.layer;

			if (map.currentPopupDot != dot) {
				console.log('marker ', dot.data);			
				var popup = qwe = L.popup({
					 closeButton: false
					,offset: L.point(-50,0)
					,closeOnClick: true
				})
					.setLatLng(dot._latlng)
					.setContent(templates.mapproject(dot.data))

				dot.bindPopup(popup);

				popup.data = dot.data;

				dot.openPopup();

				map.currentPopupDot = dot;
			}
		});
		map.projects.on('clustermouseover', function (a) {
			dot = a.layer;
			dots = dot.getAllChildMarkers();
			dot.data = dots.map(function(d){ return d.data; });
			
			if (map.currentPopupDot != dot) {
				console.log('cluster ', dot.data);
				var popup = L.popup({
					 closeButton: false
					,offset: L.point(-70,0)
					,closeOnClick: true
				})
					.setLatLng(dot._latLng)
					.setContent(templates.mapprojects(dot.data))

				dot.bindPopup(popup);
				popup.options.offset = L.point(-104,-6);
				popup.data = dot.data;

				dot.openPopup();

				map.currentPopupDot = dot;
			}
		});		
		map.projects.on('mouseout', function (a) {
			//map.closePopup();
		});
		map.projects.on('clustermouseout', function (a) {
			//map.closePopup();
		});
	}

	var popupOpened = function(popup){
		if (popup._container && popup.data){
			if (!popup.data.length) {
				$(popup._container).on('click',function(){
					map.closePopup();
					showProject(popup.data);
				})
			} else {
				$('li', popup._container).on('click',function(){
					console.log(popup.data, this)
					map.closePopup();
					showProject(popup.data[this.id.replace('project_index_','')]);
				})				
			}
		}
	}

	var removeProjects = function(){
		//setTimeout(function(){
			map.projects && map.projects.clearLayers();
			map.projects = null;
		//},500)
	}

	var showProject = function (project){
		map.mode = 'project';
		map.currentProject = project;
		map.currentCountry = project.country;

		mapScrollTo("#ngo .filters");
		map.scrolledToMap = true;

		console.log('showProject', project)

		$('#ngo .content').html( templates.project(project) );

		updateUrl( UpdateQueryString('project', project.project_name, UpdateQueryString('country')), project.project_name + ' | ' + pageTitle);
	}

	var loadData = function(cb){
		
		/*
		d3.json( sqlUrl + sql , function(error, rawData){
			if (error) throw error;
			console.log(rawData);
			rawData = rawData.rows;
		*/
		d3.csv( dir + 'ngo_projects_geo.csv' , function(error, rawData){
			console.log(rawData);

			data.projects = [];
			var  project
				,value
				,i = 0;

			rawData.forEach(function(p){
				project = {};
				for (var field in p) {
					value = fixName[p[field]] || p[field];
					if (fieldMap[field])
						project[fieldMap[field]] = value
					else
						project[field] = value;
				}
				project._id = i++;
				data.projects.push(project);
			});

			//data.projects.sort(function(a,b){ return a.date - b.date; })

			data.countries = {};

			data.projects.forEach(function(project){
				var country = fixName[project.country] || project.country;

				for (var field in project) {
					if (fieldsAsArray.indexOf(field) != -1){
						project[field] = project[field].split(',').map(function(value){ return value.trim(); });
					}
				}
				project.visible = true;

				if (!data.countries[country])
					data.countries[country] = [];
				data.countries[country].push(project);
			});

			cb();
		})

	}

	var addCountries = function(cb){
		/*
		var countryScale = d3.scale.linear()
			.range(colors.countryColors)
			.domain([ 0, d3.max(d3.values(data.countries), function(d){ return d.length }) ]);
		*/
		map.countries = L.featureGroup();
		map.countriesMap = {};

		loadTopo(map,dir + 'js/world.topo.json',{
				 continuousWorld: true
				,onEachFeature: function (feature, layer) {
					//layer.bindPopup(feature.properties.name);
					var country;

					//console.log(feature.properties.NAME, feature.properties)

					if (country = data.countries[feature.properties.NAME])
						layer.country = feature.properties.NAME

					else if (country = data.countries[feature.properties.ISO3])
						layer.country = feature.properties.ISO3;

					layer.data = country;

					if (layer.country)
						map.countriesMap[layer.country] = layer;


					//layer.country && console.log(layer.country, feature.properties);


					//layer.fillColor = country && country.length ? countryScale(country.length) : colors.countryNoData;
					//layer.color = country && country.length ? colors.countryBorder : colors.countryNoData;

					layer.on('click', function(e){
						console.log(layer.country,layer);
						showProjects(layer.country);
					});
					map.countries.addLayer(layer);
				}

			},function(){

				

				map.countries.addClass('withData', function(layer){
					return layer.data;
				});

				map.countries.eachLayer(function(layer){	
					if (layer.data){
						//layer.setZIndex(100);
					}
				})

				styleCountries(data.projects);

				cb();
		})


		//countryScale.domain([ 0, 100 ]);
/*
		//d3.json( sqlUrl + sqlCountries , function(error, geojson){
		d3.json( 'world.geojson' , function(error, geojson){
			if (error) throw error;
			console.log(geojson);

			map.countriesMap = {};

			L.geoJson(geojson, {
				onEachFeature: function (feature, layer) {
					//layer.bindPopup(feature.properties.name);
					var country;

					if (country = data.countries[feature.properties.name])
						layer.country = feature.properties.name

					else if (country = data.countries[feature.properties.iso3])
						layer.country = feature.properties.iso3

					else if (country = data.countries[feature.properties.iso2])
						layer.country = feature.properties.iso2;

					layer.data = country;

					if (layer.country)
						map.countriesMap[layer.country] = layer;


					//layer.country && console.log(layer.country, feature.properties);


					//layer.fillColor = country && country.length ? countryScale(country.length) : colors.countryNoData;
					//layer.color = country && country.length ? colors.countryBorder : colors.countryNoData;

					layer.on('click', function(e){
						//console.log(layer);
						showProjects(layer.country);
					});
					map.countries.addLayer(layer);
				}
			}).addTo(map);

			map.countries.addClass('withData', function(layer){
				return layer.data;
			});

			map.countries.eachLayer(function(layer){	
				if (layer.data){
					layer.setZIndex(100);
				}
			})

			styleCountries(data.projects);

			cb();
		});
*/
	}

	var styleCountries = function(projects, country){
		map.countries.eachLayer(function(layer){
			var visible = !country && layer.country && projects.map(function(p){ return p.country; }).indexOf(layer.country)!=-1;
			//layer.country && console.log(layer.country,layer.data, layer);
			layer.setStyle({
				 fillColor: visible ? colors.countryColor : colors.countryNoData
				,color: visible ? colors.countryBorder : colors.countryNoData
				,weight: 2//(!layer.data || country == layer.country) ? 2 : 1
				,fillOpacity: 1
				,opacity: 1
				,lineJoin: 'round'
				//,zIndex: layer.data ? (country == layer.country ? 10 : 5 ) : 1
			})
		})
	}

	var makeChart = function(projects){

		var chartData = d3.nest().key(function(d){ return d.issue_area; })
			.entries(projects)
			.map(function(d){ return {
				 label: d.key
				,value: d.values.length
			} })
			.sort(function(a,b){ return b.value - a.value; });

		var width = 290;
		var height = 290;
		var radius = Math.min(width, height) / 2;
		var donutWidth = 75;

		var color = d3.scale.category20c();

		var svg = d3.selectAll('.chart')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', 'translate(' + (width / 2) +
				',' + (height / 2) + ')');

		var arc = d3.svg.arc()
			.innerRadius(radius - donutWidth)
			.outerRadius(radius);

		var pie = d3.layout.pie()
			.value(function (d) {
				return d.value;
			})
			.sort(null);

		var path = svg.selectAll('path')
			.data(pie(chartData))
			.enter()
			.append('path')
			.attr('stroke', '#fff')
			.attr('stroke-width', '2px')
			.attr('d', arc)
			.attr('fill', function (d, i) {
				//console.log(d);
				return color(d.data.label);
			})
			.on('mouseover',function(d){
				d3.select('#ngo .chart-wrap h5').text(d.data.label);
				d3.select('#ngo .chart-wrap div.description').text(d.value == 1 ? '1 project' : d.value + ' projects');
			})
			.on('mouseout',function(d){
				d3.select('#ngo .chart-wrap h5').text('');
				d3.select('#ngo .chart-wrap div.description').text('');
			})
	}

	init();

//})()