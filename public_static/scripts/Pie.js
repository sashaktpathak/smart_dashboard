//Creating Bar chart
function createBarandPieChart() {
    //ctx = document.getElementsByClassName('big-chart')[0].getContext('2d')
    //window.mybar = new Chart(ctx, bar_config)

    ctx = document.getElementById('pie-chart-area').getContext('2d');
    window.myPie = new Chart(ctx, pie_config);

    ctx = document.getElementById('globalpie-chart-area').getContext('2d');
    window.myPie2 = new Chart(ctx, pie_config2);

    ctx2 = document.getElementsByClassName('efficiency-chart')[0].getContext('2d')
    window.bar2 = new Chart(ctx2, bar_config2)
}

//Generate pie chart
function generatePieCharts() {
    if (viewid != 3)
        piechartdata(selected_date_formatted, '');
    else
        piechartdata($('.custom_from_date').val(), $('.custom_to_date').val());
}

//Pie Data
function piechartdata(tempdate, tempdate2) {
    var grouplist = []
    var groupnamelist = []
    var energylist = []
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
                        data[i].sum = data[i].sum / 1000;
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
                            dataSum[location_itr - 1] = (data[i].sum);
                        }
                        else
                            dataSum[location_itr - 1] += (data[i].sum);
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
                data: { locationid: location_itr, week: tempdate.getWeek() - 1 },
                success: function (data) {
                    for (i = 0; i < data.length; i++) {
                        data[i].sum = data[i].sum / 1000;
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
                            dataSum[location_itr - 1] = (data[i].sum);
                        }
                        else
                            dataSum[location_itr - 1] += (data[i].sum);
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
                        data[i].sum = data[i].sum / 1000;
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
                            dataSum[location_itr - 1] = (data[i].sum);
                        }
                        else
                            dataSum[location_itr - 1] += (data[i].sum);
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
        if (typeof tempdate != 'string') {
            dd = String(tempdate.getDate()).padStart(2, '0');
            mm = String(tempdate.getMonth() + 1).padStart(2, '0'); //January is 0!
            yyyy = tempdate.getFullYear();
            tempdate = yyyy + '-' + mm + '-' + dd;
        }
        for (location_itr = 1; location_itr <= totallocations; location_itr++) {
            $.ajax({
                type: 'POST',
                url: '/AllData',
                dataType: 'json',
                data: { locationid: location_itr, date: tempdate },
                success: function (data) {
                    for (i = 0; i < data.length; i++) {
                        data[i].sum = data[i].sum / 1000;
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
                            dataSum[location_itr - 1] = (data[i].sum);
                        }
                        else
                            dataSum[location_itr - 1] += (data[i].sum);
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
        if (typeof tempdate != 'string') {
            dd = String(tempdate.getDate()).padStart(2, '0');
            mm = String(tempdate.getMonth() + 1).padStart(2, '0'); //January is 0!
            yyyy = tempdate.getFullYear();
            tempdate = yyyy + '-' + mm + '-' + dd;
            dd = String(tempdate2.getDate()).padStart(2, '0');
            mm = String(tempdate2.getMonth() + 1).padStart(2, '0'); //January is 0!
            yyyy = tempdate2.getFullYear();
            tempdate2 = yyyy + '-' + mm + '-' + dd;
        }

        for (location_itr = 1; location_itr <= totallocations; location_itr++) {
            $.ajax({
                type: 'POST',
                url: '/AllData',
                dataType: 'json',
                data: { locationid: location_itr, date1: tempdate, date2: tempdate2 },
                success: function (data) {
                    for (i = 0; i < data.length; i++) {
                        data[i].sum = data[i].sum / 1000;
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
                            dataSum[location_itr - 1] = (data[i].sum);
                        }
                        else
                            dataSum[location_itr - 1] += (data[i].sum);
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
    var temp_sum = 0;
    for (i = 0; i < grouplist.length; i++) {
        energy_data22[i] = energylist[grouplist[i]];
        temp_sum += energy_data22[i];
        background_data22[i] = backgroundlist[i];
    }
    for (i = 0; i < energy_data22.length; i++) {
        energy_data22[i] = ((energy_data22[i] * 100) / temp_sum);
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
    var totalenergyused = 0;
    var configarray = [];
    for (var itr = 1; itr <= totallocations; itr++) {
        if (dataSum[itr - 1] != undefined)
            totalenergyused = totalenergyused + parseFloat(dataSum[itr - 1]);
        if (room_count[itr - 1] != undefined)
            dataEfficiency[itr - 1] = dataSum[itr - 1] / (room_count[itr - 1].room_count);
        var configdata = {
            label: locationlist[itr - 1],
            backgroundColor: backgroundlist[itr - 1],
            borderColor: backgroundlist[itr - 1],
            data: [dataEfficiency[itr - 1]]
        }

        if (dataEfficiency[itr - 1]) {
            configarray.push(configdata)
        }
    }

    configarray.sort(function (a, b) {
        return a.data[0] > b.data[0]
    })
    if (configarray.length) {
        barChartData2.labels = ['Locations']
        for (itr = 0; itr < totallocations; itr++) {
            if (configarray[itr] != undefined)
                barChartData2.datasets[itr] = configarray[itr];
        }
        window.bar2.update();
    }
    energy_data22 = []
    for (itr = 0; itr < totallocations; itr++) {
        energy_data22.push(dataSum[itr] * 100.0 / totalenergyused);
    }
    ajx = {
        data: energy_data22,
        backgroundColor: background_data22
    };

    templocationlist = []
    if (energy_data22.length)
        templocationlist = locationlist;
    pie_config2.data.datasets[0] = ajx;
    pie_config2.data.labels = templocationlist;
    window.myPie2.update()
    loading_data = 0;
    if (dataSum[locationid - 1] != undefined)
        totalenergyusage = dataSum[locationid - 1];
    else
        totalenergyusage = 0;
    var maxenergy = -1, minenergy = 9999999999;
    for (i = 0; i < dataSum.length; i++) {
        if (dataSum[i] < minenergy)
            minenergy = dataSum[i];
        if (dataSum[i] > maxenergy)
            maxenergy = dataSum[i];
    }
    $('.totalenergyhere').text((totalenergyusage).toFixed(0) + 'Kwh')
    for (i = 0; i < latlong.length; i++) {
        var icon_name = greenIcon;
        if (dataSum[i] == 0)
            icon_name = greyIcon;
        if (dataSum[i] == maxenergy)
            icon_name = redIcon;
        else if (dataSum[i] == minenergy)
            icon_name = darkgreenIcon;
        locationmarker = new L.marker(latlong[i], { icon: icon_name });
        if (dataSum[i] == undefined)
            dataSum[i] = 0;
        locationmarker.addTo(map)
            .bindPopup('<b>Location: </b>' + locationlist[i] + '<br><b>Total EnergyUsed: </b>' + (dataSum[i]).toFixed(1) + 'Kwh <br><b>Location id: </b>   ' + (parseInt(i) + 1))
            .on('click', changelocation).on('mouseover', function (e) {
                this.openPopup();
            }).on('mouseout', function (e) {
                this.closePopup();
            });
    }
    pieconfigMedia(x)
}

//Map on click change location
function changelocation(e) {
    var templatlng = [e.latlng.lat, e.latlng.lng];
    for (i = 1; i <= totallocations; i++) {
        if (latlong[i - 1][0] == templatlng[0] && latlong[i - 1][1] == templatlng[1]) {
            locationid = i;
        }
        var location_clicked = parseInt(e.target._popup._content.slice(e.target._popup._content.length - 3, e.target._popup._content.length));
        $('.location_text').text($('.drpmnli')[location_clicked - 1].innerText)
        RefreshAll();
    }
}
function pieconfigMedia(x) {
    if (x.matches || window.innerWidth <= 1300) {
        pie_config.options.legend.labels.fontSize = 8;
        pie_config2.options.legend.labels.fontSize = 9;
        bar_config2.options.legend.labels.fontSize = 9;
        window.myPie.update();
        window.myPie2.update();
        window.bar2.update();
    }
    else {
        pie_config.options.legend.labels.fontSize = 12;
        bar_config2.options.legend.labels.fontSize = 12;
        pie_config2.options.legend.labels.fontSize = 12;
        window.myPie.update();
        window.myPie2.update();
        window.bar2.update();
    }
}
var x = window.matchMedia("(max-width: 1300px)")
x.addListener(pieconfigMedia)