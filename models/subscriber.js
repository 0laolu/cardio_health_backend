import mongoose, { Schema } from "mongoose"

const subscriberSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })

const Subscriber = mongoose.model("Subscriber", subscriberSchema)

export default Subscriber