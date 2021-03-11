
// custom validator to check that two fields match
export function customDateFormat(date: string) {
  // console.log(date)
  // return (date: string) => {
  // if (date.indexOf('-') > -1) {
  var splitdate = date.split('-');
  var splitdate2 = splitdate[2].split(' ');
  if (splitdate[1] == "Jan") {
    date = splitdate2[0] + '-01-' + splitdate[0] + ' ' + splitdate2[1];
  } else if (splitdate[1] == "Feb") {
    date = splitdate2[0] + '-02-' + splitdate[0] + ' ' + splitdate2[1];
  } else if (splitdate[1] == "Mar") {
    date = splitdate2[0] + '-03-' + splitdate[0] + ' ' + splitdate2[1];
  } else if (splitdate[1] == "Apr") {
    date = splitdate2[0] + '-04-' + splitdate[0] + ' ' + splitdate2[1];
  } else if (splitdate[1] == "May") {
    date = splitdate2[0] + '-05-' + splitdate[0] + ' ' + splitdate2[1];
  } else if (splitdate[1] == "Jun") {
    date = splitdate2[0] + '-06-' + splitdate[0] + ' ' + splitdate2[1];
  } else if (splitdate[1] == "Jul") {
    date = splitdate2[0] + '-07-' + splitdate[0] + ' ' + splitdate2[1];
  } else if (splitdate[1] == "Aug") {
    date = splitdate2[0] + '-08-' + splitdate[0] + ' ' + splitdate2[1];
  } else if (splitdate[1] == "Sep") {
    date = splitdate2[0] + '-09-' + splitdate[0] + ' ' + splitdate2[1];
  } else if (splitdate[1] == "Oct") {
    date = splitdate2[0] + '-10-' + splitdate[0] + ' ' + splitdate2[1];
  } else if (splitdate[1] == "Nov") {
    date = splitdate2[0] + '-11-' + splitdate[0] + ' ' + splitdate2[1];
  } else if (splitdate[1] == "Dec") {
    date = splitdate2[0] + '-12-' + splitdate[0] + ' ' + splitdate2[1];
  } else {
    date = splitdate2[0] + '-' + splitdate[1] + '-' + splitdate[0] + ' ' + splitdate2[1];
  }
  // }
  // else {
  //   var splitdate = date.split('/');
  //   var splitdate2 = splitdate[2].split(' ');
  //   date = splitdate2[0] + '-' + splitdate[0] + '-' + splitdate[1] + ' ' + splitdate2[1]+' ' + splitdate2[2];
  // }

  return date.replace(/ /g, "T");
  // }
}