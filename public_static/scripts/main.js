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
    })
});
$('footer').load('footer.html')
$(document).ready(function () {
    var linechartval = [];
    $('.matrix-area').load('matrix.html', function () {
        var scrollOn = 0;
        $('.all-room').click(function () {
            scrollOn = 1;
            $('.matrix-div').css('display', 'none');
            $('.room-matrix').css('display', 'flex');
        })

        $('.back-btn').click(function () {
            scrollOn = 0;
            $('.matrix-div').css('display', 'flex');
            $('.room-matrix').css('display', 'none');
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
    var alllinecharts = document.getElementsByClassName('line-chart')
    var grp_i = 0;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    for (grp_i = 0; grp_i < 12; grp_i++) {
        $.ajax({
            type: 'POST',
            url: '/getData',
            dataType: 'json',
            data: { groupid: grp_i + 1 },
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
                    data: { groupid: itr + 1 },
                    success: function (data) {
                        var labels = [], energy_data = [];
                        var itr2 = 0;
                        for (var i = 0; i < data.length; i++) {
                            today = yyyy + '-' + mm + '-' + '28';
                            if (data[i].time.slice(0, 10) == today) {
                                labels[itr2] = data[i].time.slice(11, 19);
                                energy_data[itr2] = data[i].energy;
                                itr2++;
                            }
                        }
                        window.myLine = linechartval[itr];
                        line_config.data.labels = labels;
                        var ajx = {
                            label: 'Pantry2',
                            backgroundColor: window.chartColors.blue,
                            borderColor: window.chartColors.blue,
                            data: energy_data,
                            fill: false
                        };
                        line_config.data.datasets.push(ajx);
                        window.myLine.update()
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
    $.post('/getTopData', { locationid: 1 }, function (data) {
        var itr = 0, energy_sum = 0;
        console.log(data)
        $('.matrix-div .energy').each(function () {
            var str = data[itr].energy + 'Kwh.'
            $(this).html(str)
            if (data[itr].status == 0) {
                $(this).parent().attr('class', 'group-btn inactive')
                $(this).parent().find('.bolt').attr('src', 'images/lightning-low.svg')
            }
            else if (data[itr].energy == 0) {
                $(this).parent().attr('class', 'group-btn low')
                $(this).parent().find('.bolt').attr('src', 'images/lightning.svg')
            }
            else {
                $(this).parent().attr('class', 'group-btn high')
                $(this).parent().find('.bolt').attr('src', 'images/lightning.svg')
            }
            energy_sum += data[itr].energy;
            itr++;
        })

        barChartData2.labels = ['Location 1', 'Location 2'];
        var configdata = {
            label: 'Location 1',
            backgroundColor: color(window.chartColors.yellow).alpha(0.9).rgbString(),
            borderColor: window.chartColors.yellow,
            data: [energy_sum]
        }
        barChartData2.datasets[0] = configdata;
        window.bar2.update();
    })
    ctx2 = document.getElementsByClassName('efficiency-chart')[0].getContext('2d')
    window.bar2 = new Chart(ctx2, bar_config2)
})
/** -------------------------------------Ready Ends---------------------------------------------- */