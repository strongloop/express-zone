// Copyright IBM Corp. 2014. All Rights Reserved.
// Node module: express-zone
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

module.exports = createZoneMiddleware;

var zonesAreEnabled = (global.zone !== undefined);

function createZoneMiddleware() {
  if (!zonesAreEnabled) {
    throw new Error('Zones are not available. Ensure that zones are enabled on ' +
                    'startup.');
  }

  return wrapRequestInZone;
}

function wrapRequestInZone(req, res, next) {
  zone.create(function() {
    zone.name = req.method + ' ' + req.originalUrl;
    next();

  }).catch (function(err) {
    try {
      res.writeHead('500');
      res.end('\n' + err.zoneStack);
    } catch (err) {
      // Ignore
    }
  });
}
