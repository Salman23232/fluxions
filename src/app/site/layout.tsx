import Navigation from "@/components/site/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full justify-center items-center">
      <ClerkProvider appearance={{ baseTheme: dark }}>
      <Navigation />

      {children}
      </ClerkProvider>
    </div>
  );
};

export default layout;
