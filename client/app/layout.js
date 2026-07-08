import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { InterviewProvider } from "../contexts/InterviewContext";
import { ToastProvider } from "../contexts/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ToastContainer from "../components/ToastContainer";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "MockMate.AI - Custom Interview Plan",
  description: "AI-Powered Strategy Generation & Resume Analyzer",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ToastProvider>
          <AuthProvider>
            <InterviewProvider>
              <div className="app-wrapper">
                <Navbar />
                <div className="main-content-area">
                  {children}
                </div>
                <Footer />
                <ToastContainer />
              </div>
            </InterviewProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
