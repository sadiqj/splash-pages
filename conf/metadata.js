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
  CTA_BASIC: 'Start taking payments',
  CTA_PRO: 'Contact sales',
  LOGO: 'https://gocardless.com/images/logos/gocardless-square.png',
  
  // Details of international offices & contact numbers
  // The country code (e.g. GB, FR, BE) should use ISO-3166-2
  // See http://en.wikipedia.org/wiki/ISO_3166-2 for a list of valid country codes
  GOCARDLESS: {
    GB: {
      HOMEPAGE: 'https://gocardless.com/',
      POSTAL_ADDRESS: {
        STREET_ADDRESS: '338-346 Goswell Road',
        ADDRESS_LOCALITY: 'London',
        POSTAL_CODE: 'EC1V 7LQ',
        ADDRESS_COUNTRY: '',
        ADDRESS_COUNTRY_ISO: 'GB'
      },
      SALES: {
        PHONE_FULL: '+44 20 7183 8674',
        PHONE_LOCAL: '020 7183 8674',
        EMAIL: 'help@gocardless.com'
      },
      SUPPORT: {
        PHONE_FULL: '+44 20 7183 8674',
        PHONE_LOCAL: '020 7183 8674',
        EMAIL: 'help@gocardless.com'
      }
    },
    FR: {
      HOMEPAGE: 'https://gocardless.com/fr',
      POSTAL_ADDRESS: {
        STREET_ADDRESS: '338-346 Goswell Road',
        ADDRESS_LOCALITY: 'Londres',
        POSTAL_CODE: 'EC1V 7LQ',
        ADDRESS_COUNTRY: '',
        ADDRESS_COUNTRY_ISO: 'GB'
      },
      SALES: {
        PHONE_FULL: '+33 9 75 18 42 95',
        PHONE_LOCAL: '09 75 18 42 95',
        EMAIL: 'france@gocardless.com'
      }
    },
    BE: {
      HOMEPAGE: 'https://gocardless.com/fr',
      POSTAL_ADDRESS: {
        STREET_ADDRESS: '338-346 Goswell Road',
        ADDRESS_LOCALITY: 'Londres',
        POSTAL_CODE: 'EC1V 7LQ',
        ADDRESS_COUNTRY: '',
        ADDRESS_COUNTRY_ISO: 'GB'
      },
      SALES: {
        PHONE_FULL: '+32 78 48 09 94',
        PHONE_LOCAL: '078 48 09 94',
        EMAIL: 'belgium@gocardless.com'
      }
    }
  },
  SOCIAL_LINKS: {
    FACEBOOK: 'https://www.facebook.com/GoCardless',
    TWITTER: 'https://twitter.com/gocardless',
    GOOGLE: 'https://plus.google.com/+Gocardless',
    LINKEDIN: 'https://www.linkedin.com/company/gocardless',
    GITHUB: 'http://github.com/gocardless'
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
  
  // Add social network links to sameAs
  for (var network in metadata.SOCIAL_LINKS) {
    organization.sameAs.push(metadata.SOCIAL_LINKS[network]);
  }
  
  // Add contact details for office in each country
  // See https://support.google.com/webmasters/answer/4620709?hl=en for supported contactType
  for (var country_code in metadata.GOCARDLESS) {
    // Sales number (contactType = sales)
    if (metadata.GOCARDLESS[country_code].SALES) {
      organization.contactPoint.push(
        {
          "@type" : "ContactPoint",
          "telephone" : metadata.GOCARDLESS[country_code].SALES.PHONE_FULL,
          "email" : metadata.GOCARDLESS[country_code].SALES.EMAIL,
          "contactType" : "sales",
          "areaServed" : country_code
        }
      );
    }
    // Customer support number (contactType = customer support)
    if (metadata.GOCARDLESS[country_code].SUPPORT) {
      organization.contactPoint.push(
        {
          "@type" : "ContactPoint",
          "telephone" : metadata.GOCARDLESS[country_code].SUPPORT.PHONE_FULL,
          "email" : metadata.GOCARDLESS[country_code].SUPPORT.EMAIL,
          "contactType" : "customer support",
          "areaServed" : country_code
        }
      );
    }
  }
  
  return organization;
}

metadata.SCHEMA_ORGANIZATION = JSON.stringify(buildSchemaDotOrgOrganization(metadata));

module.exports = metadata;
