import type { User } from "@supabase/supabase-js";
import { createContext } from "react";

interface AuthContextType {
    user: User | null;
    signInWithGIthub: () => void;
    logout: () => void;
    }
const AuthContext=createContext<AuthContextType|undefined>(undefined);
export default AuthContext;