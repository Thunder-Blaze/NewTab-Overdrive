import mongoose from 'mongoose'

const backupSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        data: {
            type: Object,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
)

const Backup = mongoose.models?.Backup || mongoose.model('Backup', backupSchema)

export { Backup } 