const Article = require('../models/Article');
const telegramService = require('../services/telegramService');


exports.getAllArticles = async (req, res) => {
  try {
    const { limit = 50, category } = req.query;
    const filter = category && category !== 'all' ? { 'category.slug': category } : {};
    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })  // ← новые сначала
      .limit(parseInt(limit));
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) return res.status(404).json({ error: 'Статья не найдена' });
    
   
    article.views += 1;
    await article.save();
    
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createArticle = async (req, res) => {
  try {
    const articleData = req.body;

    if (articleData.publishToTelegram === undefined) {
      articleData.publishToTelegram = true;
    }

    const article = new Article(articleData);
    await article.save();

  
    if (article.publishToTelegram !== false) {
      
      telegramService.publishNews(article).catch(err => 
        console.error('Ошибка фоновой публикации в Telegram:', err)
      );
    }

    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
      
    if (article.publishToTelegram !== false) {
      
      telegramService.publishNews(article).catch(err => 
        console.error('Ошибка фоновой публикации в Telegram:', err)
      );
    }
    if (!article) return res.status(404).json({ error: 'Статья не найдена' });
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findOneAndDelete({ slug: req.params.slug });
    if (!article) return res.status(404).json({ error: 'Статья не найдена' });
    res.json({ message: 'Статья удалена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchArticles = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]); 
    }

    const articles = await Article.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    }).sort({ publishedAt: -1, createdAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  };