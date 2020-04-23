const moment = require('moment');
const timestamp = moment().format('h:mm a');

const formatMessage = (username, message) => ({ username, message, timestamp });

module.exports = formatMessage;
