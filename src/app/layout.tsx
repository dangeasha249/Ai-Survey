import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-edu-survey.org"),
  title: "AI-Edu Impact Survey | Higher Education AI Analytics",
  description: "An academic research study analyzing the impact of Artificial Intelligence tools (ChatGPT, Gemini, Copilot) on teaching effectiveness and student learning outcomes in higher education across Maharashtra, India.",
  keywords: [
    "AI in Education",
    "Artificial Intelligence Survey",
    "Higher Education Research",
    "Student AI Usage",
    "Pedagogical Impact Study",
    "ChatGPT in Academics",
    "Maharashtra Higher Education",
  ],
  authors: [{ name: "AI-Edu Academic Research Cell" }],
  creator: "AI-Edu Research Team",
  publisher: "AI-Edu Impact Survey",
  openGraph: {
    title: "AI-Edu Impact Survey | Higher Education AI Analytics",
    description: "Empirical study on Artificial Intelligence tools in higher education. Explore adoption metrics, impact scores, and live survey findings.",
    url: "https://ai-edu-survey.org",
    siteName: "AI-Edu Impact Survey",
    images: [
      {
        url: "/images/landing-page.png",
        width: 1200,
        height: 630,
        alt: "AI Tools in Higher Education Research Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Edu Impact Survey | Higher Education AI Analytics",
    description: "Empirical study on Artificial Intelligence tools in higher education. Explore adoption metrics, impact scores, and live survey findings.",
    images: ["/images/landing-page.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
