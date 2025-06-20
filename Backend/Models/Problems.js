const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Easy",
    },
    testcases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true },
        }
    ]
    ,
    createdAt: {
        type: Date,
        default: Date.now,
    },

});
const Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;