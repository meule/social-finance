$(document).ready(function () {

    // data
    var context = {
        project_name: 'PETERBOROUGH SIB UPDATE',
        launch_date: 'JUNE 10, 2015',
        project_overview: 'Lorem ipsum dolor...',
        capital_raised: '5',
        issue_area: 'Criminal Justice',
        service_provider: 'The One Service',
        investors: 'Barrow Cadbury Trust, Esmee Fairburn Foundation, Friends Provident Foundation, The Henry Smith Charity, Johansson Family Foundation, LankellyChase Foundation, The Monument Trust, Panaphur, Paul Hamlyn Foundation, Tudor Trust',
        max_outcomes_payments: '8',
        outcomes_funder: 'Ministry of Justice, Big Society Capital',
        project_duration: '5',
        intervention_and_measurment: 'The One* Service...',
        financial_details: 'Investors receive outcomes...',
        the_case_for_a_sib: 'The total one-off cost...',
        performance: 'Results from the independent...',
        short_sentence: '3 000',
        impact_bonds: '10',
        lives_changed: '10'
    }

    var issue_area_filter = [
        {
            filter: "option1"
        },
        {
            filter: "option2"
        },
        {
            filter: "option3"
        },
        {
            filter: "clearFilter"
        }
    ]


    // map filter
    $(".map .filter li").toggle(function () {
        $(this).addClass('active');
    }, function () {
        $(this).removeClass('active');
    });


    // hide/show contents
    $(".content").hide().eq(1).show();

    var contentHideShow = function (showContent) {
        $(".content").hide().eq(showContent).show();
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
