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
  ],
  ratings: [
    'https://www.gamespot.com/feeds/news/',
    'https://www.ferra.ru/exports/rss.xml',
    'https://feeds.feedburner.com/ign/games-all',
    'https://www.rockpapershotgun.com/feed',
   
  ],
  'vr-ar': [
    'https://www.roadtovr.com/feed',
    'https://gameinformer.com/rss.xml'
  ],
  indie: [
    'https://www.indiegames.com/feed',
    'https://feeds.feedburner.com/ign/games-all',
    'https://gameinformer.com/rss.xml'
  ],
  'pc-games': [
    'https://feeds.feedburner.com/ign/news',
    'https://www.pcgamer.com/rss/',
    'https://www.gamespot.com/feeds/game-news',
    'https://www.eurogamer.net/feed/news',
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
    desc: `Стиль: аналитический новостной репортаж, молодежный.`
  },
  2: {
    name: 'Михаил «Mirage» Соколов',
    desc: `Стиль: аналитический новостной репортаж, молодежный.`
  },
  3: {
    name: 'Иван «Retro» Морозов',
    desc: `Стиль: интеллектуальное эссе с иронией, молодежный.`
  },
  4: {
    name: 'Елена «Pixel» Волкова',
    desc: `Стиль: провокационный светский блог, молодежный.`
  },
  5: {
    name: 'Кирилл «Code» Лебедев',
    desc: `Стиль: аналитический новостной репортаж, молодежный.`
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
let prompt = `Ты генерируешь JSON для Яндекс.Дзен. НАРУШЕНИЕ ЛЮБОГО ПРАВИЛА НЕДОПУСТИМО. ОСОБО ВАЖНО: ЗАПРЕЩЕНО ВЫДУМЫВАТЬ ЛЮБЫЕ ФАКТЫ, ИГРЫ, СОБЫТИЯ, ДАТЫ, НАЗВАНИЯ, ЦИФРЫ, КОМПАНИИ И РАЗРАБОТЧИКОВ.

**ТЕМАТИКА:** "${category}"
**АВТОР (только в метаданных, НЕ в content):** ${author.name}
**СТИЛЬ АВТОРА (описание):** ${author.desc}
**ЕДИНСТВЕННЫЕ ИСТОЧНИКИ ФАКТОВ (других нет):** ${realNewsContext}

---

## ⛔ ЖЁСТКИЙ ЗАПРЕТ НА ВЫДУМЫВАНИЕ
- НЕ придумывай игры, которые не упомянуты в источниках.
- НЕ придумывай студии, разработчиков, издателей, платформы, даты релизов, патчей, обновлений.
- НЕ придумывай цифры продаж, просмотров, количества игроков, бюджеты.
- НЕ придумывай имена людей, должности, цитаты, если их нет в источниках.
- НЕ объединяй факты из разных источников в новый вымышленный факт. Можно только пересказывать то, что написано в источниках, своими словами.
- ЕСЛИ в источнике написано «могла преодолеть», «по оценкам», «теоретически» — сохрани эту модальность. Не заменяй на утверждение.
- ЕСЛИ в источнике нет конкретной даты, используй формулировку «в [месяц] 2026 года» или «недавно» — но только если это не противоречит источнику.

**ПРОВЕРКА ФАКТОВ (обязательный мысленный шаг перед генерацией):**
Перед тем как написать любое предложение в content, спроси себя: «Этот факт прямо указан в одном из источников? Если нет — НЕ ПИШИ».

---

## 📋 ПРАВИЛА ФОРМАТИРОВАНИЯ CONTENT (нарушение = невалидный JSON)

### 1. ЗАПРЕЩЕНО В CONTENT:
- Начинать с «Я, [имя]...», «Мы...», с представления автора.
- Длинные абзацы (максимум 3 предложения).
- Пассивный залог («было отмечено», «сообщается»).
- Служебные фразы («как уже было сказано», «на основе предоставленных источников»).
- Любые выдуманные факты (см. выше).

### 2. ОБЯЗАТЕЛЬНЫЕ ЭЛЕМЕНТЫ:
- **Первый абзац (лид)** — начинается с цифры, факта или вопроса. Без имени автора.
- **Минимум 2 подзаголовка** (каждый на отдельной строке, 3–7 слов, можно с эмодзи).
- **Блок «Что в итоге?»** или «Коротко» в конце (обязательно).
- **Каждая ссылка** из контекста обёрнута в <a href="URL">текст</a>.

### 3. ШАБЛОН CONTENT (заполни точно):

[ЛИД: 3-4 коротких предложения, только факты из источников, начинаются с громкого утверждения или цифры]

[ПОДЗАГОЛОВОК 1 (короткий)]

[Абзац: 2-3 предложения с первым фактом + ссылка]
[Абзац: 2-3 предложения с анализом или вторым фактом из того же источника]

[ПОДЗАГОЛОВОК 2 (короткий)]

[Абзац: 2-3 предложения со вторым фактом из другого источника + ссылка]
[Абзац: пояснение или связь с киберспортом (только если это не выдумывает новые факты)]

[БЛОК «Что в итоге?»: 2-4 предложения, резюме на основе использованных фактов]

---

## 🔁 САМОПРОВЕРКА ПЕРЕД ВЫДАЧЕЙ JSON (ответь себе мысленно на все вопросы)

1. Начинается ли content с имени автора? → ЕСЛИ ДА, ОСТАНОВИСЬ И ИСПРАВЬ.
2. Есть ли хотя бы 2 подзаголовка? → ЕСЛИ НЕТ, ДОБАВЬ.
3. Есть ли блок «Что в итоге?»? → ЕСЛИ НЕТ, ДОБАВЬ.
4. Все ли абзацы короче 3 предложений? → ЕСЛИ НЕТ, РАЗБЕЙ.
5. Каждый ли факт взят из предоставленных источников? → ЕСЛИ ХОТЬ ОДИН ФАКТ ВЫДУМАН, УДАЛИ ЕГО ИЛИ ПЕРЕФОРМУЛИРУЙ ПО ИСТОЧНИКУ.
6. Использованы ли ТОЛЬКО ссылки из контекста? → ЕСЛИ ЕСТЬ ССЫЛКИ НА ДРУГИЕ РЕСУРСЫ, УДАЛИ.

ТОЛЬКО ПОСЛЕ УСПЕШНОЙ ПРОВЕРКИ ВЫДАВАЙ JSON.

---

## 📦 ФОРМАТ JSON (все поля обязательны)

{
  "title": "до 80 символов, с цифрой или громким именем",
  "excerpt": "2-3 предложения, до 200 символов",
  "content": "текст по шаблону и правилам (3000-6000 знаков)",
  "tags": ["тег1", "тег2", "тег3", "тег4"],
  "yandex_news": "сухой фактологический текст 300-500 знаков, без эмодзи, без оценки",
  "google_news": "сухой фактологический текст 300-500 знаков, без эмодзи, без оценки",
  "image": ""
}

ВЕРНИ ТОЛЬКО JSON. НИКАКОГО ДОПОЛНИТЕЛЬНОГО ТЕКСТА.`;

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
















