const certificatebundle = require('./index');
const https = require('https');
const expect = require('chai').expect;

describe('Load certificate bundles', function() {

  afterEach(function() {
    https.globalAgent.options.ca = undefined;
  });

  it('should add the root and no intermediate certificates to the https agent', async function() {

    await certificatebundle.addCertificates([]);

    expect(https.globalAgent.options.ca).to.have.lengthOf.above(1);

  });

  it('should add the root and defined intermediate certificates to the https agent', async function() {

    const targetFingerprints = [
      "8FE4FB0AF93A4D0D67DB0BEBB23E37C71BF325DCBCDD240EA04DAF58B47E1840",
      "174E1DE77C8D93C68ECD2BD2EA6E191B584DB850277A834AAC898B7C80A91C70",
      "7D33AE618CD62553377D253D2EBCA285D84E98A924D89F98D4BE4FEE31F92AA8"
    ];

    await certificatebundle.addCertificates(targetFingerprints);

    expect(https.globalAgent.options.ca).to.have.lengthOf.above(1);

  });

  it('should add the root and all intermediate certificates to the https agent', async function() {

    await certificatebundle.addCertificates();

    expect(https.globalAgent.options.ca).to.have.lengthOf.above(1);

  });

});
