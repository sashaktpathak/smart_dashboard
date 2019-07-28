/** -----------------------------Map Formation-------------------------------------------------- */
var map = L.map('map-area').setView([28.7041, 77.1025], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
/**--------------------------------global variables----------------------------------------------------------------- */
var locationid;
var totallocations = 0;
var viewid = 0;
var group_count = 0;
var scrollOff = 0;
var totalenergyusage = 0;
var linechartval = [], sublinechartval = [];
var alllinecharts = [], allsublinecharts = [];
var tempcomparedrpli;
var latlong = [];
var today_date = '', lastupdatedtime = '';
var selected_date = '', selected_date_formatted;
var locationlist = [];
var loading_data = 1, loadingInterval, loadingOn = 0;
var LeafIcon = L.Icon.extend({
    options: {
        iconSize: [26, 34],
    }
})
var group_names = [];
var greenIcon = new LeafIcon({ iconUrl: '../images/marker-icon-new-lightgreen.png' }),
    redIcon = new LeafIcon({ iconUrl: '../images/marker-icon-new.png' }),
    blueIcon = new LeafIcon({ iconUrl: '../images/marker-icon-new-blue.png' }),
    greyIcon = new LeafIcon({ iconUrl: '../images/marker-icon-new-grey.png' }),
    darkgreenIcon = new LeafIcon({ iconUrl: '../images/marker-icon-new-green.png' });
var models = [], model_length;
var backgroundlist = ['rgb(30, 165, 210)', 'rgb(255, 158, 15)', 'rgb(249, 155, 146)', 'rgb(135, 164, 195)', 'rgb(116, 237, 224)', 'rgb(215, 199, 179)', 'rgb(0,0,0)', 'rgb(220,230,130)', 'rgb(246, 134, 72)', 'rgb(238, 102, 108)', 'rgb(103, 138, 104)', 'rgb(178, 204, 141)', 'rgb(218, 178, 212)', 'rgb(228, 210, 145)', 'rgb(102, 194, 145)', 'rgb(255,0,0)', 'rgb(0,255,0)', 'rgb(0,0,255)'];
