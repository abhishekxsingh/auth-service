module.exports = {
  apps: [
    {
      name: "auth-service",
      script: "./server/server.js",
      instances: 1,
      // max_memory_restart: "300M",

      // Logging
      // out_file: "./out.log",
      // error_file: "./error.log",
      // merge_logs: true,
      // log_date_format: "DD-MM HH:mm:ss Z",
      // log_type: "json",

      // Env Specific Config
      env_production: {
        NODE_ENV: "production",
        // exec_mode: "cluster_mode",
        DB_NAME: "auth_service",
        DB_USER_NAME:"shubham123",
        DB_PASSWORD: "shubham123",
        DB_HOST : "dev.fhoufqh.mongodb.net" ,
        HOST:'0.0.0.0',
        PORT: 3000,
        REDIS_SERVER: 'localhost',
        DEVICE_REGISTRATION_SECRET:'api-service-secret',
        IDENTITY_SERVICE_URL: 'http://localhost:3000',
      },
      env_development: {
        watch: true,
        watch_delay: 3000,
        NODE_ENV: "development",
        DB_NAME: "auth_service",
        DB_USER_NAME:"shubham123",
        DB_PASSWORD: "shubham123",
        DB_HOST : "dev.fhoufqh.mongodb.net" ,
        HOST:'0.0.0.0',
        PORT: 3000,
        REDIS_SERVER: 'localhost',
        DEVICE_REGISTRATION_SECRET:'api-service-secret',
        IDENTITY_SERVICE_URL: 'http://localhost:3000',
      },
    },
  ],
};