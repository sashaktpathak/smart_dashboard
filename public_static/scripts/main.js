$('header').load('header.html')
$('footer').load('footer.html')
$(document).ready(function () {
    $('.matrix-area').load('matrix.html')
    var ctx = document.getElementById('pie-chart-area').getContext('2d');
    window.myPie = new Chart(ctx, pie_config);
    var alllinecharts = document.getElementsByClassName('line-chart')
    for (i = 0; i < alllinecharts.length; i++) {
        ctx = alllinecharts[i].getContext('2d')
        window.myLine = new Chart(ctx, line_config);
    }
    ctx = document.getElementsByClassName('big-chart')[0].getContext('2d')
    window.mybar = new Chart(ctx, bar_config)
    $('.viewdrpli').click(function () {
        console.log("dj")
        $('.view_text').html($(this).text().toUpperCase())
    })
})