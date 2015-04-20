<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>
        <?php bloginfo ( 'name'); ?>
    </title>
    <link href="<?php bloginfo ('template_url'); ?>/css/main.css" rel="stylesheet">
    <script src="<?php bloginfo ('template_url'); ?>/js/jquery-1.7.2.min.js"></script>
    <script src="<?php bloginfo ('template_url'); ?>/js/d3.min.js"></script>
    <script src="<?php bloginfo ('template_url'); ?>/js/main.js"></script>
    <!--[if lt IE 9]>
        <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
        <script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>
    <![endif]-->
</head>

<body>
    <div class="page">
        <header class="clearfix">
            <a class="logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
                <img src="<?php bloginfo ('template_url'); ?>/img/logo.jpg" alt="logo">
            </a>
        </header>
        <div class="page-title clearfix">
            <h2>NEWS & VIEWS</h2>
        </div>
        <div class="map" style="height: 641px;">Map will be here!</div>
        <div class="filters clearfix">
            <div class="title">CURRENT FILTERS</div>
            <div class="filters-wrap">
                <div class="filter">
                    <div class="text">
                        ISSUE
                        <br>AREA
                    </div>
                    <ul class="drop-down">
                        <li>some filter one</li>
                        <li>some filter two</li>
                    </ul>
                </div>
                <div class="filter">
                    <div class="text">
                        DEVELOPMENT
                        <br>STAGE
                    </div>
                    <ul class="drop-down">
                        <li>some filter one</li>
                        <li>some filter two</li>
                    </ul>
                </div>
                <div class="filter">
                    <div class="text">
                        INVESTOR
                    </div>
                    <ul class="drop-down">
                        <li>some filter one</li>
                        <li>some filter two</li>
                    </ul>
                </div>
                <div class="filter">
                    <div class="text">
                        PAYER
                    </div>
                    <ul class="drop-down">
                        <li>some filter one</li>
                        <li>some filter two</li>
                    </ul>
                </div>
                <div class="filter">
                    <div class="text">
                        SERVICE
                        <br>PROVIDER
                    </div>
                    <ul class="drop-down">
                        <li>some filter one</li>
                        <li>some filter two</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="content clearfix">
            <ul class="statistics clearfix">
                <li>
                    <p class="number">
                        {{ impact_bonds }}
                    </p>
                    <p class="text">
                        IMPACT BONDS
                    </p>
                </li>
                <li>
                    <p class="number">
                        {{ capital_raised }}<span>M</span>
                    </p>
                    <p class="text">
                        $ CAPITAL RAISED
                    </p>
                </li>
                <li>
                    <p class="number">
                        {{ lives_changed }}<span>K</span>
                    </p>
                    <p class="text">
                        LIVES CHANGED
                    </p>
                </li>
            </ul>
            <div class="chart-wrap">
                <div class="chart"></div>
                <h5>ISSUE AREA</h5>
                <div class="description">
                    {{ issue_area }}
                </div>
            </div>
            <div class="news-list">
                <h3>LATEST NEWS</h3>
                <div class="news-item">
                    <h4>{{ project_name }}</h4>
                    <div class="date">{{ launch_date }}</div>
                    <a href="#">LEARN MORE</a>
                    <div class="text">{{ project_overview }}</div>
                </div>
            </div>
        </div>
        <div class="content clearfix">
            <ul class="statistics clearfix">
                <li>
                    <p class="number">
                        {{ impact_bonds }}
                    </p>
                    <p class="text">
                        IMPACT BONDS
                    </p>
                </li>
                <li>
                    <p class="number">
                        {{ capital_raised }}<span>M</span>
                    </p>
                    <p class="text">
                        $ CAPITAL RAISED
                    </p>
                </li>
                <li>
                    <p class="number">
                        {{ lives_changed }}<span>K</span>
                    </p>
                    <p class="text">
                        LIVES CHANGED
                    </p>
                </li>
            </ul>
            <div class="chart-wrap">
                <div class="chart"></div>
                <h5>ISSUE AREA</h5>
                <div class="description">
                    {{ issue_area }}
                </div>
            </div>
            <div class="news-list">
                <h3>RECENT PROJECTS</h3>
                <div class="news-item">
                    <h4>{{ project_name }}</h4>
                    <div class="date">CAPITAL RAISED: {{ capital_raised }} M</div>
                    <a href="#">{{ issue_area }}</a>
                    <div class="text">
                        {{ project_overview }}
                    </div>
                </div>
                <div class="news-item">
                    <h4>{{ project_name }}</h4>
                    <div class="date">CAPITAL RAISED: {{ capital_raised }} M</div>
                    <a href="#">{{ issue_area }}</a>
                    <div class="text">
                        {{ project_overview }}
                    </div>
                </div>
            </div>
        </div>
        <div class="content clearfix">
            <div class="left">
                <h3>{{ project_name }}</h3>
                <a href="#">{{ issue_area }}</a>
                <div class="item">
                    <h5>LAUNCH DATE</h5>
                    <div class="text">
                        {{ launch_date }}
                    </div>
                </div>
                <div class="item">
                    <h5>DURATION</h5>
                    <div class="text">
                        {{ project_duration }} YEARS
                    </div>
                </div>
                <div class="item">
                    <h5>MAX OUTCOME PAYMENTS</h5>
                    <div class="text">
                        {{ max_outcomes_payments }} PAYMENTS
                    </div>
                </div>
                <div class="item">
                    <h5>INVESTORS</h5>
                    <div class="text">
                        {{ investors }}
                    </div>
                </div>
                <div class="item">
                    <h5>OUTCOMES FUNDER</h5>
                    <div class="text">
                        {{ outcomes_funder }}
                    </div>
                </div>
            </div>
            <div class="right">
                <ul class="statistics clearfix">
                    <li>
                        <p class="number">
                            {{ capital_raised }}<span>M</span>
                        </p>
                        <p class="text">
                            $ CAPITAL RAISED
                        </p>
                    </li>
                    <li>
                        <p class="number">
                            {{ short_sentence }}
                        </p>
                        <p class="text">
                            SHORT SENTANCE OFFENERS IMPACTED
                        </p>
                    </li>
                </ul>
                <div class="item">
                    <h4>PROJECT OVERVIEW</h4>
                    <div class="text">
                        {{ project_overview }}
                    </div>
                </div>
                <div class="item">
                    <h4>INTERVENTION & MEASUREMENT</h4>
                    <div class="text">
                        {{ intervention_and_measurment }}
                    </div>
                </div>
                <div class="item">
                    <h4>FINANCIAL DETAILS</h4>
                    <div class="text">
                        {{ financial_details }}
                    </div>
                </div>
                <div class="item">
                    <h4>THE CASE FOR A SIB</h4>
                    <div class="text">
                        {{ the_case_for_a_sib }}
                    </div>
                </div>
                <div class="item">
                    <h4>PERFORMANCE</h4>
                    <div class="text">
                        {{ performance }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
