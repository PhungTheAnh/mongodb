import { Schema, model, models } from "mongoose";

const newSchema = new Schema({
  title: String,
  title_en: String,
  img: String,
  slug: String,
  desc: String,
  keyword: String,
  content: String,
  cate_id: String,
});

const News = models.news || model("news", newSchema);

export default News;
