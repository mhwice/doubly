"use client";

import { createContext, useContext } from 'react';

interface DateContextType {
  date: Date
}

const DateContext = createContext<DateContextType | undefined>(undefined);

// A custom hook to use the date value in client components
export function useCurrentDate() {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useCurrentDate must be used within a DateProvider');
  }
  return context;
}

interface DateProviderProps {
  date: Date,
  children: React.ReactNode
}

export function DateProvider({ date, children }: DateProviderProps) {
  return (
    <DateContext.Provider value={{ date }}>
      {children}
    </DateContext.Provider>
  );
}
