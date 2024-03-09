import { screen, within } from "@testing-library/dom";
import { UserEvent } from "@testing-library/user-event";

export async function navigateToTab(user: UserEvent, name: string): Promise<void> {
  const tabs = screen.getByTestId("tabs");
  await user.click(within(tabs).getByRole("link", { name }));
}
