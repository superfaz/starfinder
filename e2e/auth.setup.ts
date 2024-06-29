import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

const PLAYWRIGHT_USER_EMAIL = process.env.PLAYWRIGHT_USER_EMAIL;
const PLAYWRIGHT_USER_PASSWORD = process.env.PLAYWRIGHT_USER_PASSWORD;

if (!PLAYWRIGHT_USER_EMAIL) {
  console.error(process.env);
  throw new Error("Please provide PLAYWRIGHT_USER_EMAIL in the environment variables.");
}
if (!PLAYWRIGHT_USER_PASSWORD) {
  console.error(process.env);
  throw new Error("Please provide PLAYWRIGHT_USER_PASSWORD in the environment variables.");
}

setup("authenticate", async ({ page }) => {
  await page.goto("/api/auth/login");
  await page.getByLabel("Email address").fill(PLAYWRIGHT_USER_EMAIL);
  await page.getByLabel("Password").fill(PLAYWRIGHT_USER_PASSWORD);
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  // Wait until the page receives the cookies.
  await page.waitForURL("/");

  await page.context().storageState({ path: authFile });
});
