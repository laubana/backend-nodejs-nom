const corsConfig = {
  origin: (origin, callback) => {
    if (process.env.ORIGINS.split(",").indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("CORS Error"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 204,
  origin: true,
};

module.exports = corsConfig;
