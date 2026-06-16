import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { InterviewProvider } from "../contexts/InterviewContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
        <AuthProvider>
          <InterviewProvider>
            <div className="app-wrapper">
              <Navbar />
              <div className="main-content-area">
                {children}
              </div>
              <Footer />
            </div>
          </InterviewProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

