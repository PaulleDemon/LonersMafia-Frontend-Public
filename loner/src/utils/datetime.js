/**
 * Given a time in UTC returns the time in local time
 */

export function toLocalTime(utc){

    const date = new Date(utc)

    var hours = date.getHours()
    var minutes = date.getMinutes()
    var ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes
    var strTime = hours + ':' + minutes + ' ' + ampm

    const options = {year: 'numeric', month: 'short', day: 'numeric',  hour: 'numeric', minute: 'numeric' }
    // const options = { hour: 'numeric', minute: 'numeric' }
    
    // return date.getDate() + " "  + (date.getMonth()+1) + " " + date.getFullYear() + "  " + strTime
    return new Intl.DateTimeFormat('en-US', options).format(date)
}
