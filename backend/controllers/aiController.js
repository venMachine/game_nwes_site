const OpenAI = require('openai');
const Parser = require('rss-parser');
const parser = new Parser();


// const categoryKeywords = {
//   esports: [
//     // русские
//     'киберспорт', 'esports', 'турнир', 'чемпионат', 'соревнование', 'матч', 'финал',
//     'Dota 2', 'The International', 'CS2', 'Counter-Strike 2', 'Major', 'IEM', 'ESL', 'BLAST',
//     'Valorant', 'VCT', 'League of Legends', 'Worlds', 'Rocket League', 'RLCS',
//     'Rainbow Six Siege', 'Six Invitational', 'Starcraft II', 'GSL', 'PUBG', 'PGC',
//     'Fortnite', 'FNCS', 'Apex Legends', 'ALGS', 'команда', 'игрок', 'победа', 'поражение',
//     'призовой фонд', 'стрим', 'трансляция', 'киберспортивный клуб',
//     // английские
//     'tournament', 'championship', 'match', 'final', 'team', 'player', 'win', 'loss', 'prize pool',
//     'stream', 'broadcast', 'esports club', 'esports organization', 'qualifier', 'playoffs',
//     'grand finals', 'group stage', 'knockout', 'round robin', 'bracket', 'LAN', 'online',
//     'roster', 'transfer', 'signing', 'contract', 'coach', 'analyst', 'bootcamp', 'scrim'
//   ],
//   consoles: [
//     // русские
//     'игровая консоль', 'PlayStation', 'PS5', 'Xbox', 'Xbox Series X', 'Nintendo Switch',
//     'Steam Deck', 'приставка', 'эксклюзив', 'консольные игры', 'геймпад', 'контроллер',
//     'подписка', 'Game Pass', 'PlayStation Plus', 'Nintendo Online', 'обновление прошивки',
//     'скидки на игры', 'анонс консоли', 'ремастер', 'ремейк', 'порт на консоль',
//     // английские
//     'console', 'exclusive', 'gamepad', 'controller', 'subscription', 'firmware update',
//     'console games', 'remaster', 'remake', 'port', 'handheld', 'hybrid console',
//     'backward compatibility', 'cloud gaming', 'streaming', 'digital edition', 'disc edition',
//     'limited edition', 'bundle', 'hardware', 'specs', 'performance', 'graphics', 'frame rate',
//     '4K', 'HDR', 'ray tracing', 'SSD', 'loading times'
//   ],
//   ratings: [
//     // русские
//     'рейтинг', 'топ', 'лучшие игры', 'игровой рейтинг', 'оценки', 'обзор', 'сравнение',
//     'жанры', 'игровые награды', 'премия', 'Game of the Year', 'лучшая графика',
//     'лучший саундтрек', 'ожидаемые игры', 'самые продаваемые', 'чарты', 'Steam Charts',
//     'Metacritic', 'OpenCritic', 'пользовательский рейтинг', 'критики', 'иммерсивность',
//     'сюжет', 'геймплей', 'инновации',
//     // английские
//     'rating', 'top', 'best games', 'game ranking', 'review', 'score', 'comparison',
//     'award', 'GOTY', 'best graphics', 'best soundtrack', 'most anticipated',
//     'best-selling', 'charts', 'user score', 'critic score', 'immersive', 'story', 'gameplay',
//     'innovation', 'highly recommended', 'must-play', 'underrated', 'overrated',
//     'masterpiece', 'flop', 'success', 'sales', 'units sold', 'revenue', 'profit'
//   ],
//   'vr-ar': [
//     // русские
//     'VR', 'AR', 'виртуальная реальность', 'дополненная реальность', 'Meta Quest',
//     'PlayStation VR', 'HTC Vive', 'Valve Index', 'Pico', 'VR-игры', 'AR-игры',
//     'смешанная реальность', 'шлем виртуальной реальности', 'очки дополненной реальности',
//     'VR-приложение', 'VR-шлем', 'иммерсивность', 'VR-гейминг', 'VR-фитнес',
//     'AR-технологии', 'пространственное взаимодействие',
//     // английские
//     'virtual reality', 'augmented reality', 'mixed reality', 'headset', 'glasses',
//     'VR gaming', 'AR gaming', 'immersive', 'VR fitness', 'VR experience', 'AR experience',
//     'spatial computing', 'hand tracking', 'eye tracking', '6DOF', 'room scale',
//     'standalone VR', 'PC VR', 'wireless', 'field of view', 'refresh rate', 'resolution',
//     'passthrough', 'VR arcade', 'VR development', 'AR development', 'hololens', 'magic leap'
//   ],
//   indie: [
//     // русские
//     'инди', 'инди-игры', 'независимые разработчики', 'инди-студия', 'пиксельная графика',
//     'ретро-стиль', 'авторские игры', 'хоррор', 'рогалик', 'метроидвания', 'платформер',
//     'симулятор', 'визуальная новелла', 'краудфандинг', 'Kickstarter', 'Steam Greenlight',
//     'фестиваль инди-игр', 'IGF', 'инди-хит', 'малобюджетные игры', 'креативность',
//     'экспериментальный геймплей',
//     // английские
//     'indie', 'indie games', 'independent developer', 'indie studio', 'pixel art',
//     'retro style', 'author games', 'horror', 'roguelike', 'metroidvania', 'platformer',
//     'simulator', 'visual novel', 'crowdfunding', 'Kickstarter', 'Steam Greenlight',
//     'indie game festival', 'IGF', 'indie hit', 'low budget', 'creativity', 'experimental',
//     'game jam', 'itch.io', 'early access', 'solo developer', 'small team', 'fundraiser'
//   ],
//   'pc-games': [
//     // русские
//     'ПК', 'компьютерные игры', 'Steam', 'Epic Games Store', 'GOG', 'ПК-гейминг',
//     'сборка ПК', 'видеокарта', 'игровой компьютер', 'оптимизация', 'системные требования',
//     'моды', 'модификации', 'патч', 'обновление', 'DLC', 'дополнение', 'PC Gaming Show',
//     'игровой движок', 'графика', 'настройки', 'производительность', 'драйверы', 'DirectX',
//     'Vulkan', 'апгрейд', 'цифровая дистрибуция', 'ранний доступ', 'альфа-тест',
//     'бета-тест', 'гейминг на ПК',
//     // английские
//     'PC', 'computer games', 'Steam', 'Epic Games Store', 'GOG', 'PC gaming',
//     'PC build', 'graphics card', 'gaming PC', 'optimization', 'system requirements',
//     'mods', 'modifications', 'patch', 'update', 'DLC', 'expansion', 'PC Gaming Show',
//     'game engine', 'graphics', 'settings', 'performance', 'drivers', 'DirectX',
//     'Vulkan', 'upgrade', 'digital distribution', 'early access', 'alpha test',
//     'beta test', 'PC exclusive', 'Windows', 'Linux', 'Mac', 'cross-platform',
//     'anti-cheat', 'DRM', 'launcher', 'storefront', 'sale', 'discount', 'bundle'
//   ]
// };
// --- RSS-ленты, разделённые по категориям ---
const categoryFeeds = {
  esports: [
    'https://www.goha.ru/rss/mmorpg',
    'https://www.esports.net/feed/',
    'https://www.esportsbets.com/feed/',
    'https://esportsbetting.gg/feed',
    'https://www.goha.ru/rss/:%D0%9A%D0%B8%D0%B1%D0%B5%D1%80%D1%81%D0%BF%D0%BE%D1%80%D1%82',
    'https://www.gamespot.com/feeds/mashup',
     
    
  ],
  consoles: [
    'https://feeds.feedburner.com/IGNPS4Articles',
    'https://feeds.feedburner.com/IGNPS4Reviews',
     'https://feeds.feedburner.com/ign-nintendo-switch-articles',
    'https://shazoo.ru/feed/rss',   
    'https://www.gamespot.com/feeds/news/?tags=ps5,xbox,switch',
      'https://www.goha.ru/rss/:Sony',
      'https://www.goha.ru/rss/:NVIDIA',
      'https://www.ixbt.com/export/sec_video.rss',
      ' https://www.ixbt.com/export/sec_cpu.rss',
      'https://www.gamespot.com/feeds/mashup',
        'https://feeds.feedburner.com/ign/games-all',
        'https://www.rockpapershotgun.com/feed',
        'https://gameinformer.com/rss.xml',
        'https://www.theverge.com/rss/games/index.xml',
        'https://feeds.feedburner.com/ign/news',
          
  ],
  ratings: [
    
    'https://www.gamespot.com/feeds/news/',
         'https://www.ferra.ru/exports/rss.xml',
         'https://www.gamespot.com/feeds/mashup',
           'https://feeds.feedburner.com/ign/games-all',
           'https://www.rockpapershotgun.com/feed',
        'https://gameinformer.com/rss.xml'
        

  ],
  'vr-ar': [
    'https://www.roadtovr.com/feed',
    'https://www.ixbt.com/export/sec_video.rss',
    'https://www.gamespot.com/feeds/mashup',
        'https://gameinformer.com/rss.xml'

   
  ],
  indie: [
    'https://www.indiegames.com/feed',
    'https://www.rockpapershotgun.com/feed',
    'https://www.gamespot.com/feeds/mashup',
      'https://feeds.feedburner.com/ign/games-all',
      'https://www.gamespot.com/feeds/news',
        'https://gameinformer.com/rss.xml'

   
   
  ],
  'pc-games': [
      'https://www.pcgamer.com/rss/',
    'https://www.gamespot.com/feeds/game-news',
      'https://feeds.feedburner.com/ign/games-all',
    'https://www.goha.ru/rss/mobile-games',
    'https://shazoo.ru/feed/rss',
    'https://www.ferra.ru/exports/rss.xml',
    'https://www.ixbt.com/export/sec_video.rss',
    'https://www.ixbt.com/export/sec_cpu.rss',
    'https://www.ixbt.com/export/utf8/news.rss',
    'https://www.gamespot.com/feeds/mashup',
    'https://3dnews.ru/games/rss/',
    'https://www.gamespot.com/feeds/news',
           'https://www.eurogamer.net/feed/news',
        'https://gameinformer.com/rss.xml',
        'https://www.theverge.com/rss/games/index.xml',
     
        'https://feeds.feedburner.com/ign/news'


  ]
};

// Функция получения новостей из RSS с фильтрацией по категории
async function fetchRealNewsFromRSS(category) {
  try {
    //const keywords = categoryKeywords[category] || [];
    const feeds = categoryFeeds[category] || categoryFeeds['pc-games']; // fallback
    let allArticles = [];

    for (const feedUrl of feeds) {
      try {
        const feed = await parser.parseURL(feedUrl);
         let articles = feed.items
      //  let articles = feed.items.slice(0, 50); // берём больше для фильтрации
      //  console.log()
        // if (keywords.length) {
        //   articles = articles.filter(item => {
        //     const text = (item.title + ' ' + (item.contentSnippet || item.summary || '')).toLowerCase();
        //     return keywords.some(kw => text.includes(kw.toLowerCase()));
        //   });
        // }
        // articles = articles.slice(0, 20).map(item => ({
        //   title: item.title,
        //   link: item.link,
        //   contentSnippet: item.contentSnippet || item.summary || '',
        //   pubDate: item.pubDate
        // }));
        allArticles = allArticles.concat(articles);
      } catch (err) {
        console.error(`Ошибка парсинга RSS ${feedUrl}:`, err.message);
      }
    }

    if (allArticles.length === 0) return null;

    // Сортируем по дате и берём 5 самых свежих
    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    const latest = allArticles.slice(0, 50);

    // Формируем текстовый контекст
    const context = latest.map((item, idx) => {
      let domain = '';
      try {
        domain = new URL(item.link).hostname;
      } catch (e) { domain = 'источник'; }
      return `[${idx+1}] ${item.title}\nИсточник: ${domain}\nСсылка: ${item.link}\nКратко: ${item.contentSnippet.substring(0, 200)}`;
    }).join('\n\n');
    return context;
  } catch (error) {
    console.error('Ошибка получения RSS-новостей:', error.message);
    return null;
  }
  if (latest.length < 2) return null;
}

// --- Стили авторов (без изменений) ---
const authorStyles = {
  1: {
    name: 'Дмитрий Red Vision',
    desc: `Вы должны писать в характерном публицистическом стиле журналиста газеты «Завтра» Александра Проханова. 
    Особенности стиля:
    - Торжественный, возвышенный, почти библейский слог.
    - Длинные, сложные предложения с множеством причастных и деепричастных оборотов.
    - Метафоричность: образы космоса, бездны, океана, стихии, судьбы, жертвы, пророчества.
    - Использование слов: "суверенитет", "традиция", "духовность", "цивилизация", "судьба", "жертва", "пророчество", "бездна", "океан", "мироздание", "рок", "пассионарность".
    - Тон — философский, трагический, с ощущением величия происходящего.
    - Избегайте прямого воспевания «Русского Духа», но сохраняйте общую пафосность и метафоричность.`
  },
  2: {
    name: 'Эдвард Fox',
    desc: `Стиль Эдварда Радзинского: историческая драма, театральность. 
    - Текст должен быть похож на монолог или диалог, обращённый к читателю.
    - Используйте риторические вопросы, восклицания.
    - Элементы мистики, загадочности.
    - Фразы-маркеры: "Представьте себе...", "И вот тогда...", "Как в старом театре...", "Занавес поднимается...".`
  },
  3: {
    name: 'Дмитрий Ounth',
    desc: `Стиль Дмитрия Быкова: интеллектуальный, ироничный, эссеистичный.
    - Литературные аллюзии, цитаты, отсылки к классике.
    - Парадоксы, игра слов.
    - Разговор с читателем на равных, иногда с самоиронией.
    - Текст может быть похож на лекцию или заметку умного человека.`
  },
  4: {
    name: 'Ксения Danch',
    desc: `Стиль Ксении Собчак: светский, провокационный, ироничный.
    - Близкий к разговорному, использование сленга.
    - Элементы скандальности, цинизма.
    - Самоирония, игра на публику.
    - Короткие предложения, динамичный темп.`
  },
  5: {
    name: 'Алексей MustDie',
    desc: `Стиль Алексея Венедиктова: аналитический, фактологичный.
    - Множество деталей, цифр, ссылок на источники.
    - Быстрый темп, короткие рубленые фразы.
    - Диалогичность, иногда резкость.
    - Использование вводных слов: "кстати", "впрочем", "на самом деле".`
  }
};

// --- Экспортируемая функция генерации ---
exports.generateNews = async (req, res) => {
  try {
    const { authorId, category } = req.body;
    if (!authorId || !category) {
      return res.status(400).json({ error: 'Не выбраны автор и категория' });
    }

    const author = authorStyles[authorId];
    if (!author) {
      return res.status(400).json({ error: 'Автор не найден' });
    }

    // 1. Получаем реальные новости из RSS (с учётом категории)
    let realNewsContext = await fetchRealNewsFromRSS(category);
    console.log('RSS контекст получен:', realNewsContext ? 'да' : 'нет');

    // 2. Если нет контекста – сразу возвращаем ошибку
    if (!realNewsContext) {
      return res.status(400).json({ error: 'Не найдено актуальных новостей по этой категории. Попробуйте другую категорию или повторите позже.' });
    }

    // 3. Динамический диапазон дат
    const now = new Date();
    const currentMonth = now.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    const previousMonth = oneMonthAgo.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

    // 4. Формируем промпт
    let prompt = `Требуется сгенерировать JSON-объект, представляющий **реальную, свежую новость** из мира компьютерных игр по тематике "${category}". 

**АВТОР:** Новость должна быть написана от лица журналиста **${author.name}**. В тексте можно использовать местоимение "я" или упоминать своё имя, если это уместно для стиля.

**СТИЛЬ:** ${author.desc}

**АКТУАЛЬНОСТЬ И ДАТИРОВКА:**
- Новость должна описывать **УЖЕ ПРОИЗОШЕДШЕЕ** событие, которое случилось в период **с ${previousMonth} по ${currentMonth}** (последние 30 дней).
- Дата события (например, в тексте новости или в подразумеваемом контексте) **обязательно должна попадать в этот диапазон**.
- Если точная дата неизвестна, укажи примерный период: "в начале марта 2026", "в середине февраля 2026" и т.п.

**РЕАЛЬНЫЕ НОВОСТИ ДЛЯ ОСНОВЫ (используй их факты, не выдумывай!):**
${realNewsContext}

**ВАЖНО:** Используй ТОЛЬКО те новости и ссылки, которые перечислены выше. Если в контексте есть ссылка, ты можешь её использовать. Если ссылки нет — не придумывай. Не добавляй новые ссылки от себя. Не используй события, если в контексте нет их описания.

**КРИТИЧЕСКИ ВАЖНО:**
- **НЕ ВЫДУМЫВАЙ НЕСУЩЕСТВУЮЩИЕ ИГРЫ, ДОПОЛНЕНИЯ, СТУДИИ, РАЗРАБОТЧИКОВ, ДАТЫ.**
- Используй только **реальные, хорошо известные проекты**.
- Если ты используешь реальные новости из контекста, **сохраняй все факты (названия, даты, цифры)**, но можешь переписать в заданном стиле.
- **Для Google Новостей критична достоверность фактов.** Если у тебя нет возможности написать достоверную новость на основе предоставленного контекста (или контекст отсутствует), верни JSON с полем "error": "недостаточно данных для достоверной новости". В таком случае не заполняй поля title, content и т.д.
- **Самопроверка:** Перед формированием ответа проверь, можешь ли ты подтвердить все ключевые факты (названия, даты, цифры, имена) из предоставленного выше контекста. Если какой-то факт отсутствует в контексте и ты не можешь его проверить по общеизвестным достоверным источникам, или если в контексте нет ссылок, подтверждающих событие, — не выдумывай. Вместо этого верни JSON с полем "error": "недостаточно данных для достоверной новости". Не заполняй поля title, content и т.д.
- **ЖЁСТКИЙ ЗАПРЕТ:** Если в предоставленном контексте нет новости, идеально подходящей под выбранную категорию (например, для киберспорта — конкретного турнира, команд, счёта), не выдумывай её. Немедленно верни JSON с полем "error": "нет подходящих новостей в категории".
- **Запрещено использовать:** выдуманные названия команд, игроков, турниров, дат, призовых фондов, если они не указаны в контексте.
**ТРЕБОВАНИЯ К ФОРМАТУ ДЛЯ GOOGLE НОВОСТЕЙ:**
- **Ссылки на источники:** обязательно включи гиперссылки (в формате HTML-тега <a href="URL">название источника</a>) на предоставленные в контексте реальные источники. Если ссылка есть в контексте, используй её.
- **Статус события:** укажи, является ли информация официальной, подтверждённой, слухом, анонсом, или это аналитика. Используй уточнения: "по официальным данным", "по информации разработчиков", "как сообщает инсайдер", "предположительно", "по слухам", "анонсировано", "опубликовано" и т.п.
- **Структура новости:** 
  1. Заголовок (чётко отражает суть).
  2. Лид (1–2 предложения с самой важной новостью).
  3. Основная часть (2–4 абзаца с деталями, цитатами, контекстом).
  4. Ссылки на источники (в виде гиперссылок, вставленных в текст или отдельным блоком).
  5. Дата события (если есть, указать).
- **Тон:** новость должна быть написана в выбранном стиле автора, но с сохранением фактологической точности.

**ТРЕБОВАНИЯ К КОНКРЕТИКЕ:**
- Обязательно укажи конкретное название игры (реальной).
- Для киберспорта: название турнира, место проведения, призовой фонд, названия команд, имена игроков, счёт.
- Добавь цифры, даты, конкретные факты. Избегай общих фраз.

**ФОРМАТ JSON:**
{
  "title": "Заголовок (должен быть ярким, в заданном стиле)",
  "excerpt": "Краткое описание (1-2 предложения, суть)",
  "content": "Полный текст новости (не менее 2 абзацев, общий объём текста – минимум 2000 знаков с пробелами. Каждый абзац должен содержать конкретные детали, имена, цифры и быть написан строго в заданном стиле. Обязательно включи гиперссылки на источники в формате <a href='URL'>название источника</a>.)",
  "tags": ["тег1", "тег2", "название игры", "жанр"],
  "image": "https://images.unsplash.com/..." (или пустая строка)
}

Верни только JSON, без каких-либо пояснений, рассуждений или дополнительного текста. Не используй markdown.`;

    // 5. Вызов AI
    const client = new OpenAI({
      apiKey: process.env.AITUNNEL_API_KEY,
      baseURL: 'https://api.aitunnel.ru/v1/'
    });

    const response = await client.chat.completions.create({
      model: 'gpt-5.4-nano',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 3000
    });
    
    const content = response.choices[0].message.content;
    console.log(content)
    if (!content) {
      return res.status(500).json({ error: 'AI вернул пустой ответ' });
    }

    // Извлекаем JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Не удалось найти JSON в ответе:', content);
      return res.status(500).json({ error: 'Ответ AI не содержит JSON' });
    }

    let cleaned = jsonMatch[0];
    cleaned = cleaned.replace(/^```json\s*|```\s*$/g, '').trim();

    let newsData;
    try {
      newsData = JSON.parse(cleaned);
    } catch (e) {
      console.error('Ошибка парсинга JSON от AI:', cleaned);
      return res.status(500).json({ error: 'Не удалось распарсить ответ AI' });
    }

    // Проверка на наличие ошибки (недостоверная новость)
    if (newsData.error) {
      return res.status(400).json({ error: newsData.error });
    }

    res.json(newsData);
  } catch (error) {
    console.error('Ошибка генерации новости:', error);
    res.status(500).json({ error: 'Ошибка при обращении к AI' });
  }
};