import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'cine-flow-auth-state';
const PROFILE_STORAGE_KEY = 'cine-flow-user-profile';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);

    if (storedValue === 'true') {
      setIsRegistered(true);
    }

    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
      } catch {
        window.localStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    }
  }, []);

  const markAsRegistered = (profile = {}) => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    setIsRegistered(true);
    setUserProfile(profile);
  };

  const isRegisteredUser = useCallback((email) => {
    if (!userProfile?.email || !email) {
      return false;
    }

    return userProfile.email.trim().toLowerCase() === email.trim().toLowerCase();
  }, [userProfile]);

  const loginUser = useCallback((email, password) => {
    if (!userProfile) {
      return false;
    }

    const isValidLogin = userProfile.email === email && userProfile.password === password;

    if (isValidLogin) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setIsRegistered(true);
    }

    return isValidLogin;
  }, [userProfile]);

  const updateProfile = useCallback((nextProfile = {}) => {
    const mergedProfile = {
      ...userProfile,
      ...nextProfile,
    };

    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(mergedProfile));
    setUserProfile(mergedProfile);
    setIsRegistered(true);
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  }, [userProfile]);

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsRegistered(false);
  }, []);

  const getDisplayName = useCallback(() => {
    if (userProfile?.name?.trim()) {
      return userProfile.name.trim();
    }

    if (userProfile?.email?.trim()) {
      return userProfile.email.split('@')[0];
    }

    return 'Usuario';
  }, [userProfile]);

  const value = useMemo(() => ({
    isRegistered,
    userProfile,
    getDisplayName,
    markAsRegistered,
    isRegisteredUser,
    loginUser,
    updateProfile,
    logout,
  }), [getDisplayName, isRegistered, isRegisteredUser, loginUser, logout, updateProfile, userProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};