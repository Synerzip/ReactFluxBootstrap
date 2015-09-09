/**
 * Provides common constraints that can be used to validate forms
 * To use with FormTools mixin, each key here should match with the form's ref
 * http://validatejs.org/ for pre-built validators or directions to create your own
 */
const validate = require('validate.js');

validate.validators.newPasswordMatches = function(value, options, key, attributes) {
    if (attributes.newPassword !== attributes.verifyNewPassword) {
        return options.message;
    }
};
validate.validators.passwordMinLength = function(value, options, key, attributes) {
    const passwordMinLength = Number(attributes.passwordMinLength);
    if (value.length < passwordMinLength) {
        return options.message + passwordMinLength;
    }
};

module.exports = {
    username: {
      presence: true
    },
    password: {
      presence: true,
      length: {
        minimum: 6,
        message: 'Must be at least 6 characters'
      }
    },
    currentPassword: {
        presence: true
    },
    newPassword: {
        presence: true,
        passwordMinLength: {
            message: 'is to short, min. length is '
        }
    },
    verifyNewPassword: {
        presence: true,
        newPasswordMatches: {
            message: 'doesn\'t match new password'
        }
    },
    youtubeName: {
      presence: true
    },
    youtubeApiKey: {
      presence: true
    },
    youtubeChannelID: {
      presence: true
    },
    lithiumName: {
      presence: true
    },
    lithiumApiKey: {
      presence: true
    },
    lithiumUrl: {
      presence: true
    },
    schedule: {
    }
};
