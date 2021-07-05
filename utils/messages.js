const moment = require("moment");

exports.formatMessage = (username, text) => {
  username = username.trim().toLowerCase();
  text = text.trim();

  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
};
