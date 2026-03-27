const OpenAI = require('openai');
const Parser = require('rss-parser');
const parser = new Parser();


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
    'https://feeds.feedburner.com/ign/news',
    'https://www.pcgamer.com/rss/',
    'https://www.gamespot.com/feeds/game-news',
    'https://feeds.feedburner.com/ign/games-all',
    'https://www.gamespot.com/feeds/mashup',
    'https://www.gamespot.com/feeds/news',
    'https://www.eurogamer.net/feed/news',
    'https://gameinformer.com/rss.xml',
    'https://www.theverge.com/rss/games/index.xml',
  ]
};


async function fetchRealNewsFromRSS(category) {
  try {
    const feeds = categoryFeeds[category] || categoryFeeds['pc-games']; // fallback
    let allArticles = [];

    for (const feedUrl of feeds) {
      try {
        const feed = await parser.parseURL(feedUrl);
        // Берём до 15 статей из каждой ленты
        let articles = feed.items.slice(0, 15);
        allArticles = allArticles.concat(articles);
      } catch (err) {
        console.error(`Ошибка парсинга RSS ${feedUrl}:`, err.message);
      }
    }

    if (allArticles.length === 0) return null;

 
    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    const latest = allArticles.slice(0, 30);

    const context = latest.map((item, idx) => {
      let domain = '';
      try {
        domain = new URL(item.link).hostname;
      } catch (e) { domain = 'источник'; }
      return `[${idx+1}] ${item.title}\nИсточник: ${domain}\nСсылка: ${item.link}\nКратко: ${(item.contentSnippet || item.summary || '').substring(0, 300)}`;
    }).join('\n\n');
    return context;
  } catch (error) {
    console.error('Ошибка получения RSS-новостей:', error.message);
    return null;
  }
}


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

    let realNewsContext = await fetchRealNewsFromRSS(category);
    console.log('RSS контекст получен:', realNewsContext ? 'да' : 'нет');

    if (!realNewsContext) {
      return res.status(400).json({ error: 'Не найдено актуальных новостей по этой категории. Попробуйте другую категорию или повторите позже.' });
    }

    const now = new Date();
    const currentMonth = now.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    const previousMonth = oneMonthAgo.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

    let prompt = `Требуется сгенерировать JSON-объект, представляющий **реальную, свежую новость** из мира компьютерных игр по тематике "${category}". 

**АВТОР:** Новость должна быть написана от лица журналиста **${author.name}**. В тексте можно использовать местоимение "я" или упоминать своё имя, если это уместно для стиля.

**СТИЛЬ:** ${author.desc}

**АКТУАЛЬНОСТЬ И ДАТИРОВКА:**
- Новость должна описывать **УЖЕ ПРОИЗОШЕДШЕЕ** событие, которое случилось в период **с ${previousMonth} по ${currentMonth}** (последние 30 дней).
- Если точная дата неизвестна, укажи примерный период по контексту: "в начале марта 2026", "в середине февраля 2026" и т.п.

**РЕАЛЬНЫЕ НОВОСТИ ДЛЯ ОСНОВЫ (используй их факты, не выдумывай!):**
${realNewsContext}

**ВАЖНО:** 
- Используй ТОЛЬКО те новости и ссылки, которые перечислены выше. Если в одном источнике нет всех деталей, используй факты из нескольких, чтобы собрать полную картину. Укажи, что информация основана на нескольких источниках.
- Если ссылка есть в контексте, используй её. Не добавляй новые ссылки от себя. Не выдумывай события.
- Если в контексте недостаточно деталей для новости (нет конкретных цифр, дат, названий), верни ошибку.

**КРИТИЧЕСКИ ВАЖНО:**
- **НЕ ВЫДУМЫВАЙ НЕСУЩЕСТВУЮЩИЕ ИГРЫ, ДОПОЛНЕНИЯ, СТУДИИ, РАЗРАБОТЧИКОВ, ДАТЫ.**
- Сохраняй все факты из контекста (названия, даты, цифры).
- **Самопроверка:** перед ответом проверь, все ли ключевые факты подтверждаются контекстом. Если нет — верни ошибку.

**ТРЕБОВАНИЯ К ФОРМАТУ ДЛЯ GOOGLE НОВОСТЕЙ:**
- Включай гиперссылки (в формате <a href="URL">название источника</a>) на предоставленные в контексте источники.
- Укажи статус события (официально, слухи, анонс и т.п.).
- Структура: заголовок, лид, основная часть, ссылки, дата.
- Тон: стиль автора, но факты точны.

**ТРЕБОВАНИЯ К КОНКРЕТИКЕ:**
- Укажи конкретное название игры (реальной).
- Для киберспорта: турнир, место, призовой фонд, команды, счёт.
- Добавь цифры, даты.

**ФОРМАТ JSON:**
{
  "title": "...",
  "excerpt": "...",
  "content": "... (минимум 2000 знаков, с гиперссылками)",
  "tags": ["..."],
  "image": "..." (или пустая строка)
}

Верни только JSON, без пояснений.`;

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
    console.log(content);
    if (!content) return res.status(500).json({ error: 'AI вернул пустой ответ' });

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

    if (newsData.error) {
      return res.status(400).json({ error: newsData.error });
    }

    res.json(newsData);
  } catch (error) {
    console.error('Ошибка генерации новости:', error);
    res.status(500).json({ error: 'Ошибка при обращении к AI' });
  }
};
















