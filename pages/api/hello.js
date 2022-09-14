import request from "request-promise";
import News from "../../Schema/postSchema";
import connectMongo from "../../ConnectMongo/connect";
import mongoose from "mongoose";
var cloudinary = require("cloudinary").v2;
require("dotenv").config();
const cheerio = require("cheerio");

export default function handler(req, res) {
  const post = new mongoose.Schema({ title: 'string', description: 'string' });
  const post_detail = mongoose.model('post_detail', post);
  post.insertMany([{ title: "hello" }], function (err) {
    
  });
  const API1 = {
    url: "https://khoahoc.tv/",
  };

  function getInforPost(error, response, html) {
    if (!response) {
      res.status(404).json({ error: "ERROR!" });
    } else {
      async function connect() {
        await connectMongo();
        return 1;
      }
      const $ = cheerio.load(html);
      const titles = $(html).find("a.title");
      const descriptions = $(html).find("div.desc");
      const list_src = $(html).find("img.lazy");
      const arr = [];
      // call title and href
      titles.each((index, e) => {
        const title = $(e).text();
        const urlPost = e["attribs"]["href"];
        arr.push(urlPost);
      });
      // call src
      list_src.each(async (index, e) => {
        const src = e["attribs"]["data-src"];
        // const { url } = await cloudinary.uploader.upload(src, {
        //   folder: "News",
        //   resource_type: "image",
        // });
      });
      // call desc
      descriptions.each((index, e) => {
        const description = $(e).text();
      });
      // function call Detail_Content
      for (const child_url of arr) {
        const API2 = {
          url: "https://khoahoc.tv" + child_url,
        };
        function getDetailPost(error, response, html) {
          if (!response) {
            res.status(404).json({ error: "Error" });
          } else {
            const $ = cheerio.load(html);
            // call content
            const detailContent = $(html).find(".content-detail p");
            const detailImg = $(html).find(".content-detail p img");
            detailContent.each((index, e) => {
              const contentDetail = $(e).text();

            });
            // call img
            detailImg.each(async (index, e) => {
              const imgDetail = e["attribs"]["data-src"];
              // const { url } = await cloudinary.uploader.upload(src, {
              //   folder: "News",
              //   resource_type: "image",
              // });
            });
          }
        }
        request.get(API2, getDetailPost);
      }
      res.status(200).json({ post: 1 });
    }
  }

  request.get(API1, getInforPost);
}
