import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "Researcher" | "Student";
  institution?: string;
  department?: string;
  orcid?: string;
  bio?: string;
  surveysManaged?: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Researcher", "Student"], default: "Researcher" },
    institution: { type: String, default: "University of Mumbai / Higher Education Cell" },
    department: { type: String, default: "Department of Computer Science" },
    orcid: { type: String, default: "0000-0002-1825-009X" },
    bio: { type: String, default: "Researcher studying Artificial Intelligence in higher education." },
    surveysManaged: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
