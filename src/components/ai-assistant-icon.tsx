import { cn } from "@/lib/utils";

export function AiAssistantIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("w-full h-full", className)}
    >
      <g transform="translate(0, 5)">
        {/* Turban */}
        <path
          d="M 25 50 C 20 30, 30 10, 50 15 C 70 10, 80 30, 75 50 Z"
          fill="#D9534F"
        />
        <path
          d="M 28 48 C 23 33, 33 18, 50 22 C 67 18, 77 33, 72 48 Z"
          fill="none"
          stroke="#F0A09D"
          strokeWidth="2"
        />
         <path
          d="M 40 25 Q 50 20, 60 25"
          fill="none"
          stroke="#F0A09D"
          strokeWidth="1.5"
        />
         <path
          d="M 35 32 Q 50 26, 65 32"
          fill="none"
          stroke="#F0A09D"
          strokeWidth="1.5"
        />
         <path
          d="M 30 40 Q 50 34, 70 40"
          fill="none"
          stroke="#F0A09D"
          strokeWidth="1.5"
        />

        {/* Face */}
        <path
          d="M 35 45 A 15 15 0 0 1 65 45 L 65 60 Q 65 70, 50 70 Q 35 70, 35 60 Z"
          fill="#f0c08b"
        />

        {/* Eyes */}
        <circle cx="43" cy="52" r="3" fill="#fff" />
        <circle cx="57" cy="52" r="3" fill="#fff" />
        <circle cx="43" cy="52" r="1.5" fill="#000" />
        <circle cx="57" cy="52" r="1.5" fill="#000" />
        
        {/* Eyebrows */}
        <path d="M 40 47 Q 43 45, 46 47" fill="none" stroke="#000" strokeWidth="1.5" />
        <path d="M 54 47 Q 57 45, 60 47" fill="none" stroke="#000" strokeWidth="1.5" />

        {/* Mustache */}
        <path d="M 38 62 Q 50 68, 62 62 Q 50 64, 38 62" fill="#000" />

        {/* Mouth */}
        <path d="M 45 68 A 5 3.5 0 0 0 55 68 Z" fill="#fff" />
        <path d="M 46 68 A 4 2.5 0 0 0 54 68 Z" fill="#E62E2E" />

        {/* Ears and Earrings */}
        <path d="M 35 52 C 32 55, 32 60, 35 63" fill="#f0c08b" stroke="#000" strokeWidth="0.5"/>
        <circle cx="33" cy="58" r="3" fill="none" stroke="#FFD700" strokeWidth="1.5" />
        <path d="M 65 52 C 68 55, 68 60, 65 63" fill="#f0c08b" stroke="#000" strokeWidth="0.5"/>
        <circle cx="67" cy="58" r="3" fill="none" stroke="#FFD700" strokeWidth="1.5" />
        
        {/* Body */}
        <path d="M 30 70 L 25 95 L 75 95 L 70 70 Z" fill="#ffc107" />

        {/* Vest */}
        <path d="M 30 70 L 25 95 L 45 95 L 45 70 Z" fill="#46b8da" />
        <path d="M 70 70 L 75 95 L 55 95 L 55 70 Z" fill="#46b8da" />
        
        {/* Hands */}
        <path d="M 45 75 L 50 72 L 55 75 L 55 85 L 50 90 L 45 85 Z" fill="#f0c08b" />
        <path d="M 45 75 L 55 75 L 55 85 L 45 85 Z" stroke="#000" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
