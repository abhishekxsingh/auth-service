const admin = require('firebase-admin');

const serviceAccount = {
  type: 'service_account',
  project_id: 'devcartel-1ce57',
  private_key_id: '49d299cd967ea22072ea9502ccb814eb9da74a91',
  // eslint-disable-next-line max-len
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCU8Q2KqCKKhM1A\nAZaYuIGdn9nZ4On0V1vagH15uhxpqIFp89ZAkM4xO5UYoiHEduWNJu+6ibuxuzCU\nEDwQhJICrUgrBXG0LfN9ywaHzeMukpx5h+qUovkuWqmlAHjAWpBhcTKppOzVG7IT\nbI/irAjujQNOymI6NokOqXBzQlNnAnmQ4AfeDljPi/FAb/pGZtJLEyQjWMbEO+zq\nvXXDQFZw/xpkOIQ6XVw2VG0X+FRBciGFQLV0BfSG6pWmtbU53C9bKYh/xMJfRwhr\nsvuL6xqwo+EW5VYSWXMasczhy77yECHodGNdqZ5cRcO+RwlmLzqrUO3fMMMkLS2o\nu6nQE1OpAgMBAAECggEANZgp/cdzqnGQI+SOasUVywDu1NJ0jTp0MIOE4yz/tVtv\nug8GfTQ+JgQhKfyJdxcrkee9YtvWAOXxXI4c9vqlSbZN3kE2wZW5ZP4OCwcgpS0X\nhjnMxRCB5taz7c5mJR1Rj+a6SsYwfJzbLtclTXUHP8PZOVxlDTp7hh2de7QVq95w\n49ZWXy4pJM3gJETGbkYhpCX1nlp42NbP8e3MegJpFKSH0Qo9Zcp6BMj0F0TNqyjP\ndMQlA4K5uXlE55ewl+jZiGHqenStvLL81mLY0GX8rLDmr34D1dRFLA5FpUP9mayb\nYwKUn69cUNwWevZGjrjj17EBOrGaVRmEqYtaOFtoQwKBgQDNzVdr+dwnvuErzRHt\nB6kCkG8OcuQjzOe/+mooDHxLD5UMBeBl6qLixyGa5PVBR2WqjqfDcvTryjug2Pkz\nKK2IUhQtXvGlUgkyNUtrthb7ibPkQPXUw7HFYDOvIy50RxwLyMsHAmK35Pg/a9Pu\n71huBJG1YVrlBt7e9c527cSpRwKBgQC5RTz58uC2TlTiEzc0AQ9N/eq39wEreINW\n8mxdUiAoax4ul6OTYd/wU5O1NQxuqEehoqwj575UMmq5rNqf6cssWXVJoAcdXMho\nK+6xyIAM6FEPFb9bfQSJYBKCP/j78oFamVSYFgprNdAEojUqxOr5QtyV7wAfVmx7\nnkumUFOTjwKBgEiXARroyqqKPUoBzyzX4tkwsLtb8vRdtfCVFxSBMuYW3O+cswW/\nuSxcKJJF5+vajxWVs77QsWrprhaR8XQGCQ9oRA2sy3cQdIXtHmkjlP+sFnOQJiWh\n0PZZdGF1+1CwNEhDzrjuMnvCm31jPyGr8nj7y5k6eaEGx13FPcndG9zJAoGAW5xG\n+HkGcF7vThKeW1Ki1LfXljvHEk229AlPWB3B1PqSpAtLURc2ekl5YkLm8Ni5As3D\nPMXcsRl0+Hbma+hZFIbvngZJPlWgqxH+J16zIq7FViY0xvJciek9fbZQUZSqLbhf\nwgwz/qtPPttOWuWgIrzTAjh54QUFA2NUmNpjWTUCgYEAtv0Vh7bnMUSvdcfFbQNc\nSnPHusCC1uCdVGTclFqvVGfYO6R5e3nby1T+qUz51xUWkEpcFbPjqAJrfLgDUq9s\nLT87+MGVmrUhMrcjpXuCPw5kHw3DeEtRoSuOa5vqpJiLNiXVDnkU4fRJSktl1jeY\nc81RIzoizIhswEQn+pTcN88=\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-7n12w@devcartel-1ce57.iam.gserviceaccount.com',
  client_id: '106534994766366564429',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7n12w%40devcartel-1ce57.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',

};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://devcartel-1ce57-default-rtdb.asia-southeast1.firebasedatabase.app',
});

module.exports = admin;
