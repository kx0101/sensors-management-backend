module.exports = {
	apps: [
		{
			name: "Sensors",
			port: "3000",
			script: "./build/index.js",
			env: {
				JWT_HEADER: "jwt-secret",
				PORT: 3000,
				JWT_SECRET_KEY: "Kex2006!",

				MONGODB_URL: "mongodb://localhost:2017/",
				MONGODB_DBNAME: "Sensors",
				MONGODB_REPLICASET: "rs0",
				MONGODB_USERNAME: "admin",
				MONGODB_PASSWORD: "Kex2006!",

				GATEWAY_PORT: "10001",
				GATEWAY_URI: "192.168.1.10",
			},
		},
	],
};
