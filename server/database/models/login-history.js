module.exports = (mongoose) => {
  const loginHistory = mongoose.model('login_history', new mongoose.Schema({
    public_id: { type: String, unique: true, required: true },
    user_id: { type: String, required: true },
    device_id: { type: String, required: false },
    login_type: { type: String, required: true },
  }, {
    collection: 'login_history',
    timestamps: true,
    versionKey: false,
  }));

  return loginHistory;
};

