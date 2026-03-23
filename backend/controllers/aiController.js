const OpenAI = require('openai');
const Parser = require('rss-parser');
const parser = new Parser();

// Список RSS-лент (можно добавлять/удалять)
const RSS_FEEDS = [
    'https://rss.stopgame.ru/rss_news.xml',
    'https://feeds.feedburner.com/ign/news',
    'https://www.pcgamer.com/rss',
    'https://www.goha.ru/rss/news',
    'https://www.igromania.ru/rss/news.xml',
    'https://dtf.ru/rss',
    'https://www.goha.ru/rss/videogames',
    'https://www.goha.ru/rss/mobile-games',
    'https://www.goha.ru/rss/mmorpg',
    'https://www.ixbt.com/export/news.rss',
    'https://www.ixbt.com/export/sec_video.rss',
    'https://www.ixbt.com/export/sec_editorial.rss',
    'https://www.uploadvr.com/feed/',
    'https://skarredghost.com/feed/',
    'https://www.gamedeveloper.com/rss.xml'
];

// Функция получения последних новостей из RSS
async function fetchRealNewsFromRSS(query) {
  try {
    let allArticles = [];
    for (const feedUrl of RSS_FEEDS) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const articles = feed.items.slice(0, 5).map(item => ({
          title: item.title,
          link: item.link,
          contentSnippet: item.contentSnippet || item.summary || '',
          pubDate: item.pubDate
        }));
        allArticles = allArticles.concat(articles);
      } catch (err) {
        console.error(`Ошибка парсинга RSS ${feedUrl}:`, err.message);
      }
    }
    if (allArticles.length === 0) return null;
    // Сортируем по дате и берём 5 самых свежих
    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    const latest = allArticles.slice(0, 5);
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
}

// Стили авторов (оставляем как есть)
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

    // Получаем реальные новости из RSS
    let realNewsContext = await fetchRealNewsFromRSS(category);

    // Динамический диапазон "последний месяц"
    const now = new Date();
    const currentMonth = now.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    const previousMonth = oneMonthAgo.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

    // Формируем промпт
    let prompt = `Требуется сгенерировать JSON-объект, представляющий **реальную, свежую новость** из мира компьютерных игр по тематике "${category}". 

**АВТОР:** Новость должна быть написана от лица журналиста **${author.name}**. В тексте можно использовать местоимение "я" или упоминать своё имя, если это уместно для стиля.

**СТИЛЬ:** ${author.desc}

**АКТУАЛЬНОСТЬ И ДАТИРОВКА:**
- Новость должна описывать **УЖЕ ПРОИЗОШЕДШЕЕ** событие, которое случилось в период **с ${previousMonth} по ${currentMonth}** (последние 30 дней).
- Дата события (например, в тексте новости или в подразумеваемом контексте) **обязательно должна попадать в этот диапазон**.
- Если точная дата неизвестна, укажи примерный период: "в начале марта 2026", "в середине февраля 2026" и т.п.

`;

    if (realNewsContext) {
      prompt += `**РЕАЛЬНЫЕ НОВОСТИ ДЛЯ ОСНОВЫ (используй их факты, не выдумывай!):**\n${realNewsContext}\n\n`;
    } else {
      prompt += `**ВАЖНО:** У тебя нет доступа к актуальным новостям, поэтому, если не знаешь реальных событий, сгенерируй 
      текст как художественную интерпретацию возможных событий, но с указанием, что это "предположительно"
      **ЗАПРЕЩЕНО ВЫДУМЫВАТЬ НЕСУЩЕСТВУЮЩИЕ ИГРЫ, ДОПОЛНЕНИЯ, СТУДИИ, РАЗРАБОТЧИКОВ, ДАТЫ.**
        - Используй только **реальные, хорошо известные проекты** (например: Cyberpunk 2077, The Witcher 3, Elden Ring, GTA VI, Starfield, Baldur's Gate 3, Hogwarts Legacy, Minecraft, Dota 2, CS2, Valorant, League of Legends). 
        - Для категории **«Компьютерные игры»** разрешено писать о:
          * Выходе официальных обновлений/патчей (например, "Вышел патч 2.0 для Cyberpunk 2077").
          * Юбилеях (например, "20 лет The Elder Scrolls IV: Oblivion").
          * Новостях о разработчиках (например, "Создатель Portal покидает Valve").
          * Слухах о предстоящих играх, но с оговоркой (например, "По слухам, GTA VI выйдет в конце 2026 года").
          * Реальных событиях (например, "CD Projekt RED анонсировала новую игру").
        - **НЕ ВЫДУМЫВАЙ** названия игр, дополнений, студий. Если не знаешь точных фактов — используй реальные, но хорошо известные, и пиши о них.
        - Если пишешь про киберспорт — обязательно используй реальные названия команд, турниров, игроков (примеры: Dota 2 — Team Spirit, OG, Gaimin Gladiators; CS2 — FaZe, NAVI, Vitality; Valorant — LOUD, FNATIC; League of Legends — T1, Gen.G).
        - Для новостей о релизах: укажи конкретную дату выхода (например, "15 марта 2026 года") — она должна быть в пределах последнего месяца.
        - Для инди-игр: название студии, приблизительная цена, ссылка на Steam (если есть).
        - Ссылки на официальные источники
        - Больше фактуры   
      .\n\n`;
    }

    prompt += `**КРИТИЧЕСКИ ВАЖНО:**
- **НЕ ВЫДУМЫВАЙ НЕСУЩЕСТВУЮЩИЕ ИГРЫ, ДОПОЛНЕНИЯ, СТУДИИ, РАЗРАБОТЧИКОВ, ДАТЫ.**
- Используй только **реальные, хорошо известные проекты**.
- Если ты используешь реальные новости из контекста, **сохраняй все факты (названия, даты, цифры)**, но можешь переписать в заданном стиле.

**ТРЕБОВАНИЯ К КОНКРЕТИКЕ:**
- Обязательно укажи конкретное название игры (реальной).
- Для киберспорта: название турнира, место проведения, призовой фонд, названия команд, имена игроков, счёт.
- Добавь цифры, даты, конкретные факты. Избегай общих фраз.

**ФОРМАТ JSON:**
{
  "title": "Заголовок (должен быть ярким, в заданном стиле)",
  "excerpt": "Краткое описание (1-2 предложения, суть)",
  "content": "Полный текст новости (не менее 2 абзацев, общий объём текста – минимум 2000 знаков с пробелами. Каждый абзац должен содержать конкретные детали, имена, цифры и быть написан строго в заданном стиле.)",
  "tags": ["тег1", "тег2", "название игры", "жанр"],
  "image": "https://images.unsplash.com/..." (или пустая строка)
}

Верни только JSON, без каких-либо пояснений, рассуждений или дополнительного текста. Не используй markdown.`;

    // Вызов AITUNNEL
    const client = new OpenAI({
      apiKey: process.env.AITUNNEL_API_KEY,
      baseURL: 'https://api.aitunnel.ru/v1/'
    });

    const response = await client.chat.completions.create({
      model: 'glm-4-32b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 3000
    });

    const content = response.choices[0].message.content;
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

    res.json(newsData);
  } catch (error) {
    console.error('Ошибка генерации новости:', error);
    res.status(500).json({ error: 'Ошибка при обращении к AI' });
  }
};











