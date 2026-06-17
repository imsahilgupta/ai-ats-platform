'use client';

import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser, loading, setLoading } = context;
  const { showToast } = useToast();

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      showToast(`Welcome back, ${data.user.username}!`, 'success');
      return data.user;
    } catch (err) {
      console.log(err);
      showToast('Invalid email or password. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      // Clear the auto-set cookie so user must log in explicitly
      await logout();
      setUser(null);
      showToast('Account created! Please log in to continue.', 'success');
      return data.user;
    } catch (err) {
      console.log(err);
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      showToast('You have been logged out.', 'info');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getAndSetUser();
  }, [setUser, setLoading]);

  return {
    user,
    loading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
