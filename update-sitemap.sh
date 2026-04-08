#!/bin/bash
cd /var/www/game_nwes_site/public


curl -s https://barracudagame.ru/api/articles/sitemap | jq -r '.[].slug' > slugs.txt


if [ ! -s slugs.txt ]; then
  echo "❌ Ошибка: не удалось получить список статей"
  exit 1
fi

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


while read slug; do
  echo "  <url><loc>https://barracudagame.ru/news/$slug</loc></url>" >> sitemap.xml
done < slugs.txt


echo '</urlset>' >> sitemap.xml

echo "✅ Sitemap обновлён: $(grep -c 'news/' sitemap.xml) статей"


echo "🔄 Генерация RSS для Яндекс.Новостей..."
node /var/www/game_nwes_site/generate-yandex-news.mjs


echo "🔄 Генерация News Sitemap для Google..."
node /var/www/game_nwes_site/generate-news-sitemap.mjs

echo "✅ Все карты обновлены"
