function cleanText(value = "") {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchOfficialNoticePage(page = 1) {
  const url =
    page === 1
      ? "https://iubat.edu/category/notice/"
      : `https://iubat.edu/category/notice/page/${page}/`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 IUBAT Staff Link Notice Reader",
      Accept: "text/html",
    },
  });

  if (!response.ok) return [];

  const html = await response.text();
  const notices = [];

  const blockRegex =
    /<h2[^>]*>\s*<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<\/h2>[\s\S]*?<li>\s*Categories[\s\S]*?<\/li>\s*([\s\S]*?)(?=<h2|<nav|<footer|$)/gi;

  let match;

  while ((match = blockRegex.exec(html)) !== null) {
    const link = match[1];
    const title = cleanText(match[2]);
    const rest = cleanText(match[3]);

    const dateMatch = rest.match(
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/
    );

    const date = dateMatch ? dateMatch[0] : "Official Notice";
    const excerpt = rest.replace(date, "").replace("Read More", "").trim();

    if (title && link) {
      notices.push({
        id: `${page}-${notices.length + 1}`,
        title,
        link,
        date,
        excerpt: excerpt.slice(0, 180),
      });
    }
  }

  return notices;
}

export default async function handler(req, res) {
  try {
    const pageRequests = [];

    for (let page = 1; page <= 53; page++) {
      pageRequests.push(fetchOfficialNoticePage(page));
    }

    const pages = await Promise.all(pageRequests);
    const notices = pages.flat().filter(Boolean);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1800");

    return res.status(200).json({
      source: "IUBAT Official Notice Page",
      total: notices.length,
      notices,
    });
  } catch (error) {
    return res.status(200).json({
      source: "IUBAT Official Notice Page",
      total: 0,
      notices: [],
      error: "Could not load official IUBAT notices right now.",
    });
  }
}
