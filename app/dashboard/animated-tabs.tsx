"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from 'next/navigation';

const tabs = [
  { name: "Links", path: "/dashboard/links" },
  { name: "Analytics", path: "/dashboard/analytics" },
];

export function AnimatedTabs() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(tabs.findIndex((tab) => pathname === tab.path));
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  // const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);


  useEffect(() => {
    const idx = tabs.findIndex((tab) => pathname === tab.path);
    if (idx !== activeIndex) setActiveIndex(idx);
  }, [pathname]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (hoveredIndex !== null) {
        const hoveredElement = tabRefs.current[hoveredIndex];
        if (hoveredElement) {
          const { offsetLeft, offsetWidth } = hoveredElement;
          setHoverStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          });
        }
      }
    });
  }, [hoveredIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (activeIndex === -1) {
        setActiveStyle({ left: "0px", width: "0px" });
        return;
      };
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (activeIndex === -1) {
        setActiveStyle({ left: "0px", width: "0px" });
        return;
      };
      const overviewElement = tabRefs.current[activeIndex];
      if (overviewElement) {
        const { offsetLeft, offsetWidth } = overviewElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, []);

  return (
    <div className="relative">
      {/* Hover Highlight */}
      <div
        className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] rounded-[6px] flex items-center pointer-events-none"
        style={{ ...hoverStyle, opacity: hoveredIndex !== null ? 1 : 0 }}
      />

      {/* Active Indicator */}
      <div
        className="absolute bottom-[-6px] h-[2px] bg-vprimary transition-all duration-300 ease-out pointer-events-none"
        style={activeStyle}
      />

      {/* Tabs */}
      <div className="relative flex space-x-[6px] items-center">
        {tabs.map((tab, index) => (
          <Link
          key={index}
          href={tab.path}
          className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] ${
            index === activeIndex
              ? "text-vprimary"
              : "text-vsecondary hover:text-[#0e0e10]"
          }`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
        >
          <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full">
            {tab.name}
          </div>
        </Link>
          // <div
          //   key={index}
          //   ref={(el) => {
          //     tabRefs.current[index] = el;
          //   }}
          //   className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] ${
          //     index === activeIndex ? "text-vprimary" : "text-vsecondary hover:text-[#0e0e10]"
          //   }`}
          //   onMouseEnter={() => setHoveredIndex(index)}
          //   onMouseLeave={() => setHoveredIndex(null)}
          //   onClick={() => setActiveIndex(index)}
          // >
          //   <div className="text-sm font-medium leading-5 whitespace-nowrap flex items-center justify-center h-full">
          //     <Link href={tab.path} passHref>
          //       {tab.name}
          //     </Link>
          //   </div>
          // </div>
        ))}
      </div>
    </div>
  );
}
