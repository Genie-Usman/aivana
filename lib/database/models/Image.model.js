import { Schema, model, models } from "mongoose";

const ImageSchema = new Schema({
    title: { type: String, required: true },
    transformationType: { type: String, required: true },
    transformationURL: { type: URL },
    publicID: { type: String, required: true },
    secureURL: { type: URL, required: true },
    height: { type: Number },
    width: { type: Number },
    aspectRatio: { type: String },
    config: { type: Object },
    color: { type: String },
    prompt: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const Image = models?.Image || model('Image', ImageSchema)

export default Image;