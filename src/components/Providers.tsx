"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#1e293b",
                        color: "#f1f5f9",
                        border: "1px solid rgba(99,102,241,0.35)",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "600",
                        padding: "12px 16px",
                        boxShadow: "0 10px 40px -8px rgba(0,0,0,0.6)",
                    },
                    success: {
                        iconTheme: {
                            primary: "#6366f1",
                            secondary: "#fff",
                        },
                    },
                }}
            />
        </ThemeProvider>
    );
}

