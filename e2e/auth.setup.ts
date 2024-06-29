import { test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

if (!USER_EMAIL || !USER_PASSWORD) {
  throw new Error("Please provide USER_EMAIL and USER_PASSWORD in the environment variables.");
}

setup("authenticate", async ({ page }) => {
  await page.goto("/api/auth/login");
  await page.getByLabel("Email address").fill(USER_EMAIL);
  await page.getByLabel("Password").fill(USER_PASSWORD);
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  // Wait until the page receives the cookies.
  await page.waitForURL("/");

  await page.context().storageState({ path: authFile });
});
