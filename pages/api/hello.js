import request from "request-promise";
import News from "../../Schema/postSchema";
import connectMongo from "../../ConnectMongo/connect";
import mongoose from "mongoose";
var cloudinary = require("cloudinary").v2;
const translate = require("translate-google");
require("dotenv").config();
const cheerio = require("cheerio");
let p = 1;
export default function handler(req, res) {
  const page = p === 1 ? "" : `/?p=${p}`;

  const API1 = {
    url: "https://khoahoc.tv" + page,
  };
  // for (let p = 2; p <= 5; p++) {
  //   const API1 = {
  //     url: `https://khoahoc.tv//?p=${p}`,
  //   };
  // }

  connectMongo();
  async function getInforPost(error, response, html) {
    if (!response) {
      res.status(404).json({ error: "ERROR!" });
    } else {
      const $ = cheerio.load(html);
      let arr_title = [];
      let arr_title_en = [];
      const titles = $(html).find("a.title");
      const descriptions = $(html).find("div.desc");
      const list_src = $(html).find("img.lazy");
      const arr_slug = [];
      let lp = [];
      // call title and href
      let news;
      titles.each(async (index, e) => {
        const title_post = $(e).text();
        arr_title.push(title_post);
        
        // console.log(title_post);
        const urlPost = e["attribs"]["href"];
        arr_slug.push(urlPost);
        console.log(title_post);
        // translate title
        // const abc = title_post;
        // translate(abc, { to: "en" })
        //   .then((res) => {
        //     // console.log(res);
        //     arr_title_en.push(res);
        //     console.log(arr_title_en);
        //   })
        //   .catch((err) => {
        //     console.error(err);
        //   });
      });
      // 
      

      // call src img
      let arr_img = [];

      list_src.each(async (index, e) => {
        const src = e["attribs"]["data-src"];
        // const { url } = await cloudinary.uploader.upload(src, {
        //   folder: "News",
        //   resource_type: "image",
        // });
        arr_img.push(src);
      });
      // call desc
      let arr_desc = [];
      descriptions.each(async (index, e) => {
        const description = $(e).text();
        arr_desc.push(description);
      });
      
      // function call Detail_Content
      for (const key in arr_slug) {
        const API2 = {
          url: "https://khoahoc.tv" + arr_slug[key],
        };
        function getDetailPost(error, response, html) {
          if (!response) {
            res.status(404).json({ error: "Error" });
          } else {
            const $1 = cheerio.load(html);
            // call content
            let arr_imgContent = [];
            const listDetailContent = $1(html).find(".content-detail");
            const detailImg = $1(html).find(".content-detail p img");
            listDetailContent.find(".content-detail ul").each(function (i, e) {
              $(this).replaceWith("");
            });

            listDetailContent
              .find(".content-detail .adbox")
              .each(function (i, e) {
                $(this).replaceWith("");
              });

            // call img
            listDetailContent.find("img").each(async (index, e) => {
              const imgContent = e["attribs"]["data-src"];
              const { url } = await cloudinary.uploader.upload(imgContent, {
                folder: "News_Detail",
                resource_type: "image",
              });
              // console.log(url);
              $(e).attr("src", url);
              $(e).attr("data-src", url);
              arr_imgContent.push(imgContent);
            });
            const abc = arr_title[key];
            translate(abc, { to: "en" })
              .then((res) => {
                // arr_title_en.push(res);
                return res;
                // console.log(arr_title_en);
              })
              .then(text => {
                setTimeout(() => {
                  const news = new News({
                    title: arr_title[key],
                    title_en: text,
                    img: arr_img[key],
                    slug: arr_slug[key],
                    desc: arr_desc[key],
                    content: listDetailContent.html(),
                    cate_id: "123",
                  }).save();
                }, 3000);
              })
              .catch((err) => {
                console.error(err);
              });
            
          }
        }
        request.get(API2, getDetailPost);
      }

      if (p <= 1) {
        p++;
        request.get(API1, getInforPost);
      }
      res.status(200).json({ post: 1 });
    }
  }

  request.get(API1, getInforPost);
}
