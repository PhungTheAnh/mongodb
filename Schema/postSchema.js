const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    href: String,
    // image:
});

module.exports = mongoose.model("postSchema", csvSchema);
