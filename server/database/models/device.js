module.exports = (mongoose) => {
  const device = mongoose.model('device', new mongoose.Schema({
    public_id: { type: String, unique: true },
    device_id: { type: String, unique: true },
    version_code: { type: String, required: true },
    platform: { type: String, default: 'AN' },
    status: { type: String, default: 'ACTIVE' },
    registration_token: { type: String },
    mcc_mnc: { type: String },
    operator: { type: String },
    is_deleted: { type: Boolean, default: false },
    utm_source: { type: String },
    utm_medium: { type: String },
    utm_campaign: { type: String },
    build_number: { type: String },
    brand: { type: String },
    build_name: { type: String },
    manufacturer: { type: String },
    model: { type: String },
    os_version: { type: String },
    referrer: { type: String },
    screen_dpi: { type: String },
    screen_height: { type: String },
    screen_width: { type: String },
    wifi: { type: String },
    radio: { type: String },
    os: { type: String },
    mcc: { type: String },
    mnc: { type: String },
    network: { type: String },
  }, {
    collection: 'device',
    timestamps: true,
    versionKey: false,
  }));

  return device;
};

