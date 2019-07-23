//load Compare btn data
function loadComparebtnData() {
    $('.compare-location-list').each(function () {
        list = $(this)
        list.html('');
        $('.comparedrpli-list').html('');
        for (i = 1; i <= totallocations; i++) {
            if (i != locationid) {
                list.append('<li class="location-list">' + locationlist[i - 1] + '<input type="hidden" class="stored_location_id" value="' + i + '"></li>')
                $('.comparedrpli-list').append("<li class='comparedrpli-listli'>" + locationlist[i - 1] + "<input type='hidden' class='stored_location_id' value='" + i + "'></li>")
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
        var selected_loc = parseInt($(this).parent().find('.stored_location_id').val().trim());
        var itr = 1, prev = -1, tempinterval;
        // tempcomparedrpli = setInterval(() => {
        //     comparedrpli_function(itr, selected_loc);
        //     itr++;
        // }, 2000);
        //for (itr = 1; itr <= group_count; itr++) {
        itr = 2;
        comparedrpli_function(1, selected_loc);
        tempinterval = setInterval(() => {
            comparedrpli_function(itr, selected_loc);
            itr++;
            if (itr > 12) {
                clearInterval(tempinterval);
            }
        }, 1500);

        //}
        // $('.subgroup-name').each(function () {
        //     dataOriginal = getSubChartData(selected_date_formatted, '', $(this).text(), locationid);
        //     dataSecondary = getSubChartData(selected_date_formatted, '', $(this).text(), selected_loc);
        //     generateComapreSubChart(dataOriginal, dataSecondary, itr, -1, selected_loc);
        //     itr++;
        // })
    })
    $('.comparedrpli-view').unbind('click').bind('click', function () {
        var dataOriginal, dataSecondary, tempinterval2;
        if ($('.custom_comparedrpli_date').val() == undefined || $('.custom_comparedrpli_date').val() == '') {
            // for (i = 1; i <= 1; i++) {
            //     dataOriginal = getChartData(selected_date_formatted, '', i, locationid);
            //     dataSecondary = getChartData(selected_date_formatted, '', i, locationid);
            //     generateComapreChart(dataOriginal, dataSecondary, i - 1, -1)
            // }
            i = 1;
            comparedrpli_view_function(i);
            i = 2;
            tempinterval2 = setInterval(() => {
                comparedrpli_view_function(i);
                i++;
                if (i > 12) {
                    clearInterval(tempinterval2);
                }
            }, 1500);
        }
        else {
            var itr = 0;
            tempdate = $('.custom_comparedrpli_date').val();
            for (i = 1; i <= group_count; i++) {
                dataOriginal = getChartData(selected_date_formatted, '', i, locationid);
                dataSecondary = getChartData(selected_date_formatted, '', i, locationid)
                generateComapreChart(dataOriginal, dataSecondary, i - 1, -1)
            }
            $('subgroup-name').each(function () {
                dataOriginal = getSubChartData(tempdate.slice(0, 4), tempdate.slice(5, 7), tempdate.slice(8, 10), '', $(this).text(), locationid);
                dataSecondary = getSubChartData(new Date(tempdate.slice(0, 4), tempdate.slice(5, 7), tempdate.slice(8, 10)), '', $(this).text(), locationid);
                generateComapreSubChart(dataOriginal, dataSecondary, itr, -1);
                itr++;
            })
        }
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
        lableOriginal = 'Location ' + locationlist[locationid - 1];
        tempdate = 'Location ' + locationlist[locationidt - 1];
    }
    if (secondarygroup) {
        lableOriginal = dataOriginal[2];
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
                    dataOriginal = getChartData(selected_date_formatted, '', itr + 1);
                    if ($(this).find('.custom_compare_date').val() == undefined || $(this).find('.custom_compare_date').val() == '') {
                        previous_date_formatted = selected_date_formatted
                        previous_date_formatted.setDate(previous_date_formatted.getDate() - 1);
                        dataSecondary = getChartData(previous_date_formatted, '', itr + 1);
                    }
                    else {
                        tempdate = $(this).find('.custom_compare_date').val()
                        dataSecondary = getChartData(new Date(tempdate.slice(0, 4), tempdate.slice(5, 7) - 1, tempdate.slice(8, 10)), '', itr + 1);
                    }
                    generateComapreChart(dataOriginal, dataSecondary, itr, tempdate);
                }
                else {
                    dataOriginal = getSubChartData(selected_date_formatted, '', $(this).parent().parent().parent().find('.subgroup-name').text())
                    if ($(this).find('.custom_compare_date').val() == undefined || $(this).find('.custom_compare_date').val() == '') {
                        dataSecondary = getSubChartData(selected_date_formatted, '', $(this).parent().parent().parent().find('.subgroup-name').text());
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
        $(this).parent().parent().parent().parent().parent().find('.btn-compare')[0].click();
    })
    $('.location-list').click(function () {
        //var locationidt = parseInt($(this).text())
        var locationidt = parseInt($(this).parent().find('.stored_location_id').val())
        var itr = 0;
        var dataOriginal, dataSecondary;
        $(this).parent().parent().parent().find('.date-val').val("1")
        $('.compare-date').each(function () {
            if ($(this).find('.date-val').val() == "1") {
                if (itr < 12) {
                    dataOriginal = getChartData(selected_date_formatted, '', itr + 1)
                    dataSecondary = getChartData(selected_date_formatted, '', itr + 1, locationidt)
                    generateComapreChart(dataOriginal, dataSecondary, itr, -1, locationidt);
                }
                else {
                    dataOriginal = getSubChartData(selected_date_formatted, '', $(this).parent().parent().parent().find('.subgroup-name').text())
                    dataSecondary = getSubChartData(selected_date_formatted, '', $(this).parent().parent().parent().find('.subgroup-name').text(), locationidt)
                    generateComapreSubChart(dataOriginal, dataSecondary, itr - 12, -1, locationidt);
                }
            }
            itr++;
        });
        $(this).parent().parent().parent().find('.date-val').val("0");
        $(this).parent().parent().parent().parent().parent().find('.btn-compare')[0].click();
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
        dataOriginal = getChartData(selected_date_formatted, '', itr_groupno + 1);
        dataSecondary = getChartData(selected_date_formatted, '', itr2_groupno + 1);
        generateComapreChart(dataOriginal, dataSecondary, itr_groupno, -1, 0, temptext)
        $(this).parent().parent().parent().parent().parent().find('.btn-compare')[0].click();
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
        dataOriginal = getSubChartData(selected_date_formatted, '', $(this).parent().parent().parent().parent().parent().find('.subgroup-name').text());
        dataSecondary = getSubChartData(selected_date_formatted, '', temptext);
        generateComapreSubChart(dataOriginal, dataSecondary, itr_groupno, -1, 0, temptext)
        $(this).parent().parent().parent().parent().parent().find('.btn-compare')[0].click();
    })
}


//Generate comapre sub charts
function generateComapreSubChart(dataOriginal, dataSecondary, itr, tempdate, locationidt, secondarygroup) {
    line_config.data.labels = dataOriginal[0];
    var lableOriginal = dataOriginal[2];
    if (tempdate == -1)
        tempdate = 'Previous';
    if (locationidt) {
        lableOriginal = 'Location ' + locationlist[locationid - 1];
        tempdate = 'Location ' + locationlist[locationidt - 1];
    }
    if (dataSecondary[2] == '' || dataSecondary[2] == undefined)
        tempdate = 'Data Unavailable!';
    if (secondarygroup) {
        lableOriginal = dataOriginal[2];
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

//comparedrpli-list
function comparedrpli_function(i, selected_loc) {
    dataOriginal = getChartData(selected_date_formatted, '', i, locationid);
    dataSecondary = getChartData(selected_date_formatted, '', i, selected_loc)
    generateComapreChart(dataOriginal, dataSecondary, parseInt(i) - 1, -1, selected_loc);
}
//comparedrpli-view
function comparedrpli_view_function(i) {
    dataOriginal = getChartData(selected_date_formatted, '', i, locationid);
    dataSecondary = getChartData(selected_date_formatted, '', i, locationid);
    generateComapreChart(dataOriginal, dataSecondary, i - 1, -1)
}
