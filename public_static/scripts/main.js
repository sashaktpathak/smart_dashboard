$('header').load('header.html', function () {
    $('.viewdrpli').click(function () {
        $('.view_text').html($(this).text().toUpperCase())
    })
});
$('footer').load('footer.html')
$(document).ready(function () {
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
    var alllinecharts = document.getElementsByClassName('line-chart')
    for (i = 0; i < alllinecharts.length; i++) {
        ctx = alllinecharts[i].getContext('2d')
        window.myLine = new Chart(ctx, line_config);
    }
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
})