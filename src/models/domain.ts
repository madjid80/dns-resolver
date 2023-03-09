const mongoose = require('mongoose');

const Domain = mongoose.model(
  'Domain',
  mongoose.Schema(
    {
      domain: {
        type: String, 
        unique: true
      },
      ip: String,
    },
    { timestamps: true }
  )
);

export default Domain;
