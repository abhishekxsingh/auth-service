module.exports = (mongoose) => {
  const client = mongoose.model('client', new mongoose.Schema({
    public_id: { type: String, unique: true, required: true },
    user_id: { type: String, required: true },
    merchant_id: { type: String },
    key_id: { type: String, unique: true, required: true },
    private_key: { type: Buffer, required: true },
    public_key: { type: Buffer, required: true },
    issuer: { type: String, required: true },
    subject: { type: String, required: true },
    audience: { type: String, required: true },
    expires_in: { type: String, required: true },
    refresh_expires_in: { type: String, required: true },
    algorithm: { type: String, required: true, default: 'RS256' },
    secret: { type: String, required: true },
    tags: { type: [ mongoose.Schema.Types.Mixed ] },
    salt: { type: String },
    passphrase: { type: String },
    last_used_at: { type: Date, default: Date.now },
    created_by: { type: String, required: true },
    updated_by: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
  }, {
    collection: 'client',
    timestamps: true,
    versionKey: false,
  }));

  return client;
};

