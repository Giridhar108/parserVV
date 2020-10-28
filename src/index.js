const cheerio = require("cheerio");
const axios = require("axios").default;
const fs = require("fs");

const parse = async () => {
  const getHTML = async (url) => {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  };

  const selector = await getHTML(
    `https://vashidveri72.ru/catalog/dveri_vkhodnye/`
  );

  const bigData = {}
  const data = {};
  let links = [].reverse();

  selector(".bx_children_container").each((i, element) => {
    for (let r = 3; r !== -1; r -= 1) {
      const lin = selector(element)
        .find(".bx_children_block>ul>li.parent>a")
        .eq(r)
        .attr("href");
      if (lin.includes("dveri_vkhodnye")) {
        links.push(lin);
      }
    }
  });

  const address = "https://vashidveri72.ru";
  for (let item of links) {
    const selector = await getHTML(
      `https://vashidveri72.ru${item}`
    );
    bigData[`${item}`] = {}
    selector(".one_section_product_cells").each((i, element) => {
      const title = selector(element).find("div.name_product>a").text();
      const price = selector(element).find("div.new_price").text();
      const linkItem = `${address}${selector(element)
        .find("div.name_product>a")
        .attr("href")}`;
      const url = `${address}${selector(element)
        .find("a.image_product")
        .attr("style")
        .replace(/background-image:url\('/gi, "")
        .replace(/'/g, "")}`;

        data[`${title}`] = { price, linkItem, url }
        bigData[`${item}`] = data    
      });
    }

  let result = JSON.stringify(bigData, null, 2);
  fs.writeFile("data.json", result, function (error) {
    if (error) throw error; // если возникла ошибка
    console.log("Запись файла завершена. Содержимое файла:");
    let dataWrite = fs.readFileSync("data.json", "utf8");
    console.log(dataWrite);  // выводим считанные данные 
  });
};

parse();
