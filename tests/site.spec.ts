import { expect, test } from "@playwright/test";

test("home navigation and command palette work", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Jeramiah Coffey/);
  await expect(
    page.getByRole("heading", { name: /I build software for ABA therapy/ }),
  ).toBeVisible();
  await expect(page.getByRole("region", { name: "Work history" })).toBeVisible();

  await page.getByRole("button", { name: "Open command menu" }).click();
  await expect(page.getByRole("dialog", { name: "Command menu" })).toBeVisible();
  await page.getByRole("combobox", { name: "Type a command or search" }).fill("open writing");
  await page.getByRole("option", { name: /Open writing/ }).click();

  await expect(page).toHaveURL("/writing");
  await expect(page.getByRole("heading", { name: "Writing" })).toBeVisible();
});

test("published writing and discovery routes are available", async ({ page, request }) => {
  await page.goto("/writing");

  await expect(page.getByText("draft", { exact: true })).toHaveCount(0);
  await expect(page.locator(".wcard")).toHaveCount(5);

  await page.goto("/writing/owning-the-whole-system-in-aba-healthtech");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://jeramiahcoffey.com/writing/owning-the-whole-system-in-aba-healthtech",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    "https://jeramiahcoffey.com/opengraph-image",
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    "https://jeramiahcoffey.com/twitter-image",
  );

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  await expect(robots.text()).resolves.toContain(
    "Sitemap: https://jeramiahcoffey.com/sitemap.xml",
  );

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  await expect(sitemap.text()).resolves.toContain(
    "owning-the-whole-system-in-aba-healthtech",
  );

  const socialImage = await request.get("/opengraph-image");
  expect(socialImage.ok()).toBeTruthy();
  expect(socialImage.headers()["content-type"]).toContain("image/png");
});

test("www requests redirect to the canonical host", async ({ request }) => {
  const response = await request.get("/", {
    headers: { host: "www.jeramiahcoffey.com" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("https://jeramiahcoffey.com");
});
