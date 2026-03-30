#!/bin/bash
cd /var/www/game_nwes_site/public

# Получаем список slug статей
curl -s https://barracudagame.ru/api/articles | jq -r '.[].slug' > slugs.txt

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
  echo "  <url><loc>https://barracudagame.ru/news/$slug</loc></url>" >> sitemap.xml
done < slugs.txt

# Закрываем тег
echo '</urlset>' >> sitemap.xml

echo "✅ Sitemap обновлён: $(grep -c 'news/' sitemap.xml) статей"
