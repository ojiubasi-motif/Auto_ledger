import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
    {
        reg_no: { type: String, required: true },
        engine_no: { type: String, required: true },
        chasis_no:{ type: String },
        vehicle_type:{ type: String, required: true },
        manufacturer:{ type: String, required: true },
        brand:{ type: String, required: true },
        model:{ type: String, required: true },
        color:{ type: String, required: true },
        plate_no:{ type: String, required: true },
        registered_by:{ type: ObjectId,ref:'officers', required: true },
        owner:{ type: ObjectId, ref:'registrants', required: true }
    },
    { timestamps: true }
);

export default mongoose.models.vehicles ||
    mongoose.model("vehicles", VehicleSchema);