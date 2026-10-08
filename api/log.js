// api/log.js — Vercel Serverless Function
// Логирование копирования. Отправляет в Discord и Telegram параллельно.

export default async function handler(req, res) {
  // Только POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
  const TG_TOKEN = process.env.TG_TOKEN;
  const TG_CHAT = process.env.TG_CHAT;

  try {
    // Vercel автоматически парсит JSON в req.body
    const data = req.body || {};

    // Реальный IP — Vercel даёт через x-forwarded-for
    const ipRaw =
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      'unknown';
    const ip = String(ipRaw).split(',')[0].trim();

    const lines = [
      '**Copy event**',
      'Action: `' + (data.action || 'unknown') + '`',
      'IP: `' + ip + '`',
      'Time: ' + new Date().toISOString(),
      'UA: ' + (data.ua || 'unknown'),
      'Referer: ' + (data.ref || 'unknown'),
      'Page: ' + (data.page || 'unknown')
    ];
    const text = lines.join('\n');

    const tasks = [];

    // Discord
    if (DISCORD_WEBHOOK) {
      tasks.push(
        fetch(DISCORD_WEBHOOK, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ content: text })
        }).catch(function(){})
      );
    }

    // Telegram
    if (TG_TOKEN && TG_CHAT) {
      const tgText = [
        '*Copy event*',
        'Action: `' + (data.action || 'unknown') + '`',
        'IP: `' + ip + '`',
        'Time: ' + new Date().toISOString(),
        'UA: ' + (data.ua || 'unknown'),
        'Referer: ' + (data.ref || 'unknown'),
        'Page: ' + (data.page || 'unknown')
      ].join('\n');

      tasks.push(
        fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            chat_id: TG_CHAT,
            text: tgText,
            parse_mode: 'Markdown'
          })
        }).catch(function(){})
      );
    }

    await Promise.all(tasks);

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'err' });
  }
}