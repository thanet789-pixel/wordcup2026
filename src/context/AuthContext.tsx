"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  favorites: string[];
  addFavorite: (teamId: string) => Promise<void>;
  removeFavorite: (teamId: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        
        try {
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              name: currentUser.displayName || "แฟนบอลไม่มีชื่อ",
              email: currentUser.email || "",
              photoURL: currentUser.photoURL || "",
              role: "user",
              favorites: [],
              createdAt: new Date().toISOString()
            }, { merge: true });
            setIsAdmin(false);
          } else {
            const data = userDoc.data();
            setIsAdmin(data?.role === "admin");
          }
        } catch (err) {
          console.error("Error setting up user doc:", err);
        }

        const unsubFavs = onSnapshot(doc(db, "users", currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFavorites(data.favorites || []);
            setIsAdmin(data.role === "admin");
          }
        });

        setLoading(false);
        return () => unsubFavs();
      } else {
        setIsAdmin(false);
        setFavorites([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const addFavorite = async (teamId: string) => {
    if (!user || !db) return;
    const userRef = doc(db, "users", user.uid);
    const newFavs = [...favorites.filter(id => id !== teamId), teamId];
    await setDoc(userRef, { favorites: newFavs }, { merge: true });
  };

  const removeFavorite = async (teamId: string) => {
    if (!user || !db) return;
    const userRef = doc(db, "users", user.uid);
    const newFavs = favorites.filter(id => id !== teamId);
    await setDoc(userRef, { favorites: newFavs }, { merge: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        favorites,
        addFavorite,
        removeFavorite,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
