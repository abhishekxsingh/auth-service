module.exports = (mongoose) => {
  const userDevice = mongoose.model('user_device', new mongoose.Schema({
    public_id: { type: String, unique: true, required: true },
    device_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    user_id: { type: String, required: true },
  }, {
    collection: 'user_device',
    timestamps: true,
    versionKey: false,
  }));

  return userDevice;
};

