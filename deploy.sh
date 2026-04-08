#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /var/www/game_nwes_site

export API_BASE_URL=https://barracudagame.ru/api
export PATH=/usr/bin:/bin:/usr/local/bin:$PATH

# Пересборка фронтенда
npm run build
pm2 restart game-news-frontend

echo "✅ Пересборка выполнена $(date)" >> /var/log/deploy.log
