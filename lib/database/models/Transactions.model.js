import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    stripeID: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    plan: { type: String },
    credits: { type: Number },
    buyer: { type: Schema.Types.ObjectId, ref: 'Transaction' },
    firstName: { type: String },
    lastName: { type: String },
    planID: { type: Number, default: 1 },
    creditBalance: { type: Number, default: 10 },
})

const Transaction = models?.Transaction || model('Transaction', TransactionSchema)

export default Transaction;