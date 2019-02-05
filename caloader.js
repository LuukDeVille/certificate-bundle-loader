const logger = require('./logger');
const csv = require('csvtojson');
const request = require('request-promise-native');
const requestErrors = require('request-promise-native/errors');
const csvTransformError = require('./errors/csvtransformerror');
const caLoaderError = require('./errors/caloadererror');
const keyPemInfo = 'PEM Info';
const keySha256Fingerprint = 'SHA-256 Fingerprint';

async function fetch(csvUrl, targetFingerprints) {

  try {

    logger.info(`Loading CSV data from URL ${csvUrl}`)
    let data = await request.get(csvUrl);
    let jsonCsv = await csv().fromString(data);

    let certificatePems = [];

    try {

      for (const entry of jsonCsv) {

        let currentPem = entry[keyPemInfo].slice(1, -1); // Removing quotation marks at the beginning and end
        let currentFingerprint = entry[keySha256Fingerprint];

        if (targetFingerprints === undefined) {
          certificatePems.push(currentPem);
        } else {

          let found = targetFingerprints.find(function(targetFingerprint) {
            return targetFingerprint === currentFingerprint;
          });

          if (found) {
            certificatePems.push(currentPem);
          }

        }

      }

    } catch (error) {
      throw new csvTransformError('Failed to extract data from CSV structure');
    }

    logger.info(`Found ${certificatePems.length} certificates from bundle ${csvUrl}`);
    return certificatePems;

  } catch (error) {

    if (error instanceof requestErrors.RequestError || error instanceof requestErrors.StatusCodeError) {
      logger.error(`Error in request with message:\n${error.message}`);
    } else if (error instanceof csvTransformError) {
      logger.error(`Unable to process CSV data: ${error.message}`);
    } else {
      logger.error(`Unhandled error while loading certificate data from CSV structure: ${error.message}`);
    }

    throw new caLoaderError(error.message);

  }


};

module.exports = fetch;
