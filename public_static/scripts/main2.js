/**--------------------------------global variables----------------------------------------------------------------- */
var locationid;
var totallocations = 0;
var viewid = 0;
var group_count = 0;
var linechartval = [], sublinechartval = [];
var alllinecharts = [], allsublinecharts = [];
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
                for (t = 0; t < data.length; t++) {
                    $('.drpmn').append("<li class='drpmnli'>" + data[t].location + "<input type='hidden' class='stored_location_id' value='" + data[t].id + "'></li>")
                }
                totallocations = data.length;
                locationid = data[0].id;
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
                        temp = ' <div class="group-btn ' + btntype + '"><div class="group-btn-title">' + data[itr].group_name + '</div><br><br><img src="images/' + imagetype + '" class="bolt bolt-icon" width="50"><strong class="energy" > ' + data[itr].energy + ' Kwh.</strong ></div > ';
                    }
                    else {
                        temp = ' <div class="room group-btn ' + btntype + '"><div class="group-btn-title">' + data[itr].group_name + '</div><div class="subrooms"><ul class="room_list"><li class="all-room"><b>View All</b></li>';
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
                        temp = temp + '</ul></div><br><br><img src="images/' + imagetype + '" class="bolt bolt-icon" width="50"><strong class="energy">' + data[itr].energy + ' Kwh.</strong></div>';
                    }
                    $('.matrix-div').html(temphtml + temp);
                }
            },
            error: function (err) {
                console.log("Error!! ", err)
            }
        })
    }
    //creating groups chart
    function createCharts() {
        $('.group-charts-area').html(' ');
        for (var i = 0; i < group_count; i++) {
            var temphtml = $('.group-charts-area').html();
            var temp = '<div class="col col-sm-6 col-md-4 group' + (i + 1) + '">Chart ' + (i + 1) + ' <button class="btn btn-primary btn-compare" > Compare</button ><input type="hidden" class="compare-val" value="0"><div class="compare-area"><ul class="compare-list"><li class="compare-date">By Date</li><li class="compare-location">By Location</li><li>By Group</li></ul></div><canvas class="line-chart" id="line-canvas' + (i + 1) + '"></canvas></div> ';
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
                    var temp = '<div class="col col-sm-6 col-md-4 subgroup' + (itr + 1) + '"> ' + data[itr].subgroup_name + ' <button class="btn btn-primary btn-compare" > Compare</button ><input type="hidden" class="compare-val" value="0"><div class="compare-area"><ul class="compare-list"><li class="compare-date">By Date</li><li class="compare-location">By Location</li><li>By Group</li></ul></div><canvas class="line-subchart" id="line-subcanvas' + (i + 1) + '"></canvas></div> ';
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
    //Retrieving Chart Data
    function getChartData(date1, date2, grp_id) {
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
                data: { locationid: locationid, group_id: grp_id, date: date1temp },
                dataType: 'json',
                url: '/getLinesData',
                async: false,
                success: function (data) {
                    for (itr = 0; itr < data.length; itr++) {
                        labels[itr] = data[itr].time;
                        energy[itr] = data[itr].energy;
                    }
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
                data: { locationid: locationid, group_id: grp_id, weekid: date1temp.getWeek() },
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
                data: { locationid: locationid, group_id: grp_id, monthid: mm },
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
                data: { locationid: locationid, group_id: grp_id, date: date1 },
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
                data: { locationid: locationid, group_id: grp_id, fromdate: date1, todate: date2 },
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
    function getSubChartData(date1, date2, subgroup_name) {
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
                data: { locationid: locationid, date: date1temp, subgroup_name: subgroup_name },
                dataType: 'json',
                url: '/getSubLinesData',
                async: false,
                success: function (data) {
                    for (itr = 0; itr < data.length; itr++) {
                        labels[itr] = data[itr].time.slice(11, 19);
                        energy[itr] = data[itr].energy;
                    }
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
                data: { locationid: locationid, weekid: date1temp.getWeek() - 1, subgroup_name: subgroup_name },
                dataType: 'json',
                url: '/getWeeklySubLinesData',
                async: false,
                success: function (data) {
                    console.log(data)
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
                data: { locationid: locationid, monthid: mm, subgroup_name: subgroup_name },
                dataType: 'json',
                url: '/getMonthlySubLinesData',
                async: false,
                success: function (data) {
                    console.log(data)
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
                data: { locationid: locationid, date: date1, subgroup_name: subgroup_name },
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
                data: { locationid: locationid, fromdate: date1, todate: date2, subgroup_name: subgroup_name },
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

    //Refresh All
    function RefreshAll() {
        getGroupCount();
        formmatrix();
        createCharts();
        createSubCharts();
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

})