import { useState } from 'react';
import { useEffect } from 'react';
import { ReactNode } from 'react';
import { createContext } from 'react';
import { auth, firebase } from '../services/firebase';

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  sigInWithGoogle: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google account.');
        }
        setUser({ id: uid, name: displayName, avatar: photoURL });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function sigInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;
      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google account.');
      }
      setUser({ id: uid, name: displayName, avatar: photoURL });
    }
  }

  return (
    <AuthContext.Provider value={{ user, sigInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}