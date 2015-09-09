//could do a require djangoGeneratedFile.json here

if (!window.location.origin) {
  window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}

const origin = window.location.origin; //will need to be replaced when we go isomorphic

const route_prefix = '/',
  base_url = origin + route_prefix;

module.exports = {
  ROUTE_PREFIX: route_prefix,
  BASE_URL: base_url,
  BASE_API: origin + '/api/v1/'
};
