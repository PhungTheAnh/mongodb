const mongo = require("./connect");
const postSchema = require("../Schema/postSchema");

const connectToMongoDB = async () => {
  await mongo().then(async (mongoose) => {
    try {
      console.log("Connected to MongoDB!");

      const post = {
        title: "a",
        description: "abcdef",
        href: "abc.com",
      };

      await new postSchema(post).save();
    } finally {
      mongoose.connection.close();
    }
  });
};
