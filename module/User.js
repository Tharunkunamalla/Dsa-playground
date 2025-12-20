import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.schema(
  {
    user: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

//middleware and hashing password before saving to database
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.MathchPassword = async function () {
  return await bcrypt.compare(password, this.password);
};

export default User = mongoose.model("User", UserSchema);
