import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const RegistrantSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        NIN: { type: String, required: true },
        TIN: { type: String },
        employment_status: { type: String, enum: ["employed", "unemployed", "self-employed", "student", "business"] },
        employer_CAC_number: { type: String },
        employer_name: { type: String },
        employer_contact:{
            phone:{type:String},
            email:{type:String},
        },
        phone: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        residential_address: {
            house_number: { type: String },
            street: { type: String, required: true },
            postal_code: { type: String },
            landmark: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true }
        },
        avatar: { type: String },
        vehicles: [{ type: ObjectId, ref: 'vehicles' }]
    },
    { timestamps: true }
);

export default mongoose.models.registrants ||
    mongoose.model("registrants", RegistrantSchema);