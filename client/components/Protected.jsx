'use client';

import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import React from "react";

const Protected = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <main className="loading-screen">
                <div className="spinner" />
                <p>Checking authentication...</p>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return children;
};

export default Protected;
