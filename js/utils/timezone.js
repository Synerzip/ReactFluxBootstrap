const _ = require('lodash'),
      offsetRegExp = /([+-]{1})([0-9]{2})[0-9]{2}/;

module.exports = {
    reverseTimezoneOffset: function (momentObj, offset) {
        const matches = offsetRegExp.exec(offset);
        if (_.isArray(matches) && matches.length === 3) {
            const hours = matches[2];
            if (matches[1] === '+') {
                momentObj.subtract(hours, 'hours');
            } else {
                momentObj.add(hours, 'hours');
            }
        }
        return momentObj;
    }
};
