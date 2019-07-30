
var modelfield_names = ['field1', 'field2', 'field3', 'field4', 'field5', 'field6', 'field7', 'field8', 'field9', 'field10', 'field11', 'field12'];
//Forming Matrix
function formmatrix() {
    var date1temp1, date2temp1;
    if (viewid == 0) {
        date1temp1 = selected_date;
        date2temp1 = selected_date;
    }
    else if (viewid == 1) {
        date1temp1 = getSunday(selected_date_formatted);
        date2temp1 = getSaturday(selected_date_formatted);
        dd = String(date1temp1.getDate()).padStart(2, '0');
        mm = String(date1temp1.getMonth() + 1).padStart(2, '0');
        yyyy = date1temp1.getFullYear();
        date1temp1 = yyyy + '-' + mm + '-' + dd;
        dd = String(date2temp1.getDate()).padStart(2, '0');
        mm = String(date2temp1.getMonth() + 1).padStart(2, '0');
        yyyy = date2temp1.getFullYear();
        date2temp1 = yyyy + '-' + mm + '-' + dd;
    }
    else if (viewid == 2) {
        var enddate;
        yyyy = selected_date_formatted.getFullYear();
        mm = selected_date_formatted.getMonth() + 1;
        date1temp1 = yyyy + '-' + mm + '-01';
        if (mm == 2) {
            enddate = 28;
        }
        else if (mm == 4 || mm == 6 || mm == 8 || mm == 9 || mm == 11) {
            enddate = 30;
        }
        else {
            enddate = 31;
        }
        date2temp1 = yyyy + '-' + mm + '-' + enddate;
    }
    $.ajax({
        type: 'POST',
        url: '/getGroups',
        dataType: 'json',
        data: { location_id: locationid, date1: date1temp1, date2: date2temp1 },
        async: false,
        success: function (data) {
            var energy_list = new Array(12).fill(0), status_list = new Array(12).fill(0), group_name_list = new Array(12).fill('Data Unavailable!'), group_id_list = new Array(12), subgroup = new Array(12).fill(0);
            $('.matrix-div').html(' ');
            for (i = 0; i < data.length; i++) {
                data[i].energy = parseFloat(parseFloat(data[i].energy / 1000).toFixed(3));

                if (i == 0) {
                    Previous_time = data[i].gtime.slice(0, 2);
                    energy_list[i % group_count] = data[i].energy;
                    status_list[i % group_count] = data[i].status;

                }
                else {
                    energy_list[i % group_count] = energy_list[i % group_count] + data[i].energy;
                    status_list[i % group_count] = status_list[i % group_count] + data[i].status;
                }
                group_name_list[i % group_count] = data[i].group_name;
                group_id_list[i % group_count] = data[i].group_id;
                subgroup[i % group_count] = data[i].subgroup;
            }
            for (itr = 0; itr < energy_list.length; itr++) {
                energy_list[itr] = energy_list[itr].toFixed(2);
            }
            group_names = group_name_list;

            for (var itr = 0; itr < energy_list.length; itr++) {
                var temphtml = $('.matrix-div').html();
                var temp;
                var btntype = '', imagetype = '';
                if (status_list[itr] == 0) {
                    imagetype = 'lightning-low.svg';
                    btntype = 'inactive';
                }
                else {
                    imagetype = 'lightning.svg'
                    if (energy_list[itr] == 0)
                        btntype = 'low';
                    else
                        btntype = 'high';
                }
                if (subgroup[itr] == 0) {
                    temp = ' <div class="group-btn ' + btntype + '"><div class="group-btn-title">' + group_name_list[itr] + '<input type="hidden" class="group-id" value="' + group_id_list[itr] + '"></div><img src="images/' + imagetype + '" class="bolt bolt-icon" width="50"><strong class="energy" > ' + energy_list[itr] + ' Kwh</strong ></div > ';
                }
                else {
                    temp = ' <div class="room group-btn ' + btntype + '"><div class="group-btn-title">' + group_name_list[itr] + '<input type="hidden" class="group-id" value="' + group_id_list[itr] + '"></div><div class="subrooms"><ul class="room_list"><li class="all-room"><b>View All</b></li>';
                    $.ajax({
                        type: 'POST',
                        data: { parentgroup_id: group_id_list[itr], locationid: locationid },
                        dataType: 'json',
                        url: '/getRooms',
                        async: false,
                        success: function (datacount) {
                            for (itr3 = 0; itr3 < datacount.length; itr3++) {
                                $.ajax({
                                    type: 'POST',
                                    dataType: 'json',
                                    data: { parentgroup_id: group_id_list[itr], location_id: locationid, subgroup_name: datacount[itr3].rmn, date1: date1temp1, date2: date2temp1 },
                                    url: '/getSubGroupsSum',
                                    async: false,
                                    success: function (datanew) {
                                        temp = temp + '<li class="roomli">' + datacount[itr3].rmn + ' ' + datanew[0].sum / 1000 + 'Kwh </li>'
                                    },
                                    error: function (err) {
                                        console.log("Error!!", err);
                                    }
                                })
                            }
                        },
                        error: function (err) {
                            console.log("Error!!", err);
                        }
                    })
                    temp = temp + '</ul></div><img src="images/' + imagetype + '" class="bolt bolt-icon" width="50"><strong class="energy">' + energy_list[itr] + ' Kwh</strong></div>';
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
                                    var energytemp;
                                    $.ajax({
                                        type: 'POST',
                                        url: '/getSubGroupsSum',
                                        dataType: 'json',
                                        data: { parentgroup_id: group_idtemp, location_id: locationid, subgroup_name: datanew[itr2].subgroup_name, date1: date1temp1, date2: date2temp1 },
                                        async: false,
                                        success: function (dataenergy) {
                                            energytemp = dataenergy[0].sum;
                                        },
                                        error: function (err) {
                                            console.log("Error!!", err);
                                        }
                                    })
                                    datanew[itr2].energy = energytemp / 1000;
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
                                    temp = ' <div class="group-btn ' + btntype + '"><div class="group-btn-title">' + datanew[itr2].subgroup_name + '</div><img src="images/' + imagetype + '" class="bolt bolt-icon" width="50"><strong class="energy" > ' + datanew[itr2].energy + ' Kwh</strong ></div > ';
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
    })
    scrollGroup();
}

//creating groups chart
function createCharts() {
    $('.group-charts-area').html(' ');
    for (var i = 0; i < group_count; i++) {
        var temphtml = $('.group-charts-area').html();
        var temp = '<div class="col col-sm-6 col-md-4 group' + (i + 1) + '"><div class="" style="display: inline-block;">Date: <span class="date_charts"></span> Location: <span class="location_charts"></span></div><div class="display-flex3">Chart ' + (i + 1) + ' <button class="btn btn-primary btn-compare" > Compare</button ></div><input type="hidden" class="compare-val" value="0"><div class="compare-area"><ul class="compare-list"><li class="compare-date">By View<input type="hidden" class="date-val" value="0"><input data-toggle="datepicker" class="custom_date custom_compare_date"></li><li class="compare-location">By Location<ul class="compare-location-list"></ul></li><li>By Group<ul class="compare-group-list"></ul></li></ul></div><canvas class="line-chart" id="line-canvas' + (i + 1) + '"></canvas></div> ';
        $('.group-charts-area').html(temphtml + temp);

    }
    alllinecharts = $('.line-chart');
    generateCharts();
}

//Generating data
function generateCharts() {
    var chartdata;
    var fieldtemptext = 'field';
    for (grp_id = 1; grp_id <= group_count; grp_id++) {
        var fieldtemp = fieldtemptext + grp_id;
        if (viewid != 3)
            chartdata = getChartData(selected_date_formatted, '', grp_id);
        else
            chartdata = getChartData($('.custom_from_date').val(), $('.custom_to_date').val(), grp_id);
        if (chartdata[2] == undefined) {
            line_config.data.datasets[0].label = 'Unconfigured';
            alllinecharts[grp_id - 1].style.backgroundColor = 'rgba(160,160,160,0.4)';
        }
        else
            line_config.data.datasets[0].label = chartdata[2];
        line_config.data.labels = chartdata[0];
        line_config.data.datasets[0].data = chartdata[1];
        ctx = alllinecharts[grp_id - 1].getContext('2d')
        window.myLine = new Chart(ctx, line_config);
        linechartval[grp_id - 1] = window.myLine;
        window.myLine.update()

        barChartData.datasets[grp_id - 1].data = chartdata[1];
        barChartData.labels = chartdata[0];
        barChartData.datasets[grp_id - 1].label = chartdata[2];
        if (chartdata[0].length) {
            for (grp_id_i = 0; grp_id_i < chartdata[0].length; grp_id_i++) {
                models[grp_id_i].model_name = chartdata[0][grp_id_i];
                models[grp_id_i][modelfield_names[grp_id - 1]] = chartdata[1][grp_id_i];
            }
            model_length = chartdata[0].length
        }
    }
    updategraph();
}

//Retrieving Chart Data
function getChartData(date1, date2, grp_id, locationidt) {
    if (locationidt == undefined)
        locationidt = locationid

    if (typeof date1 != "string") {
        var dd = String(date1.getDate()).padStart(2, '0');
        var mm = String(date1.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date1.getFullYear();
        date1temp = yyyy + '-' + mm + '-' + dd;
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
                    energy[itr] = data[itr].energy / 1000;
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
        date1temp = new Date(yyyy, mm - 1, dd);
        labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $.ajax({
            type: 'POST',
            data: { locationid: locationidt, group_id: grp_id, weekid: date1temp.getWeek() - 1 },
            dataType: 'json',
            url: '/getWeeklyLinesData',
            async: false,
            success: function (data) {
                for (itr = 0; itr < data.length; itr++) {
                    if (energy[labels.indexOf(data[itr].dayname)] == '' || energy[labels.indexOf(data[itr].dayname)] == undefined || energy[labels.indexOf(data[itr].dayname)] == '0')
                        energy[labels.indexOf(data[itr].dayname)] = data[itr].energy / 1000;
                    else
                        energy[labels.indexOf(data[itr].dayname)] = energy[labels.indexOf(data[itr].dayname)] + (data[itr].energy / 1000);
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
        date1temp = yyyy + '-' + mm + '-';
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
                    data[itr].energy = data[itr].energy / 1000;
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
                    energy[itr] = data[itr].energy / 1000;
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
                    energy[labels.indexOf(data[itr].dates.slice(0, 10))] = data[itr].energy / 1000;
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

/**---------------------------------------------SubGroups--------------------------------------------------------------------- */

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
                var temp = '<div class="col col-sm-6 col-md-4 subgroup' + (itr + 1) + '"><div class="" style="display: inline-block;">Date: <span class="date_charts"></span> Location: <span class="location_charts"></span></div><div class="display-flex3"><span class="subgroup-name">' + data[itr].subgroup_name + ' </span><button class="btn btn-primary btn-compare" > Compare</button ></div><input type="hidden" class="compare-val" value="0"><div class="compare-area"><ul class="compare-list"><li class="compare-date">By View<input type="hidden" class="date-val" value="0"><input data-toggle="datepicker" class="custom_date custom_compare_date"></li><li class="compare-location">By Location<ul class="compare-location-list"></ul></li><li>By Group<ul class="compare-subgroup-list"></ul></li></ul></div><canvas class="line-subchart" id="line-subcanvas' + (i + 1) + '"></canvas></div> ';
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
                    chartdata = getSubChartData(selected_date_formatted, '', data[subgrp_id - 1].subgroup_name);
                else
                    chartdata = getSubChartData($('.custom_from_date').val(), $('.custom_to_date').val(), data[subgrp_id - 1].subgroup_name);

                if (chartdata[2] == undefined) {
                    line_config.data.datasets[0].label = 'Unconfigured';
                    allsublinecharts[subgrp_id - 1].style.backgroundColor = 'rgba(170,170,170,0.4)';
                }
                else
                    line_config.data.datasets[0].label = chartdata[2];
                line_config.data.labels = chartdata[0];
                line_config.data.datasets[0].data = chartdata[1];
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
        var mm = String(date1.getMonth() + 1).padStart(2, '0');
        var yyyy = date1.getFullYear();
        date1temp = yyyy + '-' + mm + '-' + dd;
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
                    energy[itr] = data[itr].energy / 1000;
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
        date1temp = new Date(yyyy, mm - 1, dd);
        labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $.ajax({
            type: 'POST',
            data: { locationid: locationidt, weekid: date1temp.getWeek() - 1, subgroup_name: subgroup_name },
            dataType: 'json',
            url: '/getWeeklySubLinesData',
            async: false,
            success: function (data) {
                for (itr = 0; itr < data.length; itr++) {
                    data[itr].energy = data[itr].energy / 1000;
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
        date1temp = yyyy + '-' + mm + '-';
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
                    data[itr].energy = data[itr].energy / 1000;
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
                    data[itr].energy = data[itr].energy / 1000;
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
                    data[itr].energy = data[itr].energy / 1000;
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

//Scroll Group btn
function scrollGroup() {
    $('.group-btn').click(function () {
        if (scrollOff == 0) {
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
        }
        scrollOff = 0;
    })
}
//get Previous Sunday
function getSunday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}
//get Next Saturday
function getSaturday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() + (7 - day) + (day == 0 ? -6 : -1); // adjust when day is sunday
    return new Date(d.setDate(diff));
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
