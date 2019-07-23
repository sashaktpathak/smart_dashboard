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
        iconSize: [25, 28],
    }
})
var greenIcon = new LeafIcon({ iconUrl: '../images/marker-icon-new-lightgreen.png' }),
    redIcon = new LeafIcon({ iconUrl: '../images/marker-icon-new.png' }),
    blueIcon = new LeafIcon({ iconUrl: '../images/marker-icon-new-blue.png' }),
    greyIcon = new LeafIcon({ iconUrl: '../images/marker-icon-new-grey.png' }),
    darkgreenIcon = new LeafIcon({ iconUrl: '../images/marker-icon-new-green.png' });
