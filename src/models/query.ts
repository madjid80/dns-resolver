const mongoose = require('mongoose');

const Query = mongoose.model(
  'Query',
  mongoose.Schema({
    domain: {
      type: String,
      unique: true,
    },
    addresses: [
      {
        ip: String,
      },
    ],
    clientIp: String
  },{timestamps: true})
);

export default Query;
