const mongoose = require('mongoose');

const Domain = mongoose.model(
  'Domain',
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
  },{timestamps: true})
);

export default Domain;
