module.exports = (mongoose) => {
  const { Schema } = mongoose;
  const user = mongoose.model('user', new mongoose.Schema({
    public_id: {
      type: String, unique: true, required: true,
    },
    user_type: { type: String, required: true },
    name: { type: String },
    profile_pic_url: { type: String },
    mobile_number: { type: String },
    is_mobile_verified: { type: Boolean, default: false },
    email: { type: String },
    is_email_verified: { type: Boolean, default: false },
    status: { type: String, default: 'ACTIVE' },
    role_id: { type: String, required: true },
    user_name: {
      type: String, unique: true, sparse: true,
    },
    hashed_password: { type: String },
    system_generated_password: { type: Boolean, default: true },
    salt: { type: String },
    password_validity: { type: Date },
    google_id: { type: String, unique: true, sparse: true },
    google: { type: Schema.Types.Mixed },
    linkdin_id: { type: String, unique: true, sparse: true },
    linkdin: { type: Schema.Types.Mixed },
    apple_id: { type: String, unique: true, sparse: true },
    apple: { type: Schema.Types.Mixed },
    last_login_at: { type: Date },
    distinct_id: { type: String, unique: true, required: true },
    concurrency_stamp: { type: String, unique: true, required: true },
    created_by: { type: String },
    updated_by: { type: String },
  }, {
    collection: 'user',
    timestamps: true,
    versionKey: false,
  }));

  user.virtual = (models) => {
    user.schema.virtual('role', {
      ref: models.role,
      localField: 'role_id',
      foreignField: 'public_id',
    });
  };

  return user;
};

