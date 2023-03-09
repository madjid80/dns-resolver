const mongoose = require('mongoose');

const Domain = mongoose.model(
  'Domain',
  mongoose.Schema(
    {
      domain: String,
      ip: String,
    },
    { timestamps: true }
  )
);

export default Domain;
