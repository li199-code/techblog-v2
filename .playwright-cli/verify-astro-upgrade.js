async (page) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:4321/");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.locator("#search input").fill("nodejs");
  await page.locator(".pagefind-ui__result-link").first().waitFor({ timeout: 15000 });
  const searchResults = await page.locator(".pagefind-ui__result-link").count();
  const resultTitle = await page.locator(".pagefind-ui__result-link").first().textContent();
  await page.keyboard.press("Escape");
  await page.locator('main a[href^="/blog/"]').first().click();
  await page.locator("article").waitFor();
  const article = {
    url: page.url(),
    title: await page.locator("h1").first().textContent(),
    bodyLength: (await page.locator("article").innerText()).length,
  };
  await page.getByRole("button", { name: "Dark theme", exact: true }).click();
  const dark = await page.evaluate(() => ({
    active: document.documentElement.classList.contains("dark"),
    background: getComputedStyle(document.body).backgroundColor,
  }));
  await page.goto("http://127.0.0.1:4321/blog/2");
  const pagination = await page.title();
  await page.goto("http://127.0.0.1:4321/daily/2026-10-03-20261003");
  const daily = {
    articleCount: await page.locator("article").count(),
    title: await page.locator("main h1").textContent(),
  };
  const feed = await page.request.get("http://127.0.0.1:4321/feed.xml");
  return { searchResults, resultTitle, article, dark, pagination, daily, feedStatus: feed.status(), errors };
}
