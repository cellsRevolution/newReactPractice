import { createContext } from "react";

type authContext = {
    signIn: (data: string) => Promise<void>;
    signOut: () => Promise<void>|void;
}

export const AuthContext = createContext<authContext>({} as authContext);