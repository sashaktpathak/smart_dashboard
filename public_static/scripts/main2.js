$(document).ready(function () {
    loadingScreen();
    /*-----------------------------------Get Today's Date--------------------------------------------*/
    function getTodayDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        lastupdatedtime = String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0');
        selected_date_formatted = today;
        today = yyyy + '-' + mm + '-' + dd;
        today_date = selected_date = today;
        $('.date_text').text(today_date);
        $('.lastupdatedhere').text(lastupdatedtime)
        $('.date_charts').text(selected_date);
    }
    getTodayDate();
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
                $.ajax({
                    type: 'POST',
                    data: {},
                    dataType: 'json',
                    url: '/getUsersProperty',
                    async: false,
                    success: function (datanew) {
                        latlong = [];
                        totallocations = 0;
                        for (j = 0; j < datanew.length; j++) {
                            if ((datanew[j].user_id == $('.passed_user_id').val())) {
                                for (t = 0; t < data.length; t++) {
                                    if ((datanew[j].locationid == data[t].id)) {
                                        locationlist.push(data[t].location);
                                        $('.drpmn').append("<li class='drpmnli'>" + data[t].location + "<input type='hidden' class='stored_location_id' value='" + data[t].id + "'></li>")
                                        var temploc = [data[t].latitude, data[t].longitude];
                                        latlong.push(temploc);
                                        totallocations++;
                                    }
                                }
                            }
                        }
                        if (totallocations <= 1) {
                            $('.dropdwn').prop('disabled', true);
                            $('.dropdwn').css('color', '#aaa');
                        }
                        else {
                            $('.dropdwn').prop('disabled', false);
                            $('.dropdwn').css('color', 'white');
                        }
                    },
                    error: function () {
                        console.log("Errorr!!");
                    }
                })
                var tempsumlat = 0, tempsumlong = 0;
                for (it = 0; it < latlong.length; it++) {
                    tempsumlat += latlong[it][0];
                    tempsumlong += latlong[it][1];
                }
                tempsumlat /= latlong.length;
                tempsumlong /= latlong.length;
                map.panTo(new L.LatLng(tempsumlat, tempsumlong));
            },
            error: function (err) {
                console.log("Error!!", err)
            }
        })
        /**-----------------------------------loading button matrix--------------------------------------------- */
        $('.matrix-area').load('matrix.html', function () {
            activateCalendar();
            getGroupCount();
            createBarandPieChart();
            generatePieCharts();
            formmatrix();
            createCharts();
            createSubCharts();
            $('.date_charts').text(selected_date);
            $('.location_charts').text(locationlist[locationid - 1]);
            loadComparebtnData();
            btnclicked();
            comparedata();
            $('[data-toggle="datepicker"]').datepicker();
        })
        $('.drpmnli').click(function () {
            locationid = parseInt($(this).find('.stored_location_id').val());
            $('.location_text').text($(this).text())
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
        /**-------------------------------------On Date Change-------------------------------------------------------- */
        $('.global-date').on('change', function (e) {
            selected_date = webshim.format.date($.prop(e.target, 'value'));
            selected_date_formatted = new Date(selected_date.slice(0, 4), selected_date.slice(5, 7) - 1, selected_date.slice(8, 10));
            $('#calenderModal').modal('toggle');
            RefreshAll();
        })
        $('.btn2').click(function () {
            $.get('/getCSV', { viewid: viewid, location_id: locationid, location_name: locationlist[locationid - 1], selected_dates: selected_date }, function () {

            })
            var str = '/getCSV?location_id=' + locationid + '&viewid=' + viewid;
            // $.get('/getCSV', { loc: $('.location-text').html(), date: $('.refresh-text1').html(), time: $('.refresh-text2').html() }, (data) => {
            //     console.log(data)

            // })
            window.open(str)
        })
    })
    /**------------------------------------loading footer--------------------------------------------- */
    $('footer').load('footer.html')
    /**-------------------------------------functions----------------------------------------------------- */

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

    //change date text
    function setDateText() {
        if (viewid == 0) {
            $('.date_text').text(selected_date);
            $('.date_charts').text(selected_date);
        }
        else if (viewid == 1) {
            tempdate1 = getSunday(selected_date_formatted);
            dd = String(tempdate1.getDate()).padStart(2, '0');
            mm = String(tempdate1.getMonth() + 1).padStart(2, '0');
            yyyy = tempdate1.getFullYear();
            tempdate1 = dd + '-' + mm + '-' + yyyy;
            tempdate2 = getSaturday(selected_date_formatted);
            dd = String(tempdate2.getDate()).padStart(2, '0');
            mm = String(tempdate2.getMonth() + 1).padStart(2, '0');
            yyyy = tempdate2.getFullYear();
            tempdate2 = dd + '-' + mm + '-' + yyyy;
            temptext = tempdate1 + ' -to- ' + tempdate2;
            $('.date_text').text(temptext);
            $('.date_charts').text(temptext);
        }
        else if (viewid == 2) {
            mm = String(selected_date_formatted.getMonth() + 1).padStart(2, '0');
            yyyy = selected_date_formatted.getFullYear();
            tempdate1 = '01' + '-' + mm + yyyy;
            if (mm == 2) {
                enddate = 28;
            }
            else if (mm == 4 || mm == 6 || mm == 8 || mm == 9 || mm == 11) {
                enddate = 30;
            }
            else {
                enddate = 31;
            }
            tempdate2 = enddate + '-' + mm + '-' + yyyy;

            temptext = tempdate1 + ' -to- ' + tempdate2;
            $('.date_text').text(temptext);
            $('.date_charts').text(temptext);
        }
        else {
            temptext = $('.custom_from_date') + ' -to ' + $('.custom_to_date');
            $('.date_text').text(temptext);
            $('.date_charts').text(temptext);
        }
        if (selected_date == today_date) {
            $('.matrix-about').text('Live Status');
        }
        else {
            $('.matrix-about').text('Status');
        }
        $('.location_charts').text(locationlist[locationid - 1])
    }

    //loading screen
    function loadingScreen() {
        if (loading_data == 1 && loadingOn == 0) {
            loadingOn = 1;
            $('#loadingModal').modal('toggle');
        }
        loadingInterval = setInterval(function () {
            if (loading_data == 0 && loadingOn == 1) {
                loadingOn = 0;
                $('#loadingModal').modal('toggle');
            }
        }, 100);
    }

    //Refresh All
    function RefreshAll() {
        loading_data = 1;
        loadingOn = 1;
        $('#loadingModal').modal('toggle');
        //loadingScreen();
        if (line_config.data.datasets.length > 1)
            line_config.data.datasets.splice(1, 2);
        getGroupCount();
        generatePieCharts();
        formmatrix();
        createCharts();
        createSubCharts();
        setDateText();
        loadComparebtnData();
        comparedata();
        btnclicked();
    }


    //webhism Calendar gadget
    function activateCalendar() {
        webshim.setOptions('forms-ext', {
            replaceUI: 'auto',
            types: 'date',
            date: {
                startView: 2,
                inlinePicker: true,
                classes: 'hide-inputbtns'
            }
        });
        webshim.setOptions('forms', {
            lazyCustomMessages: true
        });
        //start polyfilling
        webshim.polyfill('forms forms-ext');
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
    window.addEventListener('resize', function () {
        updategraph();
        console.log("a")
    });
    function mediaquery(x) {
        if (x.matches || window.innerWidth <= 900) {
            $('.matrix-area').outerHeight($('.alert-column').outerHeight())
        }
    }
    var x = window.matchMedia("(max-width: 900px)")
    mediaquery(x)
    x.addListener(mediaquery)

    // document.body.style.webkitTransform = 'scale(1)';
    // document.body.style.msTransform = 'scale(100)';
    // document.body.style.transform = 'scale(1)';
    // document.body.style.zoom = screen.logicalXDPI / screen.deviceXDPI;

})