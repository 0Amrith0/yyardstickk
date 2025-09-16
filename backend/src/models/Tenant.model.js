import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
    tenantName: {
        type: String,
        required: true,
        unique: true
    },
    plan: {
        type: String,
        enum: ["free", "pro"],
        default: "free"
    },
    notesCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;