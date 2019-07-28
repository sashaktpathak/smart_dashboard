models = [
    {
        "model_name": "f1",
        "field1": 19,
        "field2": 83,
        "field3": 22,
        "field4": 10
    },
    {
        "model_name": "f2",
        "field1": 67,
        "field2": 93,
        "field3": 0,
        "field4": 0
    },
    {
        "model_name": "f3",
        "field1": 10,
        "field2": 56,
        "field3": 0,
        "field4": 100
    },
    {
        "model_name": "f4",
        "field1": 98,
        "field2": 43,
        "field3": 0,
        "field4": 30
    },
    {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
    {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},
    {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
];
var field_names = ['field1', 'field2', 'field3', 'field4', 'field5', 'field6', 'field7', 'field8', 'field9', 'field10', 'field11', 'field12', 'field13', 'field14', 'field15', 'field16', 'field17', 'field18', 'field19', 'field20', 'field21', 'field22', 'field23', 'field24', 'field25', 'field26', 'field27', 'field28', 'field29', 'field30', 'field31'];
models = models.map(i => {
    i.model_name = i.model_name;
    return i;
});

var container = d3.select('svg'),
    width = window.innerWidth - 30,
    height = 500,
    margin = { top: 30, right: 20, bottom: 30, left: 50 },
    margin2 = { top: 530, right: 20, bottom: 30, left: 50 },
    height2 = 600 - margin2,
    barPadding = .01,
    axisTicks = { qty: 5, outerSize: 0, dateFormat: '%m-%d' };

var svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

var xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(barPadding);
var xScale1 = d3.scaleBand();
var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

var yAxisGroup = focus.append("g").call(yAxis);
var xAxisGroup = focus.append("g").call(xAxis).attr("transform", "translate(0," + height + ")");

xScale0.domain(models.map(d => d.model_name));
xScale1.domain(['field1', 'field2', 'field3', 'field4', 'field5', 'field6', 'field7', 'field8', 'field9', 'field10', 'field11', 'field12', 'field13', 'field14']).range([0, xScale0.bandwidth()]);
yScale.domain([0, d3.max(models, d => Math.max(d.field1, d.field2, d.field3, d.field4, d.field5, d.field6, d.field7, d.field8, d.field9, d.field10, d.field11, d.field12))]);

var xAxis2 = d3.axisBottom(xScale1);
var xAxisGroup2 = context.append("g").call(xAxis2).attr("transform", "translate(0," + height2 + ")");

var model_name = svg.selectAll(".model_name")
    .data(models)
    .enter().append("g")
    .attr("class", "model_name")
    .attr("transform", d => `translate(${xScale0(d.model_name)},0)`);

for (var i = 1; i <= 12; i++) {
    var field_text = 'field' + i;
    model_name.selectAll(".bar." + field_text)
        .data(d => [d])
        .enter()
        .append("rect")
        .style('fill', backgroundlist[i - 1])
        .attr("class", "bar field1")
        .style("fill", "blue")
        .attr("x", d => xScale1(field_text))
        .attr("y", d => yScale(field_names[i - 1]))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d[field_names[i - 1]])
        })
        .append("svg:title") // TITLE APPENDED HERE
        .text(function (d) { return (group_names[i - 1] + '\n' + d[field_names[i - 1]]); })
}

// Add the X Axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
    .call(xAxis);

// Add the Y Axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

function updategraph() {
    width = window.innerWidth - 30;
    height = 500
    $('.big-chart').html('');
    svg = d3.select('svg').append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    models = models.map(i => {
        i.model_name = i.model_name;
        return i;
    })


    xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(barPadding);
    xScale1 = d3.scaleBand();
    yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

    xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
    yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

    xScale0.domain(models.map(d => d.model_name));
    var temp_field_list = [];
    for (i = 1; i <= model_length + 1; i++) {
        var field_text = 'field' + i;
        temp_field_list.push(field_text);
    }
    xScale1.domain(temp_field_list).range([0, xScale0.bandwidth()]);
    yScale.domain([0, d3.max(models, d => Math.max(d.field1, d.field2, d.field3, d.field4, d.field5, d.field6, d.field7, d.field8, d.field9, d.field10, d.field11, d.field12))]);


    model_name = svg.selectAll(".model_name")
        .data(models)
        .exit()
        .remove()
    model_name = svg.selectAll(".model_name")
        .data(models)
        .enter().append("g")
        .attr("class", "model_name")
        .attr("transform", d => `translate(${xScale0(d.model_name)},0)`)
    for (var i = 1; i <= 12; i++) {
        var field_text = 'field' + i;
        model_name.selectAll(".bar." + field_text)
            .data(d => [d])
            .enter()
            .append("rect")
            .style('fill', backgroundlist[i - 1])
            .attr("class", "bar " + field_text)
            .attr("x", d => xScale1(field_text))
            //.attr("y", d => yScale(field_names[i - 1]))
            .attr("y", function (d) { return -d[field_names[i - 1]] })
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return height - margin.top - margin.bottom - yScale(d[field_names[i - 1]])
            })
            .append("svg:title") // TITLE APPENDED HERE
            .text(function (d) {
                return (group_names[i - 1] + '\n' + d[field_names[i - 1]])
            })
    }

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

}