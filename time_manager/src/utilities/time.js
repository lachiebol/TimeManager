
import dayjs from 'dayjs';

/**
 * Takes string of form "hh:mm" and extracts hour and minute values
 * @param {*} timeString string to be split into respective values
 * @returns Array containing hours and minutes
 */
function getTimeValues(timeString) {
  return [timeString.slice(0, 2), timeString.slice(2, 4)].map( val => parseInt(val) );
}

/**
 * Gets dayjs time object from given timeString, used so I can use diff method of dayjs
 * @param {*} timeString 
 * @param {*} selected 
 * @returns 
 */
function getTime(timeString, selected) {
  let [hour, minute] = getTimeValues(timeString);
  if (selected == timeFormat.PM) hour += 12;
  let time = dayjs().hour(hour).minute(minute);

  return time;
}

function getTimeStringFromNumbers(hour, minute) {
  let hourString = hour;
  let minuteString = minute;
  if(hour < 10) {
    hourString = `0${hour}`;
  }

  if(minute < 10) {
    minuteString = `0${minute}`;
  }

  return `${hourString}:${minuteString}`
}


/**
 * Gets difference in time between two given strings of format "hh:mm" with given AM/PM, in minutes
 * @param {*} timeStringStart Start time
 * @param {*} timeStringEnd End time
 * @param {*} selected Object that contains the start times AM/PM value and end times AM/PM value
 * @returns Difference in time in minutes
 */
 function getTimeDifference(timeStart, timeEnd) {
  let start = getTime(timeStart.timeValue, timeStart.timeFormat)
  let end = getTime(timeEnd.timeValue, timeEnd.timeFormat)

  return Math.abs(start.diff(end, 'minute'));
}


function getTimeRange(timeStart, timeEnd, increment) {
  let [startHour, startMinute] = getTimeValues(timeStart.timeValue);
  let [endHour] = getTimeValues(timeEnd.timeValue);
  let range = [];
  startMinute = startMinute - startMinute % 30
  while (startHour != endHour) {

    startMinute += increment;
    if(startMinute != startMinute % 60) {
      startMinute = startMinute % 60;
      startHour += 1;
    }

    if(startHour > 12) {
      switch (timeStart.timeFormat) {
        case timeFormat.AM:
          timeStart.timeFormat = timeFormat.PM;
          break;
        case timeFormat.PM:
          timeStart.timeFormat = timeFormat.AM;
          break;
      }

      startHour = 1;


    }

    let timeObject = {
      timeValue: getTimeStringFromNumbers(startHour, startMinute),
      timeFormat: timeStart.timeFormat
    }
    
    range.push(timeObject);
  }

  return range;

}




/**
 * Enum for time formats, using just to keep consistency
 */
const timeFormat = {
  AM: 'AM',
  PM: 'PM'
}


export { 
  timeFormat,
  getTimeDifference,
  getTimeValues,
  getTimeRange
}