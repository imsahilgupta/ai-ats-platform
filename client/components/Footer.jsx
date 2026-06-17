'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Footer() {
    const pathname = usePathname();

    return (
        <footer className="global-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <p className="footer-copyright">
                        &copy; {new Date().getFullYear()} MockMate.AI. All rights reserved.
                    </p>
                </div>
                
                <div className="footer-links">
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="/privacy">Privacy Policy</Link>
                    <Link href="/terms">Terms of Service</Link>
                    <Link href="/help">Help Center</Link>
                </div>
            </div>
        </footer>
    );
}

