function getDateTimeFromString(date) {
  var dateParsed_a_s = date.split('-');
  return new Date(parseInt(dateParsed_a_s[0]), parseInt(dateParsed_a_s[1]) - 1, parseInt(dateParsed_a_s[2]));
}

function xxx(startDate, endDate) {
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return diffDays;
}

function xxx2(startDate, endDate) {
  var millisPerDay = 24 * 60 * 60 * 1000;
  if (endDate.getUTCMonth() == startDate.getUTCMonth() && endDate.getUTCFullYear() == startDate.getUTCFullYear()) {
    var dateStartNew = new Date(startDate);
    dateStartNew.setUTCMonth(startDate.getUTCMonth() - 1);
    var dateEndNew = new Date(endDate);
    dateEndNew.setUTCMonth(endDate.getUTCMonth() - 1);
    if (dateStartNew.getUTCMonth() == startDate.getUTCMonth()) {
        dateStartNew.setDate(1);
        dateStartNew = new Date(dateStartNew.getTime() - millisPerDay);
    }
    if (dateEndNew.getUTCMonth() == endDate.getUTCMonth()) {
        dateEndNew.setDate(1);
        dateEndNew = new Date(dateEndNew.getTime() - millisPerDay);
    }
  } else {
    var diff = endDate.getTime() - startDate.getTime();
    var dateStartNew = new Date(startDate.getTime() - millisPerDay - diff);
    var dateEndNew = new Date(startDate.getTime() - millisPerDay);
  }
  var dateResults = [];
  dateResults.push(dateStartNew);
  dateResults.push(dateEndNew);
  return dateResults;
}

var startDate = getDateTimeFromString('2017-01-22');
var endDate = getDateTimeFromString('2017-01-28');



var results = xxx(startDate, endDate)

console.log(results)






