"use client";

import { createContext, useContext, useState } from 'react';

interface DateContextType {
  date: Date,
  setDate: (newDate: Date) => void
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

export function DateProvider({ children }: { children: React.ReactNode }) {

  const [date, setDate] = useState(new Date());

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
}
