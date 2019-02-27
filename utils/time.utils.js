const { DateTime } = require('luxon')

const getLocalNowWithTimezone = (timezone = 'Australia/Sydney') => {
  return DateTime.fromObject({ zone: timezone }).toLocaleString(
    DateTime.DATETIME_MED_WITH_SECONDS
  )
}

module.exports = {
  getLocalNowWithTimezone
}
