const mongoose = require("mongoose")
const Schema = mongoose.Schema


const Truck = new Schema({
    Capacity: {type: Number, default: 90},
    Size: {type: Number, default: 100},
    TypeOfFuel: {type: String},
    VehicleStatus: {
        type: String,
        enum: ["Active","UnderMaintainance","NotActive"],
        default: "Active"
    },
    Warranty: {type: Schema.Types.ObjectId, ref: "WarrantyService"},
    Journey: {type: Schema.Types.ObjectId, ref: "Journey", default: null},
});

module.exports = mongoose.model("Truck", Truck);