"use client";

import { Spinner } from "@/components/ui/spinner";
import { createContext, ReactNode, useContext, useState } from "react";

interface GlobalLoaderContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoader: () => void;
  hideLoader: () => void;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(
  undefined,
);

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <GlobalLoaderContext.Provider
      value={{ isLoading, setIsLoading, showLoader, hideLoader }}
    >
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <Spinner size={48} className="text-primary" />
        </div>
      )}
    </GlobalLoaderContext.Provider>
  );
}

export function useGlobalLoader() {
  const context = useContext(GlobalLoaderContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalLoader must be used within a GlobalLoaderProvider",
    );
  }
  return context;
}
