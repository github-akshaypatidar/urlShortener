const express = require("express");
const dotenv = require("dotenv");
const ShortUrl = require("./Models/shortUrl");

dotenv.config();

const PORT = process.env.PORT;
const url = process.env.MONGODB_URL;

const app = express();
const mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(url)
//   , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  if(req.body.alias){
  const alias=await ShortUrl.findOne({short: req.body.alias});
  if(alias){
     res.render('pagenotfound');
  }
  else{
  await ShortUrl.create({ full: req.body.fullUrl, short: req.body.alias });
  res.redirect("/");
  }
}
else{
await ShortUrl.create({ full: req.body.fullUrl});
res.redirect("/");
}
});
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });

  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
