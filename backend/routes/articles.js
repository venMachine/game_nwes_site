const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', articleController.searchArticles);

router.get('/', articleController.getAllArticles);
router.get('/:slug', articleController.getArticleBySlug);
router.post('/', protect, articleController.createArticle); 
router.put('/:slug', protect, articleController.updateArticle);
router.delete('/:slug', protect, articleController.deleteArticle);

module.exports = router;