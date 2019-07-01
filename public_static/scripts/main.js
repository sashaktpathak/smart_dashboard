var location_id = 1;

$('footer').load('footer.html')
$(document).ready(function () {
    var linechartval = [];
    var today_date;
    $('.matrix-area').load('matrix.html', function () {
        var scrollOn = 0;
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
    })
    var ctx = document.getElementById('pie-chart-area').getContext('2d');
    window.myPie = new Chart(ctx, pie_config);
    // for (i = 0; i < alllinecharts.length; i++) {
    //     ctx = alllinecharts[i].getContext('2d')
    //     window.myLine = new Chart(ctx, line_config);
    // }
    ctx = document.getElementsByClassName('big-chart')[0].getContext('2d')
    window.mybar = new Chart(ctx, bar_config)

    $('.btn-compare').click(function () {
        var cturn = $(this).parent().find('.compare-val').val();
        if (cturn % 2 == 0)
            $(this).parent().find('.compare-area').css('display', 'block');
        else
            $(this).parent().find('.compare-area').css('display', 'none');
        $(this).parent().find('.compare-val').val(parseInt(cturn) + 1);
    })
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
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].time.slice(0, 10) == today) {
                            labels[itr] = data[i].time.slice(11, 19);
                            energy_data[itr] = data[i].energy;
                            itr++;
                        }
                    }
                    line_config.data.labels = labels;
                    line_config.data.datasets[0].data = energy_data;
                    ctx = alllinecharts[grp_i].getContext('2d')
                    window.myLine = new Chart(ctx, line_config);
                    linechartval[grp_i] = (window.myLine);
                    window.myLine.update()
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
        $.post('/getRooms', { locationid: location_id }, function (data) {
            for (var i = 0; i < data.length; i++) {
                $('.room_list').append('<li class="roomli">' + data[i].rmn + '</li>')
            }
        })
        $.post('/getTopRooms', { locationid: location_id }, function (data) {
            room_count = data.length;
            for (var i = 0; i < data.length; i++) {
                var html_room = $('.room-matrix').html();
                var status_data = data[i].status;
                var energy_data = data[i].energy;
                var room_num_data = data[i].room_number;
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
        })
        energyefficiency();
    }
    function energyefficiency() {
        $.post('/getTopData', { locationid: 1 }, function (data) {
            var energy_sum = 0;
            for (var i = 0; i < data.length; i++) {
                energy_sum += data[i].energy;
            }
            energy_sum = energy_sum / room_count;
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
            energy_sum = energy_sum / room_count;
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
            energy_sum = energy_sum / room_count;
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
        // console.log($('.compare-date').length)
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
                                energy_data[itr2] = data[i].energy;
                                itr2++;
                            }
                            else if (data[i].time.slice(0, 10) == today_date) {
                                labels2[itr3] = data[i].time.slice(11, 19);
                                energy_data2[itr3] = data[i].energy;
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
    $('header').load('header.html', function () {
        $('.viewdrpli').click(function () {
            $('.view_text').html($(this).text().toUpperCase())
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
                    location_id = 1;
                } if ($(this).text() == 'GURUGRAM') {
                    location_id = 2;
                } if ($(this).text() == 'BANGLORE') {
                    location_id = 3;
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