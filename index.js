//core modules
const fs = require("fs");
const http = require("http");
const url = require("url");
//own modules
const replaceTemplate = require("./modules/replaceTemplate");

//**************************************   SERVER   ***************************************//

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS}", cardsHTML);

    res.end(output);

    //PRODUCT PAGE
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found!</h1>");
  }
});
//server.listen(<port, localhost>);
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
