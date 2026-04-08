#!/bin/bash
cd /var/www/game_nwes_site/public

# Получаем список slug статей
curl -s https://barracudagame.ru/api/articles/sitemap | jq -r '.[].slug' > slugs.txt

# Создаём sitemap с нуля
cat > sitemap.xml << 'XML'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://barracudagame.ru/</loc></url>
  <url><loc>https://barracudagame.ru/news</loc></url>
  <url><loc>https://barracudagame.ru/games</loc></url>
  <url><loc>https://barracudagame.ru/esports</loc></url>
  <url><loc>https://barracudagame.ru/about</loc></url>
  <url><loc>https://barracudagame.ru/contacts</loc></url>
  <url><loc>https://barracudagame.ru/advertising</loc></url>
  <url><loc>https://barracudagame.ru/search</loc></url>
XML

# Добавляем статьи
while read slug; do
  echo "  <url><loc>https://barracudagame.ru/news/$slug</loc></url>" >> sitemap>
done < slugs.txt

# Закрываем тег
echo '</urlset>' >> sitemap.xml

echo "✅ Sitemap обновлён: $(grep -c 'news/' sitemap.xml) статей"
# Генерация RSS для Яндекс.Новостей
echo "🔄 Генерация RSS для Яндекс.Новостей..."
node /var/www/game_nwes_site/generate-yandex-news.mjs

# Генерация News Sitemap для Google
echo "🔄 Генерация News Sitemap для Google..."
node /var/www/game_nwes_site/generate-news-sitemap.mjs

echo "✅ Все карты обновлены"


