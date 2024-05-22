import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const OfficerSchema = new mongoose.Schema(
    {
        service_no: { type: String, required: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true},
        avatar: { type: String },
        previleges: [{ type: Number, enum: [100,111, 112, 113,114],default:100}],
        office: {
            type:String,limit:100
        },
        status: { type: String, enum: ["active", "suspended", "relieved", "inactive"], required: true, default: "inactive" },
        password: { type: String, required: [true ,'password is required']},
        refresh_token:{token:String}
    },
    { timestamps: true }
);

export default mongoose.models.officers ||
    mongoose.model("officers", OfficerSchema);