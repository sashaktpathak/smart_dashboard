/**--------------------------------global variables----------------------------------------------------------------- */
var locationid;
var totallocations = 0;
var viewid = 0;
var group_count = 0;
var scrollOff = 0;
var linechartval = [], sublinechartval = [];
var alllinecharts = [], allsublinecharts = [];
var tempcomparedrpli;
$(document).ready(function () {
    /** -----------------------------Map Formation-------------------------------------------------- */
    var map = L.map('map-area').setView([28.7041, 77.1025], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    /**--------------------------------loading header------------------------------------------------ */

    $('header').load('header.html', function () {
        //loading locations
        $.ajax({
            type: 'GET',
            data: {},
            dataType: 'json',
            url: '/getLocations',
            async: false,
            success: function (data) {
                locationid = data[0].id;
                console.log($('.passed_user_id').val())
                $.ajax({
                    type: 'POST',
                    data: {},
                    dataType: 'json',
                    url: '/getUsersProperty',
                    async: false,
                    success: function (datanew) {
                        for (j = 0; j < datanew.length; j++) {
                            if ((datanew[j].user_id == $('.passed_user_id').val())) {
                                for (t = 0; t < data.length; t++) {
                                    if ((datanew[j].locationid == data[t].id)) {
                                        $('.drpmn').append("<li class='drpmnli'>" + data[t].location + "<input type='hidden' class='stored_location_id' value='" + data[t].id + "'></li>")
                                    }
                                }
                            }
                        }
                    },
                    error: function () {
                        console.log("Errorr!!");
                    }
                })
                totallocations = data.length;
            },
            error: function (err) {
                console.log("Error!!", err)
            }
        })
        /**-----------------------------------loading button matrix--------------------------------------------- */
        $('.matrix-area').load('matrix.html', function () {
            getGroupCount();
            createBarandPieChart();
            formmatrix();
            createCharts();
            createSubCharts();
            loadComparebtnData();
            btnclicked();
            comparedata();
        })
        $('.drpmnli').click(function () {
            locationid = parseInt($(this).find('.stored_location_id').val());
            RefreshAll();
        })
        $('.viewdrpli').click(function () {
            $('.view_text').html($(this).text().toUpperCase())
            if ($(this).text().trim() == 'Daily') {
                viewid = 0;
            }
            else if ($(this).text().trim() == 'Weekly') {
                viewid = 1;
            }
            else if ($(this).text().trim() == 'Monthly') {
                viewid = 2;
            }
            $('.custom_from_date').val("")
            $('.custom_to_date').val("")
            RefreshAll();
        })
        $('.custom_from_date').change(function () {
            var text = 'CUSTOM<br>FROM: ' + $('.custom_from_date').val();
            $('.custom_to_date').val("")
            viewid = 3;
            $('.view_text').html(text)
            RefreshAll();
        })
        $('.custom_to_date').change(function () {
            var text = 'CUSTOM<br>FROM: ' + $('.custom_from_date').val() + '<br>TO: ' + $('.custom_to_date').val();
            RefreshAll();
            $('.view_text').html(text)
        })
    })
    /**------------------------------------loading footer--------------------------------------------- */
    $('footer').load('footer.html')
    /**-------------------------------------functions----------------------------------------------------- */
    //Creating Bar chart
    function createBarandPieChart() {
        ctx = document.getElementsByClassName('big-chart')[0].getContext('2d')
        window.mybar = new Chart(ctx, bar_config)

        ctx = document.getElementById('pie-chart-area').getContext('2d');
        window.myPie = new Chart(ctx, pie_config);

        ctx2 = document.getElementsByClassName('efficiency-chart')[0].getContext('2d')
        window.bar2 = new Chart(ctx2, bar_config2)
    }
    //Forming Matrix
    function formmatrix() {
        $.ajax({
            type: 'POST',
            url: '/getGroups',
            dataType: 'json',
            data: { location_id: locationid, count: group_count },
            async: false,
            success: function (data) {
                $('.matrix-div').html(' ');
                for (var itr = 0; itr < data.length; itr++) {
                    var temphtml = $('.matrix-div').html();
                    var temp;
                    var btntype = '', imagetype = '';
                    if (data[itr].status == 0) {
                        imagetype = 'lightning-low.svg';
                        btntype = 'inactive';
                    }
                    else {
                        imagetype = 'lightning.svg'
                        if (data[itr].energy == 0)
                            btntype = 'low';
                        else
                            btntype = 'high';
                    }
                    if (data[itr].subgroup == 0) {
                        temp = ' <div class="group-btn ' + btntype + '"><div class="group-btn-title">' + data[itr].group_name + '<input type="hidden" class="group-id" value="' + data[itr].group_id + '"></div><img src="images/' + imagetype + '" class="bolt bolt-icon" width="50"><strong class="energy" > ' + data[itr].energy + ' Kwh.</strong ></div > ';
                    }
                    else {
                        temp = ' <div class="room group-btn ' + btntype + '"><div class="group-btn-title">' + data[itr].group_name + '<input type="hidden" class="group-id" value="' + data[itr].group_id + '"></div><div class="subrooms"><ul class="room_list"><li class="all-room"><b>View All</b></li>';
                        $.ajax({
                            type: 'POST',
                            data: { location_id: locationid, parentgroup_id: data[itr].group_id },
                            dataType: 'json',
                            url: '/getSubGroupsCount',
                            async: false,
                            success: function (datacount) {
                                $.ajax({
                                    type: 'POST',
                                    dataType: 'json',
                                    data: { location_id: locationid, parentgroup_id: data[itr].group_id, sgcount: datacount[0].sgcount },
                                    url: '/getSubGroups',
                                    async: false,
                                    success: function (datanew) {
                                        for (var itr2 = 0; itr2 < datanew.length; itr2++) {
                                            temp = temp + '<li class="roomli">' + datanew[itr2].subgroup_name + ' ' + datanew[itr2].energy + 'Kwh. </li>'
                                        }
                                    },
                                    error: function (err) {
                                        console.log("Error!!", err);
                                    }
                                })
                            },
                            error: function (err) {
                                console.log("Error!!", err);
                            }
                        })
                        temp = temp + '</ul></div><img src="images/' + imagetype + '" class="bolt bolt-icon" width="50"><strong class="energy">' + data[itr].energy + ' Kwh.</strong></div>';
                    }
                    $('.matrix-div').html(temphtml + temp);
                }

            },
            error: function (err) {
                console.log("Error!! ", err)
            }
        })
        $('.all-room').click(function () {
            scrollOff = 1;
            var temptext = $(this).text();
            $(this).text('sometext');
            var itr = 0;
            $('.all-room').each(function () {
                if ($(this).text() == 'sometext') {
                    $('.room-matrix').html('<div class="back-btn">Go Back<br><br><img src="images/left-arrow.svg" class="goback-btn" width="70"></div>')
                    var group_idtemp = $(this).parent().parent().parent().find('.group-id').val();
                    $('.matrix-div').css('display', 'none');
                    $('.room-matrix').css('display', 'flex');
                    $.ajax({
                        type: 'POST',
                        data: { location_id: locationid, parentgroup_id: group_idtemp },
                        dataType: 'json',
                        url: '/getSubGroupsCount',
                        async: false,
                        success: function (datacount) {
                            $.ajax({
                                type: 'POST',
                                dataType: 'json',
                                data: { location_id: locationid, parentgroup_id: group_idtemp, sgcount: datacount[0].sgcount },
                                url: '/getSubGroups',
                                async: false,
                                success: function (datanew) {
                                    for (var itr2 = 0; itr2 < datanew.length; itr2++) {
                                        var btntype = '', imagetype = '';
                                        if (datanew[itr2].status == 0) {
                                            imagetype = 'lightning-low.svg';
                                            btntype = 'inactive';
                                        }
                                        else {
                                            imagetype = 'lightning.svg'
                                            if (datanew[itr2].energy == 0)
                                                btntype = 'low';
                                            else
                                                btntype = 'high';
                                        }
                                        temp = ' <div class="group-btn ' + btntype + '"><div class="group-btn-title">' + datanew[itr2].subgroup_name + '</div><img src="images/' + imagetype + '" class="bolt bolt-icon" width="50"><strong class="energy" > ' + datanew[itr2].energy + ' Kwh.</strong ></div > ';
                                        var temphtml = $('.room-matrix').html();
                                        $('.room-matrix').html(temphtml + temp);
                                    }
                                    $('.back-btn').click(function () {
                                        $('.matrix-div').css('display', 'flex');
                                        $('.room-matrix').css('display', 'none');
                                    })
                                },
                                error: function (err) {
                                    console.log("Error!!", err);
                                }
                            })
                        },
                        error: function (err) {
                            console.log("Error!!", err);
                        }
                    })
                }
                itr++;
            })
            $(this).text(temptext);
            scrollOff = 0;
        })
        scrollGroup();
    }
    //creating groups chart
    function createCharts() {
        $('.group-charts-area').html(' ');
        for (var i = 0; i < group_count; i++) {
            var temphtml = $('.group-charts-area').html();
            var temp = '<div class="col col-sm-6 col-md-4 group' + (i + 1) + '"><div class="display-flex3">Chart ' + (i + 1) + ' <button class="btn btn-primary btn-compare" > Compare</button ></div><input type="hidden" class="compare-val" value="0"><div class="compare-area"><ul class="compare-list"><li class="compare-date">By View<input type="hidden" class="date-val" value="0"><input type="date" class="custom_date custom_compare_date"></li><li class="compare-location">By Location<ul class="compare-location-list"></ul></li><li>By Group<ul class="compare-group-list"></ul></li></ul></div><canvas class="line-chart" id="line-canvas' + (i + 1) + '"></canvas></div> ';
            $('.group-charts-area').html(temphtml + temp);
        }
        alllinecharts = $('.line-chart');
        generateCharts();
    }
    //creating sub group chart
    function createSubCharts() {
        $('.rooms-chart').html(' ');
        $.ajax({
            type: 'GET',
            data: { locationid: locationid },
            dataType: 'json',
            url: '/getdistinctsubgroups',
            async: false,
            success: function (data) {
                for (itr = 0; itr < data.length; itr++) {
                    var temphtml = $('.rooms-chart').html();
                    var temp = '<div class="col col-sm-6 col-md-4 subgroup' + (itr + 1) + '"><div class="display-flex3"><span class="subgroup-name">' + data[itr].subgroup_name + ' </span><button class="btn btn-primary btn-compare" > Compare</button ></div><input type="hidden" class="compare-val" value="0"><div class="compare-area"><ul class="compare-list"><li class="compare-date">By View<input type="hidden" class="date-val" value="0"><input type="date" class="custom_date custom_compare_date"></li><li class="compare-location">By Location<ul class="compare-location-list"></ul></li><li>By Group<ul class="compare-subgroup-list"></ul></li></ul></div><canvas class="line-subchart" id="line-subcanvas' + (i + 1) + '"></canvas></div> ';
                    $('.rooms-chart').html(temphtml + temp);
                }
            },
            error: function (err) {
                console.log("Error!!", err)
            }
        })
        allsublinecharts = $('.line-subchart');
        generateSubCharts();
    }
    //Generating data
    function generateCharts() {
        var chartdata;
        for (grp_id = 1; grp_id <= group_count; grp_id++) {
            if (viewid != 3)
                chartdata = getChartData(new Date(), '', grp_id);
            else
                chartdata = getChartData($('.custom_from_date').val(), $('.custom_to_date').val(), grp_id);
            line_config.data.labels = chartdata[0];
            line_config.data.datasets[0].data = chartdata[1];
            line_config.data.datasets[0].label = chartdata[2];
            ctx = alllinecharts[grp_id - 1].getContext('2d')
            window.myLine = new Chart(ctx, line_config);
            linechartval[grp_id - 1] = window.myLine;
            window.myLine.update()


            barChartData.datasets[grp_id - 1].data = chartdata[1];
            barChartData.labels = chartdata[0];
            barChartData.datasets[grp_id - 1].label = chartdata[2];
            window.mybar.update();
        }
        if (viewid != 3)
            piechartdata(new Date(2019, 5, 28), '');
        else
            piechartdata($('.custom_from_date').val(), $('.custom_to_date').val());
    }

    //comparedata
    function comparedata() {
        $('.compare-date').click(function () {
            var itr = 0;
            var dataOriginal, dataSecondary;
            var tempdate = -1;
            $(this).find('.date-val').val("1")
            $('.compare-date').each(function () {
                if ($(this).find('.date-val').val() == "1") {
                    if (itr < 12) {
                        dataOriginal = getChartData(new Date(), '', itr + 1);
                        if ($(this).find('.custom_compare_date').val() == undefined || $(this).find('.custom_compare_date').val() == '') {
                            dataSecondary = getChartData(new Date(), '', itr + 1);
                        }
                        else {
                            tempdate = $(this).find('.custom_compare_date').val()
                            dataSecondary = getChartData(new Date(tempdate.slice(0, 4), tempdate.slice(5, 7), tempdate.slice(8, 10)), '', itr + 1);
                        }
                        generateComapreChart(dataOriginal, dataSecondary, itr, tempdate);
                    }
                    else {
                        dataOriginal = getSubChartData(new Date(), '', $(this).parent().parent().parent().find('.subgroup-name').text())
                        if ($(this).find('.custom_compare_date').val() == undefined || $(this).find('.custom_compare_date').val() == '') {
                            dataSecondary = getSubChartData(new Date(), '', $(this).parent().parent().parent().find('.subgroup-name').text());
                        }
                        else {
                            tempdate = $(this).find('.custom_compare_date').val()
                            dataSecondary = getSubChartData(new Date(tempdate.slice(0, 4), tempdate.slice(5, 7), tempdate.slice(8, 10)), '', $(this).parent().parent().parent().find('.subgroup-name').text());
                        }
                        generateComapreSubChart(dataOriginal, dataSecondary, itr - 12, tempdate)
                    }
                }
                itr++;
            })
            $(this).find('.date-val').val("0")
        })
        $('.location-list').click(function () {
            var locationidt = parseInt($(this).text())
            var itr = 0;
            var dataOriginal, dataSecondary;
            $(this).parent().parent().parent().find('.date-val').val("1")

            $('.compare-date').each(function () {
                if ($(this).find('.date-val').val() == "1") {
                    if (itr < 12) {
                        dataOriginal = getChartData(new Date(), '', itr + 1)
                        dataSecondary = getChartData(new Date(), '', itr + 1, locationidt)
                        generateComapreChart(dataOriginal, dataSecondary, itr, -1, locationidt);
                    }
                    else {
                        dataOriginal = getSubChartData(new Date(), '', $(this).parent().parent().parent().find('.subgroup-name').text())
                        dataSecondary = getSubChartData(new Date(), '', $(this).parent().parent().parent().find('.subgroup-name').text(), locationidt)
                        generateComapreSubChart(dataOriginal, dataSecondary, itr - 12, -1, locationidt);
                    }
                }
                itr++;
            });
            $(this).parent().parent().parent().find('.date-val').val("0");
        })
        $('.group-list').click(function () {
            var itr = 0, itr_groupno = 0, itr2_groupno = 0, itr2 = 0;
            var dataOriginal, dataSecondary;
            var temptext = $(this).text();
            $(this).parent().parent().parent().find('.date-val').val("1")

            $('.compare-date').each(function () {
                if ($(this).find('.date-val').val() == "1") {
                    itr_groupno = itr;
                }
                itr++;
            });
            $(this).parent().parent().parent().find('.date-val').val("0");
            $('.group-list').each(function () {
                if (temptext == $(this).text()) {
                    itr2_groupno = itr2;
                }
                itr2++;
            })
            if (itr_groupno <= itr2_groupno) {
                itr2_groupno = itr2_groupno + 1;
            }
            itr2_groupno = itr2_groupno - 133;
            dataOriginal = getChartData(new Date(), '', itr_groupno + 1);
            dataSecondary = getChartData(new Date(), '', itr2_groupno + 1);
            generateComapreChart(dataOriginal, dataSecondary, itr_groupno, -1, 0, temptext)
        })
        $('.subgroup-list').click(function () {
            var itr = 0, itr_groupno = 0, itr2_groupno = 0, itr2 = 0;
            var dataOriginal, dataSecondary;
            var temptext = $(this).text();
            $(this).parent().parent().parent().find('.date-val').val("1")

            $('.compare-date').each(function () {
                if ($(this).find('.date-val').val() == "1") {
                    itr_groupno = itr;
                }
                itr++;
            });
            itr_groupno = itr_groupno - 12;
            $(this).parent().parent().parent().find('.date-val').val("0");
            $('.subgroup-list').each(function () {
                if (temptext == $(this).text()) {
                    itr2_groupno = itr2;
                }
                itr2++;
            })
            if (itr_groupno <= itr2_groupno) {
                itr2_groupno = itr2_groupno + 1;
            }
            itr2_groupno = itr2_groupno - 290;
            dataOriginal = getSubChartData(new Date(), '', $(this).parent().parent().parent().parent().parent().find('.subgroup-name').text());
            dataSecondary = getSubChartData(new Date(), '', temptext);
            generateComapreSubChart(dataOriginal, dataSecondary, itr_groupno, -1, 0, temptext)
        })
    }
    //Generate compare chart
    function generateComapreChart(dataOriginal, dataSecondary, itr, tempdate, locationidt, secondarygroup) {
        line_config.data.labels = dataOriginal[0];
        var lableOriginal = 'Original'
        if (tempdate == -1)
            tempdate = 'Previous';
        else
            tempdate = tempdate;
        if (locationidt) {
            lableOriginal = 'Location' + locationid;
            tempdate = 'Location' + locationidt
        }
        if (secondarygroup) {
            lableOriginal = 'Original';
            tempdate = secondarygroup;
        }
        if (dataSecondary[2] == '' || dataSecondary[2] == undefined)
            tempdate = 'Data Unavailable!';
        var ajx = {
            label: tempdate,
            backgroundColor: window.chartColors.orange,
            borderColor: window.chartColors.orange,
            data: dataSecondary[1],
            fill: false
        };
        line_config.data.datasets[1] = ajx;
        ajx = {
            label: lableOriginal,
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: dataOriginal[1],
            fill: false
        };
        line_config.data.datasets[0] = ajx;
        //ctx = alllinecharts[itr].getContext('2d')
        //window.myLine = new Chart(ctx, line_config);
        //linechartval[itr] = window.myLine;
        linechartval[itr].update()
        console.log("ihi", itr)
    }
    //Generate comapre sub charts
    function generateComapreSubChart(dataOriginal, dataSecondary, itr, tempdate, locationidt, secondarygroup) {
        line_config.data.labels = dataOriginal[0];
        var lableOriginal = 'Original'
        if (tempdate == -1)
            tempdate = 'Previous';
        if (locationidt) {
            lableOriginal = 'Location' + locationid;
            tempdate = 'Location' + locationidt
        }
        if (dataSecondary[2] == '' || dataSecondary[2] == undefined)
            tempdate = 'Data Unavailable!';
        if (secondarygroup) {
            lableOriginal = 'Original';
            tempdate = secondarygroup;
        }
        var ajx = {
            label: tempdate,
            backgroundColor: window.chartColors.orange,
            borderColor: window.chartColors.orange,
            data: dataSecondary[1],
            fill: false
        };
        line_config.data.datasets[1] = ajx;
        ajx = {
            label: lableOriginal,
            backgroundColor: window.chartColors.blue,
            borderColor: window.chartColors.blue,
            data: dataOriginal[1],
            fill: false
        };
        line_config.data.datasets[0] = ajx;
        //ctx = allsublinecharts[itr].getContext('2d')
        sublinechartval[itr].update()
    }
    //Retrieving Chart Data
    function getChartData(date1, date2, grp_id, locationidt) {
        if (locationidt == undefined)
            locationidt = locationid

        if (typeof date1 != "string") {
            var dd = String(date1.getDate()).padStart(2, '0');
            var mm = String(date1.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = date1.getFullYear();
            mm = 6;
            date1temp = yyyy + '-' + '06' + '-28';
        }
        var labels = [], energy = [], grpname;
        if (viewid == 0) {
            $.ajax({
                type: 'POST',
                data: { locationid: locationidt, group_id: grp_id, date: date1temp },
                dataType: 'json',
                url: '/getLinesData',
                async: false,
                success: function (data) {
                    for (itr = 0; itr < data.length; itr++) {
                        labels[itr] = data[itr].time;
                        energy[itr] = data[itr].energy;
                    }
                    if (data.length)
                        grpname = data[0].group_name;
                },
                error: function (err) {
                    console.log("Error!!", err);
                }
            })
        }
        else if (viewid == 1) {
            date1temp = new Date(yyyy, 5, 29);
            labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            $.ajax({
                type: 'POST',
                data: { locationid: locationidt, group_id: grp_id, weekid: date1temp.getWeek() },
                dataType: 'json',
                url: '/getWeeklyLinesData',
                async: false,
                success: function (data) {
                    for (itr = 0; itr < data.length; itr++) {
                        if (energy[labels.indexOf(data[itr].dayname)] == '' || energy[labels.indexOf(data[itr].dayname)] == undefined || energy[labels.indexOf(data[itr].dayname)] == '0')
                            energy[labels.indexOf(data[itr].dayname)] = data[itr].energy;
                        else
                            energy[labels.indexOf(data[itr].dayname)] = energy[labels.indexOf(data[itr].dayname)] + data[itr].energy;
                    }
                    if (data.length)
                        grpname = data[0].group_name;
                },
                error: function (err) {
                    console.log("Error!!", err);
                }
            })
        }
        else if (viewid == 2) {
            date1temp = yyyy + '-' + '06' + '-';
            if (mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12) {
                for (j = 1; j <= 31; j++) {
                    labels[j - 1] = date1temp + j;
                }
            }
            else if (mm == 2) {
                for (j = 1; j <= 28; j++) {
                    labels[j - 1] = date1temp + j;
                }
            }
            else {
                for (j = 1; j <= 30; j++) {
                    labels[j - 1] = date1temp + j;
                }
            }
            $.ajax({
                type: 'POST',
                data: { locationid: locationidt, group_id: grp_id, monthid: mm },
                dataType: 'json',
                url: '/getMonthlyLinesData',
                async: false,
                success: function (data) {
                    for (var itr = 0; itr < data.length; itr++) {
                        if (energy[data[itr].day - 1] == '' || energy[data[itr].day - 1] == undefined || energy[data[itr].day - 1] == '0')
                            energy[data[itr].day - 1] = data[itr].energy;
                        else
                            energy[data[itr].day - 1] = energy[data[itr].day - 1] + data[itr].energy;
                    }
                    if (data.length)
                        grpname = data[0].group_name;
                },
                error: function (err) {
                    console.log("Error!!", err)
                }
            })

        }
        else if (viewid == 3 && (date2 == undefined || date2 == '')) {
            $.ajax({
                type: 'POST',
                data: { locationid: locationidt, group_id: grp_id, date: date1 },
                dataType: 'json',
                url: '/getLinesData',
                async: false,
                success: function (data) {
                    for (itr = 0; itr < data.length; itr++) {
                        labels[itr] = data[itr].time;
                        energy[itr] = data[itr].energy;
                    }
                    if (data.length)
                        grpname = data[0].group_name;
                },
                error: function (err) {
                    console.log("Error!!", err);
                }
            })
        }
        else if (viewid == 3) {
            var mm, dd, yyyy;
            var dateArray = getDates(new Date(parseInt(date1.slice(0, 4)), parseInt(date1.slice(5, 7)) - 1, parseInt(date1.slice(8, 10)) + 1), new Date(parseInt(date2.slice(0, 4)), parseInt(date2.slice(5, 7)) - 1, parseInt(date2.slice(8, 10)) + 1));
            for (itr = 0; itr < dateArray.length; itr++) {
                dd = String(dateArray[itr].getDate()).padStart(2, '0');
                mm = String(dateArray[itr].getMonth() + 1).padStart(2, '0'); //January is 0!
                yyyy = dateArray[itr].getFullYear();
                labels[itr] = yyyy + '-' + mm + '-' + dd;
            }
            $.ajax({
                type: 'POST',
                data: { locationid: locationidt, group_id: grp_id, fromdate: date1, todate: date2 },
                dataType: 'json',
                url: '/getCustomLinesData',
                async: false,
                success: function (data) {
                    for (itr = 0; itr < data.length; itr++) {
                        energy[labels.indexOf(data[itr].dates.slice(0, 10))] = data[itr].energy;
                    }
                    if (data.length)
                        grpname = data[0].group_name;
                },
                error: function (err) {
                    console.log("Error!!", err);
                }
            })
        }
        return [labels, energy, grpname]
    }
    //Generating Sub data
    function generateSubCharts() {
        var chartdata;
        $.ajax({
            type: 'GET',
            data: { locationid: locationid },
            dataType: 'json',
            url: '/getdistinctsubgroups',
            async: false,
            success: function (data) {
                for (subgrp_id = 1; subgrp_id <= data.length; subgrp_id++) {
                    if (viewid != 3)
                        chartdata = getSubChartData(new Date(), '', data[subgrp_id - 1].subgroup_name);
                    else
                        chartdata = getSubChartData($('.custom_from_date').val(), $('.custom_to_date').val(), data[subgrp_id - 1].subgroup_name);
                    line_config.data.labels = chartdata[0];
                    line_config.data.datasets[0].data = chartdata[1];
                    line_config.data.datasets[0].label = chartdata[2];
                    ctx = allsublinecharts[subgrp_id - 1].getContext('2d')
                    window.myLine = new Chart(ctx, line_config);
                    sublinechartval[subgrp_id - 1] = window.myLine;
                    window.myLine.update()
                }
            },
            error: function (err) {
                console.log("Error!!", err)
            }
        })
    }
    //Getting Sub Groups
    function getSubChartData(date1, date2, subgroup_name, locationidt) {
        if (locationidt == undefined)
            locationidt = locationid;
        locationid = parseInt(locationid);
        if (typeof date1 != "string") {
            var dd = String(date1.getDate()).padStart(2, '0');
            var mm = String(date1.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = date1.getFullYear();
            mm = 6;
            date1temp = yyyy + '-' + '07' + '-01';
        }
        var labels = [], energy = [], grpname;
        if (viewid == 0) {
            $.ajax({
                type: 'POST',
                data: { locationid: locationidt, date: date1temp, subgroup_name: subgroup_name },
                dataType: 'json',
                url: '/getSubLinesData',
                async: false,
                success: function (data) {
                    for (itr = 0; itr < data.length; itr++) {
                        labels[itr] = data[itr].time.slice(11, 19);
                        energy[itr] = data[itr].energy;
                    }
                    if (data.length)
                        grpname = data[0].subgroup_name;
                },
                error: function (err) {
                    console.log("Error!!", err);
                }
            })
        }
        else if (viewid == 1) {
            date1temp = new Date(yyyy, 6, 02);
            labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            $.ajax({
                type: 'POST',
                data: { locationid: locationidt, weekid: date1temp.getWeek() - 1, subgroup_name: subgroup_name },
                dataType: 'json',
                url: '/getWeeklySubLinesData',
                async: false,
                success: function (data) {
                    for (itr = 0; itr < data.length; itr++) {
                        if (energy[labels.indexOf(data[itr].dayname)] == '' || energy[labels.indexOf(data[itr].dayname)] == undefined || energy[labels.indexOf(data[itr].dayname)] == '0')
                            energy[labels.indexOf(data[itr].dayname)] = data[itr].energy;
                        else
                            energy[labels.indexOf(data[itr].dayname)] = energy[labels.indexOf(data[itr].dayname)] + data[itr].energy;
                    }
                    if (data.length)
                        grpname = data[0].subgroup_name;
                },
                error: function (err) {
                    console.log("Error!!", err);
                }
            })
        }
        else if (viewid == 2) {
            mm = 7
            date1temp = yyyy + '-' + '07' + '-';
            if (mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12) {
                for (j = 1; j <= 31; j++) {
                    labels[j - 1] = date1temp + j;
                }
            }
            else if (mm == 2) {
                for (j = 1; j <= 28; j++) {
                    labels[j - 1] = date1temp + j;
                }
            }
            else {
                for (j = 1; j <= 30; j++) {
                    labels[j - 1] = date1temp + j;
                }
            }
            $.ajax({
                type: 'POST',
                data: { locationid: locationidt, monthid: mm, subgroup_name: subgroup_name },
                dataType: 'json',
                url: '/getMonthlySubLinesData',
                async: false,
                success: function (data) {
                    for (var itr = 0; itr < data.length; itr++) {
                        if (energy[data[itr].day - 1] == '' || energy[data[itr].day - 1] == undefined || energy[data[itr].day - 1] == '0')
                            energy[data[itr].day - 1] = data[itr].energy;
                        else
                            energy[data[itr].day - 1] = energy[data[itr].day - 1] + data[itr].energy;
                    }
                    if (data.length)
                        grpname = data[0].subgroup_name;
                },
                error: function (err) {
                    console.log("Error!!", err)
                }
            })

        }
        else if (viewid == 3 && (date2 == undefined || date2 == '')) {
            $.ajax({
                type: 'POST',
                data: { locationid: locationidt, date: date1, subgroup_name: subgroup_name },
                dataType: 'json',
                url: '/getSubLinesData',
                async: false,
                success: function (data) {
                    for (itr = 0; itr < data.length; itr++) {
                        labels[itr] = data[itr].time.slice(11, 19);
                        energy[itr] = data[itr].energy;
                    }
                    if (data.length)
                        grpname = data[0].group_name;
                },
                error: function (err) {
                    console.log("Error!!", err);
                }
            })
        }
        else if (viewid == 3) {
            var mm, dd, yyyy;
            var dateArray = getDates(new Date(parseInt(date1.slice(0, 4)), parseInt(date1.slice(5, 7)) - 1, parseInt(date1.slice(8, 10)) + 1), new Date(parseInt(date2.slice(0, 4)), parseInt(date2.slice(5, 7)) - 1, parseInt(date2.slice(8, 10)) + 1));
            for (itr = 0; itr < dateArray.length; itr++) {
                dd = String(dateArray[itr].getDate()).padStart(2, '0');
                mm = String(dateArray[itr].getMonth() + 1).padStart(2, '0'); //January is 0!
                yyyy = dateArray[itr].getFullYear();
                labels[itr] = yyyy + '-' + mm + '-' + dd;
            }
            $.ajax({
                type: 'POST',
                data: { locationid: locationidt, fromdate: date1, todate: date2, subgroup_name: subgroup_name },
                dataType: 'json',
                url: '/getCustomSubLinesData',
                async: false,
                success: function (data) {
                    for (itr = 0; itr < data.length; itr++) {
                        energy[labels.indexOf(data[itr].dates.slice(0, 10))] = data[itr].energy;
                    }
                    if (data.length)
                        grpname = data[0].subgroup_name;
                },
                error: function (err) {
                    console.log("Error!!", err);
                }
            })
        }
        return [labels, energy, grpname]
    }
    //Get group count
    function getGroupCount() {
        $.ajax({
            type: 'GET',
            data: { location_id: locationid },
            dataType: 'json',
            url: '/getGroupsCount',
            async: false,
            success: function (data) {
                group_count = data[0].gcount;
            },
            error: function (err) {
                console.log("Error!!", err)
            }
        })
    }
    //Pie Data
    function piechartdata(tempdate, tempdate2) {
        var grouplist = []
        var groupnamelist = []
        var energylist = []
        var backgroundlist = ['rgb(249, 155, 146)', 'rgb(135, 164, 195)', 'rgb(116, 237, 224)', 'rgb(215, 199, 179)', 'rgb(0,0,0)', 'rgb(220,230,130)', 'rgb(246, 134, 72)', 'rgb(238, 102, 108)', 'rgb(103, 138, 104)', 'rgb(178, 204, 141)', 'rgb(218, 178, 212)', 'rgb(228, 210, 145)', 'rgb(102, 194, 145)', 'rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)'];
        var dataSum = [0], dataEfficiency = [0];
        var dataType = 1;
        if (viewid == 0) {
            dd = String(tempdate.getDate()).padStart(2, '0');
            mm = String(tempdate.getMonth() + 1).padStart(2, '0'); //January is 0!
            yyyy = tempdate.getFullYear();
            tempdate = yyyy + '-' + mm + '-' + dd;
            for (location_itr = 1; location_itr <= totallocations; location_itr++) {
                $.ajax({
                    type: 'POST',
                    url: '/AllData',
                    dataType: 'json',
                    data: { locationid: location_itr, date: tempdate },
                    success: function (data) {
                        for (i = 0; i < data.length; i++) {
                            if (!grouplist.includes(data[i].id)) {
                                grouplist.push(data[i].id)
                                groupnamelist.push(data[i].grpname)
                                energylist[data[i].id] = data[i].sum;
                            }
                            else {
                                var temp = parseInt(energylist[data[i].id]) + data[i].sum;
                                energylist[data[i].id] = temp;
                            }
                            if (dataSum[location_itr - 1] == '' || dataSum[location_itr - 1] == NaN || dataSum[location_itr - 1] == undefined || dataSum[location_itr - 1] == 'NaN') {
                                dataSum[location_itr - 1] = parseInt(data[i].sum);
                            }
                            else
                                dataSum[location_itr - 1] += parseInt(data[i].sum);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                    async: false
                })
            }
        }
        else if (viewid == 1) {
            for (location_itr = 1; location_itr <= totallocations; location_itr++) {
                $.ajax({
                    type: 'POST',
                    url: '/AllWeeklyData',
                    dataType: 'json',
                    data: { locationid: location_itr, week: tempdate.getWeek() },
                    success: function (data) {
                        for (i = 0; i < data.length; i++) {
                            if (!grouplist.includes(data[i].id)) {
                                grouplist.push(data[i].id)
                                groupnamelist.push(data[i].grpname)
                                energylist[data[i].id] = data[i].sum;
                            }
                            else {
                                var temp = parseInt(energylist[data[i].id]) + data[i].sum;
                                energylist[data[i].id] = temp;
                            }
                            if (dataSum[location_itr - 1] == '' || dataSum[location_itr - 1] == NaN || dataSum[location_itr - 1] == undefined || dataSum[location_itr - 1] == 'NaN') {
                                dataSum[location_itr - 1] = parseInt(data[i].sum);
                            }
                            else
                                dataSum[location_itr - 1] += parseInt(data[i].sum);
                            dataType = 7;
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                    async: false
                })
            }
        }
        else if (viewid == 2) {
            mm = String(tempdate.getMonth() + 1).padStart(2, '0'); //January is 0!
            for (location_itr = 1; location_itr <= totallocations; location_itr++) {
                $.ajax({
                    type: 'POST',
                    url: '/AllMonthlyData',
                    dataType: 'json',
                    data: { locationid: location_itr, month: mm },
                    success: function (data) {
                        for (i = 0; i < data.length; i++) {
                            if (!grouplist.includes(data[i].id)) {
                                grouplist.push(data[i].id)
                                groupnamelist.push(data[i].grpname)
                                energylist[data[i].id] = data[i].sum;
                            }
                            else {
                                var temp = parseInt(energylist[data[i].id]) + data[i].sum;
                                energylist[data[i].id] = temp;
                            }
                            if (dataSum[location_itr - 1] == '' || dataSum[location_itr - 1] == NaN || dataSum[location_itr - 1] == undefined || dataSum[location_itr - 1] == 'NaN') {
                                dataSum[location_itr - 1] = parseInt(data[i].sum);
                            }
                            else
                                dataSum[location_itr - 1] += parseInt(data[i].sum);
                            dataType = 30;
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                    async: false
                })
            }
        }
        else if (viewid == 3 && (tempdate2 == '' || tempdate2 == undefined)) {
            dd = String(tempdate.getDate()).padStart(2, '0');
            mm = String(tempdate.getMonth() + 1).padStart(2, '0'); //January is 0!
            yyyy = tempdate.getFullYear();
            tempdate = yyyy + '-' + mm + '-' + dd;

            for (location_itr = 1; location_itr <= totallocations; location_itr++) {
                $.ajax({
                    type: 'POST',
                    url: '/AllData',
                    dataType: 'json',
                    data: { locationid: location_itr, date: tempdate },
                    success: function (data) {
                        for (i = 0; i < data.length; i++) {
                            if (!grouplist.includes(data[i].id)) {
                                grouplist.push(data[i].id)
                                groupnamelist.push(data[i].grpname)
                                energylist[data[i].id] = data[i].sum;
                            }
                            else {
                                var temp = parseInt(energylist[data[i].id]) + data[i].sum;
                                energylist[data[i].id] = temp;
                            }
                            if (dataSum[location_itr - 1] == '' || dataSum[location_itr - 1] == NaN || dataSum[location_itr - 1] == undefined || dataSum[location_itr - 1] == 'NaN') {
                                dataSum[location_itr - 1] = parseInt(data[i].sum);
                            }
                            else
                                dataSum[location_itr - 1] += parseInt(data[i].sum);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                    async: false
                })
            }
        }
        else if (viewid == 3) {
            var dateArray = getDates(tempdate, tempdate2);
            dataType = dateArray.length;
            dd = String(tempdate.getDate()).padStart(2, '0');
            mm = String(tempdate.getMonth() + 1).padStart(2, '0'); //January is 0!
            yyyy = tempdate.getFullYear();
            tempdate = yyyy + '-' + mm + '-' + dd;
            dd = String(tempdate2.getDate()).padStart(2, '0');
            mm = String(tempdate2.getMonth() + 1).padStart(2, '0'); //January is 0!
            yyyy = tempdate2.getFullYear();
            tempdate2 = yyyy + '-' + mm + '-' + dd;

            for (location_itr = 1; location_itr <= totallocations; location_itr++) {
                $.ajax({
                    type: 'POST',
                    url: '/AllData',
                    dataType: 'json',
                    data: { locationid: location_itr, date1: tempdate, date2: tempdate2 },
                    success: function (data) {
                        for (i = 0; i < data.length; i++) {
                            if (!grouplist.includes(data[i].id)) {
                                grouplist.push(data[i].id)
                                groupnamelist.push(data[i].grpname)
                                energylist[data[i].id] = data[i].sum;
                            }
                            else {
                                var temp = parseInt(energylist[data[i].id]) + data[i].sum;
                                energylist[data[i].id] = temp;
                            }
                            if (dataSum[location_itr - 1] == '' || dataSum[location_itr - 1] == NaN || dataSum[location_itr - 1] == undefined || dataSum[location_itr - 1] == 'NaN') {
                                dataSum[location_itr - 1] = parseInt(data[i].sum);
                            }
                            else
                                dataSum[location_itr - 1] += parseInt(data[i].sum);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                    async: false
                })
            }
        }
        var energy_data22 = [];
        var background_data22 = [];
        for (i = 0; i < grouplist.length; i++) {
            energy_data22[i] = energylist[grouplist[i]];
            background_data22[i] = backgroundlist[i];
        }

        var ajx = {
            data: energy_data22,
            backgroundColor: background_data22
        };
        pie_config.data.datasets[0] = ajx;
        pie_config.data.labels = groupnamelist;
        window.myPie.update()
        var room_count = [];
        $.ajax({
            type: 'GET',
            data: {},
            dataType: 'json',
            url: '/allroomscount',
            async: false,
            success: function (data) {
                room_count = data;
            },
            error: function (err) {
                console.log("Error!!", err);
            }

        })
        for (var itr = 1; itr <= totallocations; itr++) {
            if (room_count[itr - 1] != undefined)
                dataEfficiency[itr - 1] = dataSum[itr - 1] / (dataType * room_count[itr - 1].room_count);
            var configdata = {
                label: 'Location ' + itr,
                backgroundColor: backgroundlist[itr - 1],
                borderColor: backgroundlist[itr - 1],
                data: [dataEfficiency[itr - 1]]
            }
            barChartData2.labels = ['Locations']
            barChartData2.datasets[itr - 1] = configdata;
            window.bar2.update();
        }
    }

    //comparedrpli-list
    function comparedrpli_function(i, selected_loc) {
        dataOriginal = getChartData(new Date(), '', i, locationid);
        dataSecondary = getChartData(new Date(), '', i, selected_loc)
        console.log(dataOriginal, dataSecondary);
        generateComapreChart(dataOriginal, dataSecondary, i - 1, -1, selected_loc);
        if (i == group_count)
            clearInterval(tempcomparedrpli);
    }

    //load Compare btn data
    function loadComparebtnData() {
        $('.compare-location-list').each(function () {
            list = $(this)
            list.html('');
            $('.comparedrpli-list').html('');
            for (i = 1; i <= totallocations; i++) {
                if (i != locationid) {
                    list.append('<li class="location-list">' + i + '</li>')
                    $('.comparedrpli-list').append("<li class='comparedrpli-listli'>" + i + "<input type='hidden' class='stored_location_id' value='" + i + "'></li>")
                }
            }
        })
        $('.compare-subgroup-list').each(function () {
            list = $(this);
            $('.subgroup-name').each(function () {
                if (list.parent().parent().parent().parent().find('.subgroup-name').text() != $(this).text())
                    list.append('<li class="subgroup-list">' + $(this).text() + '</li>')
            })
        })

        $('.compare-group-list').each(function () {
            list = $(this);
            $('.group-btn-title').each(function () {
                list.append('<li class="group-list">' + $(this).text() + '</li>')
            })
        })
        $('.comparedrpli-listli').click(function () {
            var dataOriginal, dataSecondary;
            var selected_loc = parseInt($(this).text().trim());
            console.log(selected_loc)
            var itr = 1, prev = -1;
            tempcomparedrpli = setInterval(() => {
                comparedrpli_function(itr, selected_loc);
                itr++;
            }, 2000);
            console.log("finished")
            $('subgroup-name').each(function () {
                dataOriginal = getSubChartData(new Date(), '', $(this).text(), locationid);
                dataSecondary = getSubChartData(new Date(), '', $(this).text(), selected_loc);
                console.log(dataOriginal, dataSecondary)
                generateComapreSubChart(dataOriginal, dataSecondary, itr, -1, selected_loc);
                itr++;
            })
        })
        $('.comparedrpli-view').click(function () {
            var dataOriginal, dataSecondary;
            if ($('.custom_comparedrpli_date').val() == undefined || $('.custom_comparedrpli_date').val() == '') {
                for (i = 1; i <= group_count; i++) {
                    dataOriginal = getChartData(new Date(), '', i, locationid);
                    dataSecondary = getChartData(new Date(), '', i, locationid);
                    generateComapreChart(dataOriginal, dataSecondary, i - 1, -1)
                }
                $('subgroup-name').each(function () {
                    dataOriginal = getSubChartData(new Date(), '', $(this).text(), locationid);
                    dataSecondary = getSubChartData(new Date(), '', $(this).text(), locationid);
                    generateComapreSubChart(dataOriginal, dataSecondary, itr, -1);
                    itr++;
                })
            }
            else {
                var itr = 0;
                tempdate = $('.custom_comparedrpli_date').val();
                for (i = 1; i <= group_count; i++) {
                    dataOriginal = getChartData(new Date(), '', i, locationid);
                    dataSecondary = getChartData(new Date(), '', i, locationid)
                    generateComapreChart(dataOriginal, dataSecondary, i - 1, -1)
                }
                $('subgroup-name').each(function () {
                    dataOriginal = getSubChartData(new Date(), '', $(this).text(), locationid);
                    dataSecondary = getSubChartData(new Date(tempdate.slice(0, 4), tempdate.slice(5, 7), tempdate.slice(8, 10)), '', $(this).text(), locationid);
                    generateComapreSubChart(dataOriginal, dataSecondary, itr, -1);
                    itr++;
                })
            }
        })
    }
    //Compare btn clicked
    function btnclicked() {
        $('.btn-compare').click(function () {
            var cturn = $(this).parent().parent().find('.compare-val').val();
            if (cturn % 2 == 0)
                $(this).parent().parent().find('.compare-area').css('display', 'block');
            else
                $(this).parent().parent().find('.compare-area').css('display', 'none');
            $(this).parent().parent().find('.compare-val').val(parseInt(cturn) + 1);
        })
    }
    //Scroll Group btn
    function scrollGroup() {
        setTimeout(() => {
            if (scrollOff == 0) {
                $('.group-btn').click(function () {
                    var count, tmpcount = 1;
                    var text = ".group"
                    var clickedgroup = $(this).text()
                    $('.group-btn').each(function () {
                        if ($(this).text() == clickedgroup) {
                            count = tmpcount
                        }
                        tmpcount++;
                    })
                    text = text + count;
                    $('html, body').animate({
                        scrollTop: $(text).offset().top
                    }, 2000);
                    var classlist = $(text).attr('class')
                    var tempclasslist = classlist + ' orangediv'
                    $(text).attr('class', tempclasslist)
                    setTimeout(() => {
                        $(text).attr('class', classlist)
                    }, 4000)
                })
            }
        }, 1000);

    }

    //Refresh All
    function RefreshAll() {
        if (line_config.data.datasets.length > 1)
            line_config.data.datasets.splice(1, 2);
        getGroupCount();
        formmatrix();
        createCharts();
        createSubCharts();
        comparedata();
        loadComparebtnData();
        btnclicked();
    }

    //get week of date
    Date.prototype.getWeek = function (dowOffset) {

        dowOffset = typeof (dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
        var newYear = new Date(this.getFullYear(), 0, 1);
        var day = newYear.getDay() - dowOffset; //the day of week the year begins on
        day = (day >= 0 ? day : day + 7);
        var daynum = Math.floor((this.getTime() - newYear.getTime() -
            (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
        var weeknum;
        //if the year starts before the middle of a week
        if (day < 4) {
            weeknum = Math.floor((daynum + day - 1) / 7) + 1;
            if (weeknum > 52) {
                nYear = new Date(this.getFullYear() + 1, 0, 1);
                nday = nYear.getDay() - dowOffset;
                nday = nday >= 0 ? nday : nday + 7;
                /*if the next year starts before the middle of
                  the week, it is week #1 of that year*/
                weeknum = nday < 4 ? 1 : 53;
            }
        }
        else {
            weeknum = Math.floor((daynum + day - 1) / 7);
        }
        return weeknum;
    };

    //get custom dates
    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf())
        dat.setDate(dat.getDate() + days);
        return dat;
    }

    function getDates(startDate, stopDate) {
        var dateArray = new Array();
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push(currentDate)
            currentDate = currentDate.addDays(1);
        }
        return dateArray;
    }

    /**----------------------------------------Media Queries------------------------------------------------------- */
    function mediaquery(x) {
        if (x.matches || window.innerWidth <= 1300) {
            $('.pie-chart').parent().attr('class', 'col col-sm-6 col-md-6');
            $('.extra-column').attr('class', 'col col-sm-0 col-md-0 extra-column');
            $('.extra-column').css('display', 'none');
            $('.energy-efficiency').parent().attr('class', 'col col-sm-6 col-md-6');
            $('.matrix-div').find('div').css('width', '140px');
            $('.matrix-div').find('div').css('height', '110px');
            $('.bolt').css('margin-top', '-100px');
            $('.bolt').css('width', '30px');
            $('.energy').css('top', '-50px');
        }
        else {
            $('.pie-chart').parent().attr('class', 'col col-sm-6 col-md-4');
            $('.extra-column').attr('class', 'col col-sm-6 col-md-3 extra-column');
            $('.extra-column').css('display', 'block');
            $('.energy-efficiency').parent().attr('class', 'col col-sm-6 col-md-5');
            $('.matrix-div').find('div').css('width', '180px');
            $('.matrix-div').find('div').css('height', '150px');
            $('.bolt').css('margin-top', '0px');
            $('.bolt').css('width', '50px');
            $('.energy').css('margin-top', '0px');
        }
    }
    var x = window.matchMedia("(max-width: 1300px)")
    mediaquery(x)
    x.addListener(mediaquery)

    //=======================================================================================================
    $(".custom_date").datepicker();
})