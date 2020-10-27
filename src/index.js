const cheerio = require("cheerio");
const axios = require("axios").default;
const fs = require("fs");

const parse = async () => {
  const getHTML = async (url) => {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  };

  const links = [
    "vkhodnye_dveri_argus/",
    "vkhodnye_dveri_s_termorazryvom/",
    "vkhodnye_dveri_s_shumoizolyatsiey/",
  ];

  const data = {}
  const address = 'https://vashidveri72.ru'
  for (let i of links) {
    const selector = await getHTML(
     `https://vashidveri72.ru/catalog/dveri_vkhodnye/${i}`
    );
    selector('.one_section_product_cells').each((i, element) => {
      const title = selector(element).find('div.name_product>a').text();
      const price = selector(element).find('div.new_price').text();
      const linkItem = `${address}${selector(element).find('div.name_product>a').attr('href')}`
      const url =  `${address}${selector(element).find('a.image_product').attr('style').replace(/background-image:url\('/gi, '').replace(/'/g, '')}`
      data[`${title}`] = {price, linkItem, url}
      
    })
  }

  let result = JSON.stringify(data, null, 2);
  fs.writeFile("data.json", result, function(error){
 
    if(error) throw error; // если возникла ошибка
    console.log("Запись файла завершена. Содержимое файла:");
    let dataWrite = fs.readFileSync("data.json", "utf8");
    console.log(dataWrite);  // выводим считанные данные
});

};

parse();
