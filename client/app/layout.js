import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { InterviewProvider } from "../contexts/InterviewContext";
import { ToastProvider } from "../contexts/ToastContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ToastContainer from "../components/ToastContainer";

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
      <body>
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
