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

function formatDate(value = "") {
  if (!value) return "Official Notice";

  const directDate = value.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/
  );

  if (directDate) return directDate[0];

  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Official Notice";
  }
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 IUBAT Staff Link",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`JSON request failed: ${response.status}`);
  }

  return {
    data: await response.json(),
    headers: response.headers,
  };
}

async function fetchWordPressNotices() {
  const categoryResult = await fetchJson(
    "https://iubat.edu/wp-json/wp/v2/categories?slug=notice"
  );

  const categoryId = Array.isArray(categoryResult.data)
    ? categoryResult.data[0]?.id
    : null;

  if (!categoryId) {
    throw new Error("Notice category ID not found");
  }

  const firstUrl =
    `https://iubat.edu/wp-json/wp/v2/posts?categories=${categoryId}` +
    "&per_page=100&page=1&_fields=id,date,link,title,excerpt";

  const firstPage = await fetchJson(firstUrl);

  const totalPages = Math.min(
    Number(firstPage.headers.get("x-wp-totalpages") || 1),
    10
  );

  const requests = [];

  for (let page = 2; page <= totalPages; page++) {
    const url =
      `https://iubat.edu/wp-json/wp/v2/posts?categories=${categoryId}` +
      `&per_page=100&page=${page}&_fields=id,date,link,title,excerpt`;

    requests.push(
      fetchJson(url)
        .then((result) => result.data)
        .catch(() => [])
    );
  }

  const extraPages = await Promise.all(requests);
  const posts = [firstPage.data, ...extraPages].flat();

  return posts
    .map((post) => ({
      id: post.id,
      title: cleanText(post.title?.rendered || "Untitled Notice"),
      date: formatDate(post.date),
      rawDate: post.date,
      link: post.link,
      excerpt: cleanText(post.excerpt?.rendered || "").slice(0, 190),
    }))
    .filter((notice) => notice.title && notice.link);
}

async function fetchHtmlPage(page = 1) {
  const url =
    page === 1
      ? "https://iubat.edu/category/notice/"
      : `https://iubat.edu/category/notice/page/${page}/`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 IUBAT Staff Link",
      Accept: "text/html",
    },
  });

  if (!response.ok) return "";

  return response.text();
}

function parseNoticeHtml(html, page = 1) {
  const notices = [];
  const headingRegex =
    /<h2[^>]*>\s*<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<\/h2>/gi;

  const matches = [...html.matchAll(headingRegex)];

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];

    const link = current[1];
    const title = cleanText(current[2]);

    if (!link || !title) continue;
    if (link.includes("/category/notice")) continue;

    const start = current.index + current[0].length;
    const end = next ? next.index : html.length;
    const block = html.slice(start, end);

    const cleanedBlock = cleanText(block);
    const date = formatDate(cleanedBlock);

    const excerpt = cleanedBlock
      .replace("Categories Notice", "")
      .replace(date, "")
      .replace("Read More", "")
      .trim()
      .slice(0, 190);

    notices.push({
      id: `html-${page}-${i + 1}`,
      title,
      date,
      rawDate: date,
      link,
      excerpt,
    });
  }

  return notices;
}

async function fetchHtmlNotices() {
  const firstHtml = await fetchHtmlPage(1);
  const firstPageNotices = parseNoticeHtml(firstHtml, 1);

  const pageNumbers = [...firstHtml.matchAll(/\/category\/notice\/page\/(\d+)\//g)]
    .map((match) => Number(match[1]))
    .filter(Boolean);

  const maxPage = Math.min(Math.max(1, ...pageNumbers), 53);

  const requests = [];

  for (let page = 2; page <= maxPage; page++) {
    requests.push(
      fetchHtmlPage(page)
        .then((html) => parseNoticeHtml(html, page))
        .catch(() => [])
    );
  }

  const extraPages = await Promise.all(requests);

  return [firstPageNotices, ...extraPages].flat();
}

export default async function handler(req, res) {
  try {
    let notices = [];

    try {
      notices = await fetchWordPressNotices();
    } catch {
      notices = await fetchHtmlNotices();
    }

    const unique = [];
    const seen = new Set();

    for (const notice of notices) {
      const key = notice.link || notice.title;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(notice);
      }
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1800");

    return res.status(200).json({
      source: "IUBAT Official Notice Page",
      total: unique.length,
      notices: unique,
    });
  } catch (error) {
    return res.status(200).json({
      source: "IUBAT Official Notice Page",
      total: 0,
      notices: [],
      error: error.message || "Could not load official IUBAT notices right now.",
    });
  }
}
