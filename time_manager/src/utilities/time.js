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


/**
 * Gets difference in time between two given strings of format "hh:mm" with given AM/PM, in minutes
 * @param {*} timeStringStart Start time
 * @param {*} timeStringEnd End time
 * @param {*} selected Object that contains the start times AM/PM value and end times AM/PM value
 * @returns Difference in time in minutes
 */
 function getTimeDifference(timeStringStart, timeStringEnd, selected) {
  let start = getTime(timeStringStart, selected.start)
  let end = getTime(timeStringEnd, selected.end)

  return Math.abs(start.diff(end, 'minute'));
}


const timeFormat = {
  AM: 'AM',
  PM: 'PM'
}


export { 
  timeFormat,
  getTimeDifference
}