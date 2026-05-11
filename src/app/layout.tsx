import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import CustomCursor from "@/components/shared/CustomCursor";
import LenisProvider from "@/components/shared/lenis-provider";
import SessionProvider from "@/components/shared/session-provider";
import GridBackground from "@/components/shared/GridBackground";
import { AdaptiveQualityProvider } from "@/components/shared";
import { ThemeProvider } from "@/components/shared/theme-provider";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "PathForge — Forge Your Learning Path",
    template: "%s | PathForge",
  },
  description:
    "AI-powered personalized learning roadmaps. Tell us your goals and we'll forge the perfect path to mastery.",
  keywords: [
    "learning roadmap",
    "AI learning",
    "personalized education",
    "skills development",
    "PathForge",
  ],
  authors: [{ name: "PathForge" }],
  openGraph: {
    title: "PathForge — Forge Your Learning Path",
    description: "AI-powered personalized learning roadmaps.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "PathForge",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PathForge — Forge Your Learning Path",
    description: "AI-powered personalized learning roadmaps.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050510",
  colorScheme: "light dark",
};

// ─── Client Component Wrapper ────────────────────────────────────────────────

function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} relative font-sans antialiased`}
      >
        <ClientWrapper>
          <SessionProvider>
            <ThemeProvider>
              <LenisProvider>
                <AdaptiveQualityProvider>
                  <GridBackground />
                  {children}
                </AdaptiveQualityProvider>
              </LenisProvider>
            </ThemeProvider>
          </SessionProvider>
        </ClientWrapper>
        <Toaster />
      </body>
    </html>
  );
}

// Dynamic Toaster Component to change theme based on context
function DynamicToaster() {
  return (
    <>
      <div className="dark">
        <div className="hidden dark:block">
          <Toaster
            position="bottom-right"
            richColors
            theme="dark"
            toastOptions={{
              style: {
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "hsl(213 31% 91%)",
              },
            }}
          />
        </div>
      </div>
      <div className="light">
        <div className="hidden light:block">
          <Toaster
            position="bottom-right"
            richColors
            theme="light"
            toastOptions={{
              style: {
                background: "rgba(0,0,0,0.06)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(0,0,0,0.1)",
                color: "hsl(220 9% 20%)",
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
