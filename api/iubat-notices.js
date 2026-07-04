function cleanText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "IUBAT Staff Link Notice Reader",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return {
    data: await response.json(),
    headers: response.headers,
  };
}

async function fetchWordPressNotices() {
  const categoryResponse = await getJson(
    "https://iubat.edu/wp-json/wp/v2/categories?slug=notice"
  );

  const noticeCategory = Array.isArray(categoryResponse.data)
    ? categoryResponse.data[0]
    : null;

  if (!noticeCategory?.id) {
    throw new Error("Notice category not found");
  }

  const firstUrl =
    `https://iubat.edu/wp-json/wp/v2/posts?categories=${noticeCategory.id}` +
    "&per_page=100&page=1&_fields=id,date,link,title,excerpt";

  const firstPage = await getJson(firstUrl);
  const totalPages = Math.min(
    Number(firstPage.headers.get("x-wp-totalpages") || 1),
    20
  );

  const pageRequests = [];

  for (let page = 2; page <= totalPages; page++) {
    const url =
      `https://iubat.edu/wp-json/wp/v2/posts?categories=${noticeCategory.id}` +
      `&per_page=100&page=${page}&_fields=id,date,link,title,excerpt`;

    pageRequests.push(
      getJson(url)
        .then((result) => result.data)
        .catch(() => [])
    );
  }

  const extraPages = await Promise.all(pageRequests);
  const allPosts = [firstPage.data, ...extraPages].flat();

  return allPosts
    .filter(Boolean)
    .map((post) => ({
      id: post.id,
      title: cleanText(post.title?.rendered || "Untitled Notice"),
      excerpt: cleanText(post.excerpt?.rendered || "").slice(0, 180),
      date: formatDate(post.date),
      rawDate: post.date,
      link: post.link,
    }))
    .filter((notice) => notice.title && notice.link)
    .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
}

async function fetchFallbackNotices() {
  const response = await fetch("https://iubat.edu/category/notice/", {
    headers: {
      "User-Agent": "IUBAT Staff Link Notice Reader",
      Accept: "text/html",
    },
  });

  if (!response.ok) {
    throw new Error("Fallback notice page failed");
  }

  const html = await response.text();
  const notices = [];
  const regex = /<h2[^>]*>\s*<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<\/h2>[\s\S]*?([A-Z][a-z]+ \d{1,2}, \d{4})/gi;

  let match;

  while ((match = regex.exec(html)) !== null) {
    notices.push({
      id: notices.length + 1,
      link: match[1],
      title: cleanText(match[2]),
      excerpt: "",
      date: match[3],
      rawDate: match[3],
    });
  }

  return notices;
}

module.exports = async function handler(req, res) {
  try {
    let notices = [];

    try {
      notices = await fetchWordPressNotices();
    } catch {
      notices = await fetchFallbackNotices();
    }

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1800");

    return res.status(200).json({
      source: "IUBAT Official Notice",
      total: notices.length,
      notices,
    });
  } catch (error) {
    return res.status(200).json({
      source: "IUBAT Official Notice",
      total: 0,
      notices: [],
      error: "Could not load notices right now.",
    });
  }
};
