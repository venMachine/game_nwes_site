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
    name: 'Алексей «WinStrike» Воронов',
    desc: `Стиль: торжественный публицистический.
    - Длинные сложные предложения с причастными/деепричастными оборотами.
    - Метафоры: космос, бездна, океан, судьба, пророчество, цивилизация.
    - Лексика: "суверенитет", "традиция", "духовность", "рок", "пассионарность".
    - Тон: философский, возвышенный, с ощущением значимости события.
    - Важно: метафоры украшают факты, но НЕ заменяют и НЕ искажают их.`
  },
  2: {
    name: 'Михаил «Mirage» Соколов',
    desc: `Стиль: театральная историческая драма.
    - Обращение к читателю: "Представьте себе...", "И вот тогда...".
    - Риторические вопросы, восклицания, элементы загадочности.
    - Фразы-маркеры: "Как в старом театре...", "Занавес поднимается...".
    - Важно: драматизм не должен создавать ложное впечатление о фактах.`
  },
  3: {
    name: 'Иван «Retro» Морозов',
    desc: `Стиль: интеллектуальное эссе с иронией.
    - Литературные аллюзии, парадоксы, игра слов.
    - Разговор с читателем на равных, самоирония.
    - Структура: тезис → аргументы → вывод с элементом размышления.
    - Важно: ирония не должна обесценивать факты.`
  },
  4: {
    name: 'Елена «Pixel» Волкова',
    desc: `Стиль: провокационный светский блог.
    - Разговорный тон, сленг, короткие динамичные фразы.
    - Цинизм, самоирония, игра на публику.
    - Важно: провокация — в подаче, а не в искажении фактов.`
  },
  5: {
    name: 'Кирилл «Code» Лебедев',
    desc: `Стиль: аналитический новостной репортаж.
    - Факты, цифры, ссылки, детали — в приоритете.
    - Короткие рубленые фразы, вводные слова: "кстати", "впрочем".
    - Тон: сдержанный, информативный, с элементами диалогичности.
    - Важно: даже в аналитике факты первичны.`
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

**АВТОР:** Новость должна быть написана от лица журналиста **${author.name}**.
**ВАЖНО:** В финальном тексте НЕ ИСПОЛЬЗУЙ служебные маркеры (например, **факт**, **тезис**, **вывод**, **итог** и подобные). Пиши связный текст без выделений структуры.    
**ЗАПРЕЩЕНО:** добавлять служебные строки, не относящиеся к тексту новости: «Дата публикации новости в подборке», «Статус события», «по материалам», «источник», «дата публикации» и т.п. Вся информация должна быть внутри связного текста.

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

**ТРЕБОВАНИЯ К ФОРМАТУ **
- Включай гиперссылки (в формате <a href="URL">название источника</a>) на предоставленные в контексте источники.
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
  "yandex_news": "Текст для Яндекс.Новостей. Сухой, фактологический, без лишних деталей. Только факты: кто, что, где, когда. Объём: 300–500 знаков.",
  "google_news": "Текст для Google News. Аналогичный формат, фактологический, без оценки. 300–500 знаков.",
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
















