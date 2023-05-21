const { Scrapper } = require('../models');

const returner = (type, req, res) => {
    const page = req.query.page;
    const pageData = {type, page};
    const scrapper = new Scrapper(pageData);
    scrapper.lastPage().then(lastPageNumber => {
        if (page > parseInt(lastPageNumber)){
            res.status(404).json({message: 'page is not found!'})
        }
        Scrapper.scrap(pageData).then(news => {
            res.status(200).json({
                lastPageNumber, news
            });
        })
    }).catch(e => e.message)

}


const getAllNews = (req,res,next) => {
    returner('news/latest',req,res)
}

const getSportNews = (req,res,next) => {
    returner('news/sport',req,res)
}

const getPoliticalNews = (req,res,next) => {
    returner('regional',req,res)
}

const getEconomicNews = (req,res,next) => {
    returner('news/economy',req,res)
}

const getArticle = (req,res,next) => {
    const article = req.params.article;
    Scrapper.scrapArticle(article).then(artic => {
        res.status(200).json(artic);
    })
}

module.exports = {
    getAllNews, getSportNews, getPoliticalNews, getEconomicNews, getArticle
}