# Certificate bundle loader for Node.js

![](https://img.shields.io/npm/v/certificate-bundle-loader.svg?style=flat)

This module loads root and intermediate certificates from the [Common CA Database (CCADB)](https://ccadb.org/) and registers them in the global HTTPS module agent. This enables the usage of HTTPS without the need of dealing with certificate (PEM) files.

The CCADB is run by Mozilla, which is a repository of information about Certificate Authorities (CAs) with their root and intermediate certificates that are used in the WebPKI - the publicly-trusted system which underpins secure connections on the web.

This module uses the published certificate information of the CCADB. It extracts this data in order to register it in the global HTTPS module agent.

## Background

When performing requests to resources via HTTPS you will probably get an error like      `UNABLE_TO_VERIFY_LEAF_SIGNATURE` in your Node.js application. This is due to the reason, that either a root or intermediate certificate is missing in the validation of the certificate chain for the certificate of HTTPS resource.

The problem arises due to the reason that Node.js is delivered with a set of built-in root certificates. However, the root and intermediate certificates that are commonly accepted by browsers are not completely included in this delivery. This is the reason, why you can call an HTTPS resource in your browser without any problems, but your Node.js application will fail.

As this module takes the root and intermediate certificate bundles from the CCADB, you will get the same certificates which are accepted by your browser now loaded into your Node.js application as well.

## Install

    npm install certificate-bundle-loader --save

## Usage

You can either load all root and intermediate certificates or load specific certificates, which are identified by a fingerprint.

Please keep in mind that retrieving and loading certificate data from the CCADB takes a few seconds.

### Load all root and intermediate certificates

This option loads all root and intermediate certificates into the HTTPS module agent.

```javascript
const certificatebundle = require('certificate-bundle-loader');

await certificatebundle.addCertificates();
```

Remark: This method is not recommended for production, as this is going to add +1000 certificates to the HTTPS module agent. This has a negative impact on the performance for each request.

### Load specifc intermediate certificates

This option loads all root certificates and a selected list of intermediate certificates (identified by SHA-256 fingerprint) into the HTTPS module agent.

```javascript
const certificatebundle = require('certificate-bundle-loader');

const targetFingerprints = [
  "8FE4FB0AF93A4D0D67DB0BEBB23E37C71BF325DCBCDD240EA04DAF58B47E1840",
  "174E1DE77C8D93C68ECD2BD2EA6E191B584DB850277A834AAC898B7C80A91C70",
  "7D33AE618CD62553377D253D2EBCA285D84E98A924D89F98D4BE4FEE31F92AA8"
];

await certificatebundle.addCertificates(targetFingerprints);
```

Details about getting the SHA-256 fingerprint for a certificate can be found [here](https://knowledge.digicert.com/solution/SO28771.html).

## Other libraries dealing with certificates

If you don't want to follow the approach taken by this module, please check out the following alternatives:

 * Load certificate files via the [CLI option `NODE_EXTRA_CA_CERTS`](https://nodejs.org/api/cli.html#cli_node_extra_ca_certs_file) of Node.js
 * Load certificate files with module [ssl-root-cas](https://git.coolaj86.com/coolaj86/ssl-root-cas.js)
 * Load certificate files with module [syswidecas](https://github.com/capriza/syswide-cas)

## License

[MIT](./LICENSE)
