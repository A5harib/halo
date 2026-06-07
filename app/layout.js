import "./globals.css";

export const metadata = {
  title: "ProspectHalo — AI-Powered B2B Sales Intelligence & Lead Generation",
  description: "Describe your ideal customer profile in plain English. ProspectHalo dynamically crawls the web, aggregates real contact information, and generates hyper-personalized cold outreach copy using advanced AI.",
  keywords: "AI lead generation, B2B sales intelligence, contact finder, sales prospecting tool, cold outreach automation, email marketing AI, Pakistan sales leads, Karachi business leads, Lahore tech startups",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "ProspectHalo — AI-Powered B2B Sales Intelligence & Lead Finder",
    description: "Find verified prospects dynamically using web scraping and reasoning AI models.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProspectHalo — AI-Powered B2B Sales Intelligence & Lead Finder",
    description: "Dynamically scrape and build sales intelligence outreach dossiers with AI.",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
