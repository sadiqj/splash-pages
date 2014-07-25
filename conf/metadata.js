'use strict';

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

var mixpanelProduction = '0ebe37c4ed96a0432e989cc20ca1db04';
var mixpanelTest = 'fa029f81daf1c512854b1345342c4e6c';
var mixpanelToken = isProduction() ? mixpanelProduction : mixpanelTest;

var metadata = {
  ENV_PRODUCTION: isProduction(),
  MIXPANEL_TOKEN: mixpanelToken,
  TRADING_ADDRESS: '338-346 Goswell Road<br>London, EC1V 7LQ',
  SUPPORT_CONTACT_NUMBER: '020 7183 8674',
  SUPPORT_EMAIL: 'help@gocardless.com',
  GITHUB_LINK: 'http://github.com/gocardless',
  TWITTER_LINK: 'https://twitter.com/gocardless'
};

module.exports = metadata;
