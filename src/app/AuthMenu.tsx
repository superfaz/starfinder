import { useKindeBrowserClient } from "./kinde";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function AuthMenu() {
  const { user } = useKindeBrowserClient();

  if (!user) {
    return null;
  }

  return (
    <NavDropdown title={user.given_name} id="user-nav-dropdown" align={"end"}>
      <NavDropdown.Item href="/api/auth/logout">Se déconnecter</NavDropdown.Item>
    </NavDropdown>
  );
}
