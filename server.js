const http = require("http");
const headers = require("./headers");
const handleError = require("./handleError");
const handleSuccess = require("./handleSuccess");
// mongoose
require("./connections/posts");
const Post = require("./models/postsModel");
// create server
const server = http.createServer(async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  if (req.url === "/posts" && req.method === "GET") {
    const posts = await Post.find();
    handleSuccess(res, posts);
  } else if (req.url === "/posts" && req.method === "POST") {
    req.on("end", async () => {
      try {
        let data = JSON.parse(body);
        const post = await Post.create(data);
        handleSuccess(res, post);
      } catch (error) {
        handleError(res, error);
      }
    });
  } else if (req.url === "/posts" && req.method === "DELETE") {
    const posts = await Post.deleteMany({});
    handleSuccess(res, posts);
  } else if (req.url.startsWith("/posts/") && req.method === "DELETE") {
    let id = req.url.split("/").pop();
    const posts = await Post.findByIdAndDelete(id);
    handleSuccess(res, posts);
  } else if (req.url.startsWith("/posts/") && req.method === "PATCH") {
    req.on("end", async () => {
      try {
        let data = JSON.parse(body);
        let id = req.url.split("/").pop();
        const post = await Post.findByIdAndUpdate(id, data);
        handleSuccess(res, post);
      } catch (error) {
        handleError(res, error);
      }
    });
  } else if (req.method === "OPTIONS") {
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: false,
        message: "not found page",
      })
    );
    res.end();
  }
});
let port = process.env.POST || 3000;
server.listen(port);
