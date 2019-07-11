var location_id = 1;
var view_id = 0;
var scrollOn = 0;
$('footer').load('footer.html')
$(document).ready(function () {
    var location_efficiency = 0;
    var location_totalenergy = 0;
    var linechartval = [];
    var roomslinechartval = [];
    var roomnumberlist = [];
    var today_date;
    var map = L.map('map-area').setView([28.7041, 77.1025], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    $('.matrix-area').load('matrix.html', function () {

    })
    var ctx = document.getElementById('pie-chart-area').getContext('2d');
    window.myPie = new Chart(ctx, pie_config);
    // for (i = 0; i < alllinecharts.length; i++) {
    //     ctx = alllinecharts[i].getContext('2d')
    //     window.myLine = new Chart(ctx, line_config);
    // }
    ctx = document.getElementsByClassName('big-chart')[0].getContext('2d')
    window.mybar = new Chart(ctx, bar_config)

    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        // Return array of year and week number
        return [d.getUTCFullYear(), weekNo];
    }
    var room_count = 0;
    function refreshdata() {
        var alllinecharts = document.getElementsByClassName('line-chart')
        var grp_i = 0;
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        //today = yyyy + '-' + mm + '-' + dd;
        today = yyyy + '-' + '06' + '-28';
        today_date = today;
        for (grp_i = 0; grp_i < 12; grp_i++) {
            $.ajax({
                type: 'POST',
                url: '/getData',
                dataType: 'json',
                data: { groupid: grp_i + 1, locationid: location_id },
                success: function (data) {
                    var labels = [], energy_data = [];
                    var itr = 0;
                    if (view_id == 0) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].time.slice(0, 10) == today) {
                                labels[itr] = data[i].time.slice(11, 19);
                                energy_data[itr] = parseInt(data[i].energy);
                                itr++;
                            }
                        }
                    }
                    else if (view_id == 1) {
                        labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        energy_data = [0]
                        $.ajax({
                            type: 'POST',
                            data: { locationid: location_id, weekid: 26, groupid: grp_i + 1 },
                            dataType: 'json',
                            url: '/getWeeklyData',
                            success: function (datanew) {
                                for (var i = 0; i < datanew.length; i++) {
                                    if (datanew[i].dayname == labels[0]) {
                                        energy_data[0] = parseInt(datanew[i].total);
                                    }
                                    if (datanew[i].dayname == labels[1]) {
                                        energy_data[1] = parseInt(datanew[i].total);
                                    }
                                    if (datanew[i].dayname == labels[2]) {
                                        energy_data[2] = parseInt(datanew[i].total);
                                    }
                                    if (datanew[i].dayname == labels[3]) {
                                        energy_data[3] = parseInt(datanew[i].total);
                                    }
                                    if (datanew[i].dayname == labels[4]) {
                                        energy_data[4] = parseInt(datanew[i].total);
                                    }
                                    if (datanew[i].dayname == labels[5]) {
                                        energy_data[5] = parseInt(datanew[i].total);
                                    }
                                    if (datanew[i].dayname == labels[6]) {
                                        energy_data[6] = parseInt(datanew[i].total);
                                    }
                                }
                            },
                            error: function (err) {
                                console.log(err);
                            },
                            async: false
                        })
                    }
                    else if (view_id == 2) {
                        today = new Date();
                        dd = String(today.getDate()).padStart(2, '0');
                        mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                        yyyy = today.getFullYear();
                        mm = 6
                        var tempdate = yyyy + '/' + mm + '/';
                        if (mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12) {
                            for (i = 1; i <= 31; i++) {
                                labels[i - 1] = tempdate + i;
                            }
                        }
                        else if (mm == 2) {
                            for (i = 1; i <= 28; i++) {
                                labels[i - 1] = tempdate + i;
                            }
                        }
                        else {
                            for (i = 1; i <= 30; i++) {
                                labels[i - 1] = tempdate + i;
                            }
                        }
                        energy_data = [0]
                        $.ajax({
                            type: 'POST',
                            data: { locationid: location_id, weekid: mm, groupid: grp_i + 1 },
                            dataType: 'json',
                            url: '/getMonthlyData',
                            success: function (datanew) {
                                for (var i = 0; i < datanew.length; i++) {
                                    energy_data[datanew[i].day - 1] = parseInt(datanew[i].total);
                                }
                            },
                            error: function (err) {
                                console.log(err);
                            },
                            async: false
                        })
                    }
                    line_config.data.labels = labels;
                    line_config.data.datasets[0].data = energy_data;
                    ctx = alllinecharts[grp_i].getContext('2d')
                    if (linechartval[grp_i] == '' || linechartval[grp_i] == undefined) {
                        window.myLine = new Chart(ctx, line_config);
                        linechartval[grp_i] = (window.myLine);
                        window.myLine.update()
                    }
                    else {
                        linechartval[grp_i].update();
                    }
                    barChartData.datasets[grp_i].data = energy_data;
                    barChartData.labels = labels;
                    window.mybar.update();
                },
                error: function () {
                    console.log("error")
                },
                async: false
            })
        }

        $.post('/getTopData', { locationid: location_id }, function (data) {
            var itr = 0, energy_sum = 0;
            $('.matrix-div .energy').each(function () {
                var str = data[itr].energy + 'Kwh.'
                $(this).html(str)
                $(this).parent().find('.group-btn-title').text(data[itr].group_name)
                if (data[itr].status == 0) {
                    if (itr == 7) {
                        $(this).parent().attr('class', 'room group-btn inactive')
                    }
                    else {
                        $(this).parent().attr('class', 'group-btn inactive')
                    }
                    $(this).parent().find('.bolt').attr('src', 'images/lightning-low.svg')
                }
                else if (data[itr].energy == 0) {
                    if (itr == 7) {
                        $(this).parent().attr('class', 'room group-btn low')
                    }
                    else {
                        $(this).parent().attr('class', 'group-btn low')
                    }
                    $(this).parent().find('.bolt').attr('src', 'images/lightning.svg')
                }
                else {
                    if (itr == 7) {
                        $(this).parent().attr('class', 'room group-btn high')
                    }
                    else {
                        $(this).parent().attr('class', 'group-btn high')
                    }
                    $(this).parent().find('.bolt').attr('src', 'images/lightning.svg')
                }
                energy_sum += data[itr].energy;
                itr++;
            })
        })
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/getTopRooms',
            data: { locationid: location_id },
            async: false,
            success: function (data) {
                room_count = data.length;
                $('.room_list').html('')
                $('.room-matrix').html('<div class="back-btn">Go Back<br><br><img src="images/left-arrow.svg" class="goback-btn" width="70"></div>')
                $('.room_list').append('<li class="all-room"><b>View All</b></li>')
                $('.all-room').click(function () {
                    scrollOn = 1;
                    $('.matrix-div').css('display', 'none');
                    $('.room-matrix').css('display', 'flex');
                })
                $('.group-btn').click(function () {
                    if (scrollOn == 0) {
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
                    scrollOn = 0
                })
                for (var i = 0; i < data.length; i++) {
                    var html_room = $('.room-matrix').html();
                    var status_data = data[i].status;
                    var energy_data = data[i].energy;
                    var room_num_data = data[i].room_number;
                    $('.room_list').append('<li class="roomli">' + room_num_data + '  ' + energy_data + 'Kwh. </li>')
                    if (status_data == 0) {
                        html_room = '<div class="room-btn inactive">' + room_num_data + '<br><br><img src="images/lightning-low.svg" class="bolt bolt-icon" width="50"><strong class="energy">' + energy_data + 'Kwh.</strong></div>' + html_room;
                    }
                    else if (energy_data == 0) {
                        html_room = '<div class="room-btn low">' + room_num_data + '<br><br><img src="images/lightning.svg" class="bolt bolt-icon" width="50"><strong class="energy">' + energy_data + 'Kwh.</strong></div>' + html_room;
                    }
                    else {
                        html_room = '<div class="room-btn high">' + room_num_data + '<br><br><img src="images/lightning.svg" class="bolt bolt-icon" width="50"><strong class="energy">' + energy_data + 'Kwh.</strong></div>' + html_room;
                    }
                    $('.room-matrix').html(html_room)
                }
                $('.back-btn').click(function () {
                    scrollOn = 0;
                    $('.matrix-div').css('display', 'flex');
                    $('.room-matrix').css('display', 'none');
                })
                $('.room-btn').click(function () {
                    var count, tmpcount = 13;
                    var text = ".group"
                    var clickedgroup = $(this).text()
                    if (roomslistcount % 2 == 0)
                        chart_dropdown();
                    $('.room-btn').each(function () {
                        if ($(this).text() == clickedgroup) {
                            count = tmpcount
                        }
                        tmpcount++;
                    })
                    text = text + count
                    console.log(text)
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
            },
            error: function (err) {
                console.log(err)
            }
        })
        $.ajax({
            type: 'POST',
            url: '/getRooms',
            dataType: 'json',
            data: { locationid: location_id },
            success: function (data) {
                $('.rooms-chart').html('');
                roomnumberlist = []
                var chart_count = 13
                for (i = 0; i < data.length; i++) {
                    roomnumberlist.push(data[i].rmn)
                    $.ajax({
                        type: 'POST',
                        url: '/getRoomsData',
                        data: { rmn: data[i].rmn, locationid: location_id },
                        success: function (rooms_data) {
                            var tempStruct = '<div class="col col-sm-6 col-md-4 group' + chart_count + '"><h4 class="room_id">Room No. ' + data[i].rmn + '</h4><button class="btn btn-primary btn-roomcompare">Compare</button><input type="hidden" class="compare-val" value="0"><div class="compare-area"><ul class="compare-list"><li class="compare-rooms-date">By Date</li><li class="compare-rooms-location">By Location</li><li>By Group</li></ul></div><canvas class="room-line-chart" id="line-canvas' + chart_count + '"></canvas></div>'
                            var temphtml = $('.rooms-chart').html();
                            $('.rooms-chart').html(tempStruct + temphtml)
                            $('.btn-roomcompare').click(function () {
                                var cturn = $(this).parent().find('.compare-val').val();
                                if (cturn % 2 == 0)
                                    $(this).parent().find('.compare-area').css('display', 'block');
                                else
                                    $(this).parent().find('.compare-area').css('display', 'none');
                                $(this).parent().find('.compare-val').val(parseInt(cturn) + 1);
                            })

                            /** -----------------------------Rooms Compare------------------------------------------- */
                            $('.compare-rooms-date').click(function () {
                                var room_id = $(this).parent().parent().parent().find('.room_id').text().slice(9, 14).trim();
                                console.log(room_id)
                                var itr = 0;
                                var previous_text = $(this).text()
                                $(this).text("texthereis")
                                $('.compare-rooms-date').each(function () {
                                    if ($(this).text() == "texthereis") {
                                        $.ajax({
                                            type: 'POST',
                                            url: '/getRoomsData',
                                            dataType: 'json',
                                            data: { rmn: room_id, locationid: location_id },
                                            success: function (data) {
                                                var labels = [], energy_data = [];
                                                var labels2 = [], energy_data2 = [];
                                                var itr2 = 0, itr3 = 0;
                                                today = new Date();
                                                dd = String(today.getDate()).padStart(2, '0');
                                                mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                                var yyyy = today.getFullYear();
                                                today = yyyy + '-' + '07' + '-' + '01';
                                                for (var i = 0; i < data.length; i++) {
                                                    if (data[i].time.slice(0, 10) == today) {
                                                        labels[itr2] = data[i].time.slice(11, 19);
                                                        energy_data[itr2] = data[i].energy;
                                                        itr2++;
                                                    }
                                                    else if (data[i].time.slice(0, 10) == today_date) {
                                                        labels2[itr3] = data[i].time.slice(11, 19);
                                                        energy_data2[itr3] = data[i].energy;
                                                        itr3++;
                                                    }
                                                }
                                                labels = labels.reverse();
                                                labels2 = labels2.reverse();
                                                energy_data = energy_data.reverse();
                                                energy_data2 = energy_data2.reverse();
                                                if (labels.length >= labels2.length)
                                                    line_config.data.labels = labels;
                                                else
                                                    line_config.data.labels = labels2;

                                                var ajx = {
                                                    label: 'Today',
                                                    backgroundColor: window.chartColors.blue,
                                                    borderColor: window.chartColors.blue,
                                                    data: energy_data2,
                                                    fill: false
                                                };
                                                line_config.data.datasets[0] = ajx;
                                                ajx = {
                                                    label: 'Previous',
                                                    backgroundColor: window.chartColors.orange,
                                                    borderColor: window.chartColors.orange,
                                                    data: energy_data,
                                                    fill: false
                                                };
                                                line_config.data.datasets[1] = ajx;
                                                roomslinechartval[itr].update();
                                            },
                                            error: function () {
                                                console.log("error")
                                            },
                                            async: false
                                        })
                                    }
                                    itr++;
                                })
                                $(this).text(previous_text)
                            })
                        },
                        error: function (err) {
                            console.log(err);
                        },
                        async: false
                    })
                    chart_count++;
                }
            },
            error: function (err) {
                console.log(err)
            },
            async: false
        })
        var allroomlinecharts = document.getElementsByClassName('room-line-chart');
        var another_chart_count = roomnumberlist.length - 1;
        for (i = 0; i < roomnumberlist.length; i++) {
            $.ajax({
                type: 'POST',
                data: { rmn: roomnumberlist[i], locationid: location_id },
                url: '/getRoomsData',
                dataType: 'json',
                success: function (rooms_data) {
                    var labels = [], energy_data = [];
                    var itr = 0;
                    if (view_id == 0) {
                        var tempdate = '2019-07-01'
                        for (j = 0; j < rooms_data.length; j++) {
                            if (rooms_data[j].time.slice(0, 10) == tempdate) {
                                labels[itr] = rooms_data[j].time.slice(11, 19);
                                energy_data[itr] = rooms_data[j].energy;
                                itr++;
                            }
                        }

                        labels = labels.reverse();
                        energy_data = energy_data.reverse();
                    }
                    else if (view_id == 1) {
                        labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        energy_data = [0]
                        $.ajax({
                            type: 'POST',
                            data: { locationid: location_id, weekid: 26, rmn: roomnumberlist[i] },
                            dataType: 'json',
                            url: '/getWeeklyRoomsData',
                            success: function (datanew) {
                                for (var i = 0; i < datanew.length; i++) {
                                    if (datanew[i].dayname == labels[0]) {
                                        energy_data[0] = datanew[i].total;
                                    }
                                    if (datanew[i].dayname == labels[1]) {
                                        energy_data[1] = datanew[i].total;
                                    }
                                    if (datanew[i].dayname == labels[2]) {
                                        energy_data[2] = datanew[i].total;
                                    }
                                    if (datanew[i].dayname == labels[3]) {
                                        energy_data[3] = datanew[i].total;
                                    }
                                    if (datanew[i].dayname == labels[4]) {
                                        energy_data[4] = datanew[i].total;
                                    }
                                    if (datanew[i].dayname == labels[5]) {
                                        energy_data[5] = datanew[i].total;
                                    }
                                    if (datanew[i].dayname == labels[6]) {
                                        energy_data[6] = datanew[i].total;
                                    }
                                }
                            },
                            error: function (err) {
                                console.log(err);
                            },
                            async: false
                        })
                    }
                    else if (view_id == 2) {
                        today = new Date();
                        dd = String(today.getDate()).padStart(2, '0');
                        mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                        yyyy = today.getFullYear();
                        mm = 7
                        var tempdate = yyyy + '/' + mm + '/';
                        if (mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12) {
                            for (j = 1; j <= 31; j++) {
                                labels[j - 1] = tempdate + j;
                            }
                        }
                        else if (mm == 2) {
                            for (j = 1; j <= 28; j++) {
                                labels[j - 1] = tempdate + j;
                            }
                        }
                        else {
                            for (j = 1; j <= 30; j++) {
                                labels[j - 1] = tempdate + j;
                            }
                        }
                        energy_data = [0]
                        $.ajax({
                            type: 'POST',
                            data: { locationid: location_id, monthid: mm, rmn: roomnumberlist[i] },
                            dataType: 'json',
                            url: '/getMonthlyRoomsData',
                            success: function (datanew) {
                                for (var j = 0; j < datanew.length; j++) {
                                    energy_data[datanew[j].day - 1] = datanew[j].total;
                                }
                            },
                            error: function (err) {
                                console.log(err);
                            },
                            async: false
                        })
                    }
                    line_config.data.labels = labels;
                    line_config.data.datasets[0].data = energy_data;

                    ctx = allroomlinecharts[another_chart_count].getContext('2d')

                    window.myline2 = new Chart(ctx, line_config);
                    roomslinechartval[another_chart_count] = (window.myline2);
                    another_chart_count--;
                },
                error: function (err) {
                    console.log("error", err)
                },
                async: false

            })
        }
        energyefficiency();
        piechartdata();
        /** ==========================My Map========================================= */

        var locationmarker;
        if (locationmarker != undefined) {
            map.removeLayer(locationmarker);
            if (location_id == 1)
                map.panTo(new L.LatLng(28.7041, 77.1025))
            else if (location_id == 2)
                map.panTo(new L.LatLng(28.4595, 77.0266))
        }
        setTimeout(() => {
            if (location_id == 1)
                locationmarker = new L.marker([28.7041, 77.1025]);
            else if (location_id == 2)
                locationmarker = new L.marker([28.4595, 77.0266]);

            locationmarker.addTo(map)
                .bindPopup('<b>Location: </b>' + location_id + '<br><b>Total Energy: </b>' + location_totalenergy + 'Kwh.<br><b>Efficiency: </b>' + location_efficiency)
                .openPopup();
        }, 1200);
    }
    function piechartdata() {
        var tempdate = '2019-06-28'
        var grouplist = []
        var groupnamelist = []
        var energylist = []
        var backgroundlist = ['rgb(249, 155, 146)', 'rgb(135, 164, 195)', 'rgb(116, 237, 224)', 'rgb(215, 199, 179)', 'rgb(0,0,0)', 'rgb(220,230,130)', 'rgb(246, 134, 72)', 'rgb(238, 102, 108)', 'rgb(103, 138, 104)', 'rgb(178, 204, 141)', 'rgb(218, 178, 212)', 'rgb(228, 210, 145)', 'rgb(102, 194, 145)', 'rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)'];

        $.ajax({
            type: 'POST',
            url: '/AllData',
            dataType: 'json',
            data: { locationid: 1, date: tempdate },
            success: function (data) {
                for (i = 0; i < data.length; i++) {
                    grouplist.push(data[i].id)
                    groupnamelist.push(data[i].grpname)
                    energylist[data[i].id] = data[i].sum;
                }
            },
            error: function (err) {
                console.log(err);
            },
            async: false
        })
        $.ajax({
            type: 'POST',
            url: '/AllData',
            dataType: 'json',
            data: { locationid: 2, date: tempdate },
            success: function (data) {
                for (i = 0; i < data.length; i++) {
                    if (!grouplist.includes(data[i].id)) {
                        grouplist.push(data[i].id);
                        groupnamelist.push(data[i].grpname)
                        energylist[data[i].id] = data[i].sum;
                    }
                    else {
                        var temp = parseInt(energylist[data[i].id]) + data[i].sum;
                        energylist[data[i].id] = temp;
                    }
                }
            },
            error: function (err) {
                console.log(err);
            },
            async: false
        })
        $.ajax({
            type: 'POST',
            url: '/AllData',
            dataType: 'json',
            data: { locationid: 3, date: tempdate },
            success: function (data) {
                for (i = 0; i < data.length; i++) {
                    if (!grouplist.includes(data[i].id)) {
                        grouplist.push(data[i].id);
                        groupnamelist.push(data[i].grpname)
                        energylist[data[i].id] = data[i].sum;
                    }
                    else {
                        var temp = parseInt(energylist[data[i].id]) + data[i].sum;
                        energylist[data[i].id] = temp;
                    }
                }
            },
            error: function (err) {
                console.log(err);
            },
            async: false
        })
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

    }
    function energyefficiency() {
        $.post('/getTopData', { locationid: 1 }, function (data) {
            var energy_sum = 0;
            for (var i = 0; i < data.length; i++) {
                energy_sum += data[i].energy;
            }
            var tempenergy = energy_sum;
            energy_sum = energy_sum / room_count;
            if (location_id == 1) {
                location_totalenergy = tempenergy;
                location_efficiency = energy_sum;
            }
            var configdata = {
                label: 'Location 1',
                backgroundColor: color(window.chartColors.yellow).alpha(0.9).rgbString(),
                borderColor: window.chartColors.yellow,
                data: [energy_sum]
            }
            barChartData2.datasets[0] = configdata;
            window.bar2.update();
        })
        $.post('/getTopData', { locationid: 2 }, function (data) {
            var energy_sum = 0;
            for (var i = 0; i < data.length; i++) {
                energy_sum += data[i].energy;
            }
            var tempenergy = energy_sum;
            energy_sum = energy_sum / room_count;
            if (location_id == 2) {
                location_totalenergy = tempenergy;
                location_efficiency = energy_sum;
            }
            var configdata = {
                label: 'Location 2',
                backgroundColor: color(window.chartColors.green).alpha(0.9).rgbString(),
                borderColor: window.chartColors.green,
                data: [energy_sum]
            }
            barChartData2.datasets[1] = configdata;
            window.bar2.update();
        })
        $.post('/getTopData', { locationid: 3 }, function (data) {
            var energy_sum = 0;
            for (var i = 0; i < data.length; i++) {
                energy_sum += data[i].energy;
            }
            var tempenergy = energy_sum;
            energy_sum = energy_sum / room_count;
            if (location_id == 3) {
                location_totalenergy = tempenergy;
                location_efficiency = energy_sum;
            }
            var configdata = {
                label: 'Location 3',
                backgroundColor: color(window.chartColors.red).alpha(0.9).rgbString(),
                borderColor: window.chartColors.red,
                data: [energy_sum]
            }
            barChartData2.labels = []
            barChartData2.datasets[2] = configdata;
            window.bar2.update();
        })
    }

    $('.compare-date').click(function () {
        var itr = 0;
        var previous_text = $(this).text()
        $(this).text("texthereis")
        $('.compare-date').each(function () {
            if ($(this).text() == "texthereis") {
                $.ajax({
                    type: 'POST',
                    url: '/getData',
                    dataType: 'json',
                    data: { groupid: itr + 1, locationid: location_id },
                    success: function (data) {
                        var labels = [], energy_data = [];
                        var labels2 = [], energy_data2 = [];
                        var itr2 = 0, itr3 = 0;
                        today = new Date();
                        dd = String(today.getDate()).padStart(2, '0');
                        mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                        var yyyy = today.getFullYear();
                        today = yyyy + '-' + '06' + '-' + '30';
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].time.slice(0, 10) == today) {
                                labels[itr2] = data[i].time.slice(11, 19);
                                energy_data[itr2] = parseInt(data[i].energy);
                                itr2++;
                            }
                            else if (data[i].time.slice(0, 10) == today_date) {
                                labels2[itr3] = data[i].time.slice(11, 19);
                                energy_data2[itr3] = parseInt(data[i].energy);
                                itr3++;
                            }
                        }
                        if (labels.length >= labels2.length)
                            line_config.data.labels = labels;
                        else
                            line_config.data.labels = labels2;

                        var ajx = {
                            label: 'Pantry1',
                            backgroundColor: window.chartColors.blue,
                            borderColor: window.chartColors.blue,
                            data: energy_data2,
                            fill: false
                        };
                        line_config.data.datasets[0] = ajx;
                        ajx = {
                            label: 'Pantry2',
                            backgroundColor: window.chartColors.orange,
                            borderColor: window.chartColors.orange,
                            data: energy_data,
                            fill: false
                        };
                        line_config.data.datasets[1] = ajx;
                        linechartval[itr].update();
                    },
                    error: function () {
                        console.log("error")
                    },
                    async: false
                })
            }
            itr++;
        })
        $(this).text(previous_text)
    })
    $('.compare-location').click(function () {
        // console.log($('.compare-date').length)
        var itr = 0;
        var previous_text = $(this).text()
        $(this).text("texthereis")
        $('.compare-location').each(function () {
            if ($(this).text() == "texthereis") {
                $.ajax({
                    type: 'POST',
                    url: '/getData',
                    dataType: 'json',
                    data: { groupid: itr + 1, locationid: 2 },
                    success: function (data) {
                        var labels = [], energy_data = [];
                        var labels2 = [], energy_data2 = [];
                        var itr2 = 0, itr3 = 0;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].time.slice(0, 10) == today_date) {
                                labels[itr2] = data[i].time.slice(11, 19);
                                energy_data[itr2] = data[i].energy;
                                itr2++;
                            }
                        }
                        $.ajax({
                            type: 'POST',
                            url: '/getData',
                            dataType: 'json',
                            data: { groupid: itr + 1, locationid: 1 },
                            success: function (data2) {
                                for (var i = 0; i < data2.length; i++) {
                                    if (data2[i].time.slice(0, 10) == today_date) {
                                        labels2[itr3] = data2[i].time.slice(11, 19);
                                        energy_data2[itr3] = data2[i].energy;
                                        itr3++;

                                        if (labels.length >= labels2.length)
                                            line_config.data.labels = labels;
                                        else
                                            line_config.data.labels = labels2;

                                        var ajx = {
                                            label: 'Pantry Loc1',
                                            backgroundColor: window.chartColors.blue,
                                            borderColor: window.chartColors.blue,
                                            data: energy_data2,
                                            fill: false
                                        };
                                        line_config.data.datasets[0] = ajx;
                                        ajx = {
                                            label: 'Pantry Loc2',
                                            backgroundColor: window.chartColors.orange,
                                            borderColor: window.chartColors.orange,
                                            data: energy_data,
                                            fill: false
                                        };
                                        line_config.data.datasets[1] = ajx;
                                        linechartval[itr].update();
                                    }
                                }
                            },
                            error: function (err) {
                                console.log(err)
                            },
                            async: false
                        })
                    },
                    error: function () {
                        console.log("error")
                    },
                    async: false
                })
            }
            itr++;
        })
        $(this).text(previous_text)
    })
    var roomslistcount = 0;
    function chart_dropdown() {
        if (roomslistcount % 2 == 0) {
            $('.rooms-chart').css('visibility', 'visible');
            $('.rooms-chart').css('height', '100%');
        }
        else {
            $('.rooms-chart').css('visibility', 'hidden');
            $('.rooms-chart').css('height', '0px');
        }
        roomslistcount++;
    }
    $('.rooms-chart-dropdown').click(function () {
        chart_dropdown();
    })
    $('header').load('header.html', function () {
        $('.viewdrpli').click(function () {
            $('.view_text').html($(this).text().toUpperCase())
            if ($('.view_text').text().toUpperCase().trim() == 'WEEKLY') {
                view_id = 1;
            }
            else if ($('.view_text').text().toUpperCase().trim() == 'MONTHLY') {
                view_id = 2;
            }
            else {
                view_id = 0;
            }
            refreshdata();
        })
        $('.custom_from_date').change(function () {
            var text = 'CUSTOM<br>FROM: ' + $('.custom_from_date').val();
            $('.custom_to_date').val("")
            $('.view_text').html(text)
        })
        $('.custom_to_date').change(function () {
            var text = 'CUSTOM<br>FROM: ' + $('.custom_from_date').val() + '<br>TO: ' + $('.custom_to_date').val();
            $('.view_text').html(text)
        })

        $.get('/getLocations', function (data) {
            for (t = 0; t < data.length; t++) {
                $('.drpmn').append("<li class='drpmnli'>" + data[t].location + "</li>")
            }
            $('.drpmnli').click(function () {
                if ($(this).text() == 'DELHI') {
                    $('.location_text').text('DELHI');
                    location_id = 1;
                } if ($(this).text() == 'GURUGRAM') {
                    location_id = 2;
                    $('.location_text').text('GURUGRAM');
                } if ($(this).text() == 'BANGLORE') {
                    location_id = 3;
                    $('.location_text').text('BANGLORE');
                }
                refreshdata();
            })
        })
    });

    refreshdata();
    ctx2 = document.getElementsByClassName('efficiency-chart')[0].getContext('2d')
    window.bar2 = new Chart(ctx2, bar_config2)

})
/** -------------------------------------Ready Ends---------------------------------------------- */