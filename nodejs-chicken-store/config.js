// config.js

// Declare an empty config object
var config = {};

// Collect app config environment variables
config.port = process.env.NODEJS_CHICKEN_STORE_SERVICE_PORT || 8080;
config.host = process.env.NODEJS_CHICKEN_STORE_SERVICE_HOST || 'localhost';

// Collect related service environment variables
config.mongoPort = process.env.NODEJS_CHICKEN_STORE_DB_SERVICE_PORT || 27017;
config.mongoHost = process.env.NODEJS_CHICKEN_STORE_DB_SERVICE_HOST || 'localhost';
config.mongoDatabase = process.env.MONGODB_DATABASE || 'chickendb';
// Collect passwords
// Set default mqtt user and pass
config.mongoUser = 'nodejs';
config.mongoPass = 'nodejs';

// Get relevant secrets from the secrets volume if it exists
try {
  config.mongoUser = fs.readFileSync('/etc/secret-volume/mongo-username');
  config.mongoPass = fs.readFileSync('/etc/secret-volume/mongo-password');
} catch (ex) {
  console.log(`Something went wrong while attempting to access secrets-volume\n${ex}
    \nContinuing...`);
}

// Create URI with mongoddb username and password
config.mongoUri =
  `mongodb://${config.mongoUser}:${config.mongoPass}@${config.mongoHost}:${config.mongoPort}/${config.mongoDatabase}`;
// Set options for reconnect
config.mongoOptions = {
  server:
    {
        // sets how many times to try reconnecting
        reconnectTries: Number.MAX_VALUE,
        // sets the delay between every retry (milliseconds)
        reconnectInterval: 1000
    },
    config: { autoIndex: false }
};

// Set reductionDT
config.reductionDT = process.env.REDUCTION_DT || 2500;

// Export the config object as unnamed
module.exports = config;
