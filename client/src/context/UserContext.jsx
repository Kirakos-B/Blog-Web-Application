import { useState } from "react";
import { UserContext } from "./UserContext"; // Import from the new file

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
