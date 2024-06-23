module.exports = (mongoose) => {
  const role = mongoose.model('role', new mongoose.Schema({
    public_id: { type: String, unique: true, required: true },
    name: { type: String },
    role: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    created_by: { type: String },
    updated_by: { type: String },
  }, {
    collection: 'role',
    timestamps: true,
    versionKey: false,
  }));

  return role;
};

