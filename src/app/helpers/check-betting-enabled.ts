import * as moment from 'moment';

export function checkBettingEnable(currentDate: string, data: any) {
  // console.log(currentDate, data);
  if (currentDate == undefined) {
    return false;
  }
  let nowDate = moment(currentDate);
  let matchDate = moment(data.matchDate);

  if (data.settings) {
    // console.log(data.settings.betBeforeInplayMins)

    if (data.settings.betBeforeInplayMins == 1) {
      if (data.sportId == 4) {
        var time = moment.duration("00:30:00");
        matchDate = matchDate.subtract(time);
      }
      if (data.sportId == 1 || data.sportId == 2) {
        var time = moment.duration("00:30:00");
        matchDate = matchDate.subtract(time);
      }
    }
    else {
      if (data.sportId == 4) {
        // var time = moment.duration("00:30:00");
        // matchDate = matchDate.subtract(time);
        var daysMinus = 1;
        matchDate = matchDate.subtract(daysMinus, "days");
      }
      if (data.sportId == 1 || data.sportId == 2) {
        var time = moment.duration("00:30:00");
        matchDate = matchDate.subtract(time);

      }
    }

  } else {
    if (data.sportId == 4) {
      var time = moment.duration("00:30:00");
      matchDate = matchDate.subtract(time);
    }
    if (data.sportId == 1 || data.sportId == 2) {
      var time = moment.duration("00:30:00");
      matchDate = matchDate.subtract(time);
    }
  }


  const days = matchDate.diff(nowDate, 'days');
  const hours = matchDate.subtract(days, 'days').diff(nowDate, 'hours');
  const minutes = matchDate.subtract(hours, 'hours').diff(nowDate, 'minutes');

  if (days > 0) {
    return false;
  }
  if (days <= 0 && hours > 0) {
    return false;
  }
  if (days <= 0 && hours <= 0 && minutes > 0) {
    return false;
  }
  if (days <= 0 && hours <= 0 && minutes <= 0) {
    return true;
  }
}