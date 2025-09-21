
"use client";

import { cn } from "@/lib/utils";

const progressData = [
  { label: 'JAN', value: 70, color: 'bg-[#9b59b6]' },
  { label: 'FEB', value: 55, color: 'bg-[#e91e63]' },
  { label: 'MAR', value: 30, color: 'bg-[#3498db]' },
  { label: 'APR', value: 40, color: 'bg-[#2980b9]' },
  { label: 'MAY', value: 60, color: 'bg-[#1abc9c]' },
];

const Arrowhead = ({ color }: { color: string }) => {
    // The SVG for the arrowhead. We use fill="currentColor" and set the color on the parent with text-{color}.
    // Tailwind doesn't support arbitrary text colors, so we use style for the parent.
    const svgColor = color.replace('bg-[', '').replace(']', '');
    return (
        <svg 
            width="18" 
            height="32" 
            viewBox="0 0 18 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="absolute -right-[1px] top-1/2 -translate-y-1/2"
            style={{ color: svgColor }}
        >
            <path 
                d="M0 0L18 16L0 32V0Z" 
                fill="currentColor"
            />
        </svg>
    )
};


const PercentageLabel = ({ value, color }: { value: number, color: string }) => {
    // Similar to arrowhead, we extract the raw color for the style attribute.
    const bgColor = color.replace('bg-[', '').replace(']', '');
    return (
        <div 
            className="absolute top-1/2 -translate-y-1/2 right-0 text-white text-xs font-bold flex items-center justify-center px-3 h-full"
        >
            <div
                className="z-10 relative"
                 style={{
                    right: value > 15 ? '15px' : '-40px'
                }}
            >
                {value}%
            </div>
            <div 
                className="absolute right-0 h-full w-12"
                style={{ backgroundColor: bgColor }}
            >
                <Arrowhead color={bgColor}/>
            </div>
        </div>
    )
}

export function YearlyProgressChart() {
  return (
    <div className="space-y-3">
      {progressData.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-10 text-xs font-bold text-muted-foreground">{item.label}</span>
          <div className="flex-1 bg-muted/80 rounded-full h-8 relative">
            <div
              className={cn("h-full rounded-full relative", item.color)}
              style={{ width: `${item.value}%` }}
            >
              <PercentageLabel value={item.value} color={item.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
