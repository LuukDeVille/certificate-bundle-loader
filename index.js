const logger = require('./logger');
const https = require('https');
const caloader = require('./caloader');
const urlRootCaBundle = 'https://ccadb-public.secure.force.com/mozilla/IncludedCACertificateReportPEMCSV';
const urlIntermediateCaBundle = 'https://ccadb-public.secure.force.com/mozilla/PublicAllIntermediateCertsWithPEMCSV';

async function addCertificates(targetFingerprints) {

  try {

    let [rootCas, intermediateCas] = await Promise.all([
      caloader(urlRootCaBundle), // Always load all root CAs in order to work properly
      caloader(urlIntermediateCaBundle, targetFingerprints) // Only load target finderprints for intermediate CAs (if not undefined)
    ]);
    let allCas = rootCas.concat(intermediateCas);
    _enableHttpsWithCas(allCas);

  } catch (error) {
    logger.error(`Unhandled error while processing certificate data: ${error.message}`);
  }

};

function _enableHttpsWithCas(certificatePems) {

  https.globalAgent.options.ca = certificatePems; // TODO: whether ca already exists
  logger.info(`Added to HTTPS module agent ${certificatePems.length} certificates`);

}

module.exports.addCertificates = addCertificates;
