var shortMonths = ["Jan","Feb","March","Apr","May","June","Jule","Aug","Sept","Oct","Nov","Dec"];

/**
 *
 * @param date : Date
 * @return
 */
function getReadableDate(date) {
    var strDate = '';


    if (isToday(date)) {
        strDate += twoDigitsFormat(date.getHours()) + ":" + twoDigitsFormat(date.getMinutes()) + ', today';
    } else {
        var month = date.getMonth();

        strDate += date.getDate().toString() + " ";
        strDate += shortMonths[month];

        if (isThisYear(date)) {
            strDate += ", " + date.getFullYear();
        }
    }


    return strDate;
}

function isToday(date) {
    var today = new Date();
    return (date.getDate() == today.getDate())
        && (date.getMonth() == today.getMonth())
        && (date.getFullYear() == today.getFullYear());
}

function isThisYear(date) {
    var today = new Date();
    return (date.getFullYear() == today.getFullYear());

}

function dateSortFunction(a, b) {
    var dateA = a.date || new Date();
    var dateB = b.date || new Date();

    if (dateA > dateB)
        return -1;
    else if (dateA < dateB)
        return 1;
    else
        return 0;
}

function twoDigitsFormat(n) {
    if (n < 10) {
        return '0' + n;
    } else {
        return n.toString();
    }

}