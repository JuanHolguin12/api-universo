const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate")

const PropertySchema = mongoose.Schema({
    photos: [String],
    typeOfProperty: String,
    typeOffer: String,
    department: String,
    town: String,
    neighborhood: String,
    antiquity: String,
    kitchen: String,
    location: String,
    price: Number,
    administration: Number,
    bedrooms: Number,
    stratum: String,
    bathrooms: Number,
    floorNum: Number,
    squareMeter: Number,
    description: String,
    elevator: String,
    garage: String,
    active: Boolean,
})


PropertySchema.plugin(mongoosePaginate)
module.exports = mongoose.model("Property", PropertySchema)