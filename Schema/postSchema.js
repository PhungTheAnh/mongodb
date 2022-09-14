import { Schema, model, models } from "mongoose";

const newSchema = new Schema({
  title: String,
  slug: String,
  desc: String,
  content: String,
  img: String,
  cate_id: String,
});

const News = models.news || model("news", newSchema);

export default News;
