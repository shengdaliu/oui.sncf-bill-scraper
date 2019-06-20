var fs = require('fs');
const cheerio = require('cheerio')
const moment = require('moment')

var months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai',
    'Juin', 'Juillet', 'Août', 'Septembre',
    'Octobre', 'Novembre', 'Décembre'
];

//This function convert a month name from string (French) to int

function monthNameToNum(monthname) {
    var month = months.indexOf(monthname);
    return month ? month + 1 : 0;
}

const inputFileName = "./test.html"
const outputFileName = "test.json"


fs.readFile(inputFileName, 'utf8', function (err, html) {
    if (err) {
        throw err;
    }

    // Replace backslash ignored char into normal char, convert to standard html
    html = html.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\"/g, "\"");

    // Load the converted string to Cheerio, a lib for DoM manipulation 
    const $ = cheerio.load(html);
    var jsonObject = {};

    // Assume that if the payment passed we considere the transaction status ok
    if ($(".transactions").text().includes("Paiement CB accepté")) {
        jsonObject.status = "ok"
    }

    jsonObject.result = {};
    jsonObject.result.trips = [];
    jsonObject.result.trips[0] = {};

    jsonObject.result.trips[0].code = $(".pnr-ref .pnr-info").last().text().trim();
    jsonObject.result.trips[0].name = $(".pnr-name .pnr-info").last().text().trim();

    jsonObject.result.trips[0].details = {};

    // Scraping the total amount price
    jsonObject.result.trips[0].details.price = Number($(".total-amount").text().replace(/,/g, ".").replace(/[^0-9.-]+/g, ""));
    jsonObject.result.trips[0].details.roundTrips = [];

    for (var i = 0; i < $(".product-travel-date").length; i++) {

        var trip = {};

        // Scraping the date and format it with the lib moment
        var date = new Date(Number($(".date-validity-content").text().split(" ")[3]), 
        Number(monthNameToNum($(".product-travel-date")[i].children[0].data.split(" ")[3]) - 1),
        Number($(".product-travel-date")[i].children[0].data.split(" ")[2]));

        formated = moment(date).format("YYYY-MM-DD HH:mm:ss.SSS" + (date.getTimezoneOffset() === 0 ? '[Z]' : '[Z]'));

        trip.type = $(".travel-way")[i].children[0].data.trim();
        trip.date = formated;

        trip.trains = [];
        trip.trains[0] = {};

        // Scraping trains details, with more examples I can make this in a loop
        trip.trains[0].departureTime = $(".origin-destination-hour.segment-departure")[i].children[0].data.trim().replace(/h/g, ":");
        trip.trains[0].departureStation = $(".origin-destination-station.segment-departure")[i].children[0].data.trim();

        trip.trains[0].arrivalTime = $(".origin-destination-border.origin-destination-hour.segment-arrival")[i].children[0].data.trim().replace(/h/g, ":");
        trip.trains[0].arrivalStation = $(".origin-destination-border.origin-destination-station.segment-arrival")[i].children[0].data.trim();

        $(".segment:nth-child(3n)").remove();

        trip.trains[0].type = $(".segment")[2 * i].children[0].data.trim();
        trip.trains[0].number = $(".segment")[2 * i + 1].children[0].data.trim();

        trip.trains[0].passengers = [];

        // Scraping passengers' details in a loop
        for (var j = 0; j < 4; j++) {
            var passenger_type = {}

            if ($(".fare-details")[4 * i + j].children[2].data.includes("Billet échangeable") === true) {
                passenger_type.type = "échangeable";
            } 
            else {
                passenger_type.type = "non échangeable";
            }
            passenger_type.age = $(".typology")[4 * i + j].children[4].data.trim();
            passenger_type.seat = $(".placement")[4 * i + j].children[4].data.trim();

            trip.trains[0].passengers.push(passenger_type)
        }

        jsonObject.result.trips[0].details.roundTrips.push(trip)
    }

    jsonObject.result.custom = {};
    jsonObject.result.custom.prices = [];

    // Scraping prices
    for (let k = 1; k < $(".product-header > tbody > tr > td.cell").length; k = k + 2) {
        jsonObject.result.custom.prices.push({value: Number($(".product-header > tbody > tr > td.cell")[k].children[0].data.trim().replace(/,/g, ".").replace(/[^0-9.-]+/g, ""))})
    }

    jsonObject.result.custom.prices.push({value: Number($(".amount").last()[0].children[0].data.trim().replace(/,/g, ".").replace(/[^0-9.-]+/g, ""))});

    // Formating the JSON object 
    let data = JSON.stringify(jsonObject, null, 2);

    // Writing on file
    fs.writeFile(outputFileName, data, (err) => {
        if (err) throw err;
        console.log('Data written to file named ' + outputFileName);
        console.log('Done');
    });
});