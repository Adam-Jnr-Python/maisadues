const mongoose = require("mongoose");

const duesSchema = mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

duesSchema.index({ department: 1, level: 1, adminId: 1 }, { unique: true });

module.exports = mongoose.model("Dues", duesSchema);
