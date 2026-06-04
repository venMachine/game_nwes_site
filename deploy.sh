#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /var/www/game_nwes_site

export API_BASE_URL=https://barracudagame.ru/api
export PATH=/usr/bin:/bin:/usr/local/bin:$PATH

npm run build
pm2 restart game-frontend

  

# Копируем статические файлы в .output/public (чтобы Nginx отдавал напрямую)
cp -f /var/www/game_nwes_site/public/*.xml /var/www/game_nwes_site/.output/public/ 2>/dev/null || true
cp -f /var/www/game_nwes_site/public/*.txt /var/www/game_nwes_site/.output/public/ 2>/dev/null || true
cp -f /var/www/game_nwes_site/public/*.png /var/www/game_nwes_site/.output/public/ 2>/dev/null || true

# IndexNow уведомление (используем существующий ключ)
KEY="e52b3db3e88103cc3d313e483798559b"
SITE_URL="https://barracudagame.ru"
if command -v jq &> /dev/null && [ -f /var/www/game_nwes_site/public/sitemap.xml ]; then
  URLS=$(grep -oP '(?<=<loc>).*?(?=</loc>)' /var/www/game_nwes_site/public/sitemap.xml | head -10000)
  if [ -n "$URLS" ]; then
    JSON_URLS=$(echo "$URLS" | jq -R . | jq -s .)
    curl -X POST "https://api.indexnow.org/IndexNow" \
      -H "Content-Type: application/json" \
      -d "{\"host\":\"$SITE_URL\",\"key\":\"$KEY\",\"keyLocation\":\"$SITE_URL/$KEY.txt\",\"urlList\":$JSON_URLS}" \
      -s -o /dev/null -w "\n%{http_code}\n"
    echo "✅ IndexNow уведомление отправлено"
  fi
fi

echo "✅ Пересборка выполнена $(date)" >> /var/log/deploy.log
