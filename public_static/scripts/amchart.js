am4core.ready(function () {
    var previous_series_count = 0;
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("big_charts", am4charts.XYChart);

    // Add data
    chart.data = [{
        "model_name": "Floor",
        "field1": 0,
        "field2": 0,
        "field3": 0,
        "field4": 0,
        "field5": 0,
        "field6": 0,
        "field7": 0,
        "field8": 0,
        "field9": 0,
        "field10": 0,
        "field11": 0,
        "field12": 0
    }];

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = false;
    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "model_name";
    categoryAxis.numberFormatter.numberFormat = "#";
    categoryAxis.renderer.inversed = false;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.0;
    categoryAxis.renderer.cellEndLocation = 0.9;



    // Create series
    function createSeries(field, name) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "model_name";
        series.name = name;
        series.columns.template.tooltipText = "{name}: [bold]{valueX}{valueY}[/]";
        series.columns.template.height = am4core.percent(100);
        series.columns.template.width = am4core.percent(110);
        series.sequencedInterpolation = true;

        var valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = "";
        //valueLabel.label.horizontalCenter = "true";
        valueLabel.label.dy = 10;
        valueLabel.label.hideOversized = false;
        valueLabel.label.truncate = false;

        var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
        //categoryLabel.label.text = "{name}";
        categoryLabel.label.horizontalCenter = "right";
        categoryLabel.label.dy = -10;
        categoryLabel.label.fill = am4core.color("#fff");
        categoryLabel.label.hideOversized = false;
        categoryLabel.label.truncate = false;
    }

    // createSeries("field1", "Field1");
    // createSeries("field2", "Field2");
    // createSeries("field3", "Field3");
    // createSeries("field4", "Field4");
    // createSeries("field5", "Field5");
    // createSeries("field6", "Field6");
    // createSeries("field7", "Field7");
    // createSeries("field8", "Field8");
    // createSeries("field9", "Hello");
    // createSeries("field10", "Field10");
    // createSeries("field11", "Field11");
    // createSeries("field12", "Field12");

    chart.legend = new am4charts.Legend();
    chart.legend.useDefaultMarker = true;
    var markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 17;
    markerTemplate.height = 11;

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    chart.scrollbarX.startGrip.hide();
    chart.scrollbarX.endGrip.hide();
    chart.scrollbarX.start = 0;
    chart.scrollbarX.end = 0.90;

    chart.zoomOutButton = new am4core.ZoomOutButton();
    chart.zoomOutButton.hide();


    updategraph = function () {
        var NewChartData = [];
        for (var i = 0; i < model_length; i++) {
            D = models[i];
            D = JSON.stringify(D);
            NewChartData.push(JSON.parse(D));
        }
        chart.data = NewChartData;
        for (var i = 0; i < previous_series_count; i++) {
            chart.series.removeIndex(0).dispose();
        }
        previous_series_count = 0;
        for (var i = 1; i <= group_count; i++) {
            var ftemp = "field" + i
            createSeries(ftemp, group_names[i - 1]);
            previous_series_count++;
        }
        chart.scrollbarX.parent = chart.bottomAxesContainer;
        chart.scrollbarX.startGrip.hide();
        chart.scrollbarX.endGrip.hide();
        chart.scrollbarX.start = 0;
        if (model_length >= 50)
            chart.scrollbarX.end = 0.25;
        else if (model_length >= 25)
            chart.scrollbarX.end = 0.5;
        else if (model_length >= 13)
            chart.scrollbarX.end = 0.7;
        else
            chart.scrollbarX.end = 0.95;

        //chart.validateData();
    }
}); // end am4core.ready()