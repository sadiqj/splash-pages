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
  CTA_BASIC: 'Start taking payments',
  CTA_PRO: 'Contact sales',

  LOGO: 'https://gocardless.com/images/logos/gocardless-square.png',
  SOCIAL_LINKS: {
    facebook: 'https://www.facebook.com/GoCardless',
    twitter: 'https://twitter.com/gocardless',
    google: 'https://plus.google.com/+Gocardless',
    linkedin: 'https://www.linkedin.com/company/gocardless',
    github: 'http://github.com/gocardless'
  },
  CONTACT_POINTS: {
    // Country Code (e.g. GB, FR, BE)
    //   To comply with schema.org requirements, the country code should use ISO-3166-2
    //   See http://en.wikipedia.org/wiki/ISO_3166-2 for a list of valid country codes
    // Contact type (e.g. customer service, sales)
    //   See https://developers.google.com/structured-data/customize/contact-points
    'GB': {
      'customer service': {
        'phone_full': '+44 20 7183 8674',
        'phone_local': '020 7183 8674',
        'email': 'help@gocardless.com'
      },
      'sales': {
        'phone_full': '+44 20 7183 8674',
        'phone_local': '020 7183 8674',
        'email': 'help@gocardless.com'
      }
    },
    'FR': {
      'sales': {
        'phone_full': '+33 9 75 18 42 95',
        'phone_local': '09 75 18 42 95',
        'email': 'france@gocardless.com'
      }
    },
    'BE': {
      'sales': {
        'phone_full': '+32 78 48 09 94',
        'phone_local': '078 48 09 94',
        'email': 'belgium@gocardless.com'
      }
    }
  }
};

// Documentation from Google:
//   https://developers.google.com/structured-data/customize/overview
// Google's tool for validating the output:
//   https://developers.google.com/structured-data/testing-tool/
// Original Schema:
//   http://schema.org/Organization
function buildSchemaDotOrgOrganization(metadata) {
  var organization = {
    "@context": "http://schema.org",
    "@type": "Organization",
    "url": "https://gocardless.com/",
    "logo": metadata.LOGO,
    "sameAs" : [],
    "contactPoint" : [],
  }
  
  for (var network in metadata.SOCIAL_LINKS) {
    organization.sameAs.push(metadata.SOCIAL_LINKS[network]);
  }
  
  for (var country_code in metadata.CONTACT_POINTS) {
    for (var contact_type in metadata.CONTACT_POINTS[country_code]) {
      var contactInfo = metadata.CONTACT_POINTS[country_code][contact_type];
      if (contactInfo.hasOwnProperty('full')) {
        organization.contactPoint.push(
          {
            "@type" : "ContactPoint",
            "telephone" : contactInfo.full,
            "contactType" : contact_type,
            "areaServed" : country_code
          }
        );
      }
    }
  }
  
  return organization;
}

metadata.SCHEMA_ORGANIZATION = JSON.stringify(buildSchemaDotOrgOrganization(metadata));

module.exports = metadata;
