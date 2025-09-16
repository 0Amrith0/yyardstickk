import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["Admin", "Member"],
        default: "Member"
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant", 
        required: true 
    },
    isInvited: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;