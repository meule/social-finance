$(document).ready(function () {

    // hide/show contants
    $(".contant").hide().eq(0).show();

    var showContant = 0,
        contantHideShow = function () {
            $(".contant").hide().eq(showContant).show();
        }


    // chart
    var dataset = [
        {
            id: 1,
            value: 10,
            label: 'text'
        },
        {
            id: 2,
            value: 20,
            label: 'text'
        },
        {
            id: 3,
            value: 30,
            label: 'text'
        },
        {
            id: 4,
            value: 404,
            label: 'text'
        }
        ];

    var width = 290;
    var height = 290;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 75;

    var color = d3.scale.category20b();

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
        .data(pie(dataset))
        .enter()
        .append('path')
        .attr('stroke', '#fff')
        .attr('stroke-width', '2px')
        .attr('d', arc)
        .attr('fill', function (d, i) {
            return color(d.data.id);
        });
});
