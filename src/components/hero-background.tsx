
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const images = [
    { src: 'https://picsum.photos/seed/indian-craft-1/1920/1080', hint: 'indian pottery' },
    { src: 'https://picsum.photos/seed/indian-life-1/1920/1080', hint: 'indian market' },
    { src: 'https://picsum.photos/seed/indian-craft-2/1920/1080', hint: 'weaving loom' },
    { src: 'https://picsum.photos/seed/indian-life-2/1920/1080', hint: 'holi festival' },
];

const TRANSITION_DURATION = 1500; // 1.5 seconds for fade
const HOLD_DURATION = 5000; // 5 seconds per image

export function HeroBackground() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, HOLD_DURATION);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {images.map((image, index) => (
                <div
                    key={image.src}
                    className={cn(
                        'absolute inset-0 w-full h-full transition-opacity duration-[${TRANSITION_DURATION}ms] ease-in-out',
                        index === currentIndex ? 'opacity-20' : 'opacity-0'
                    )}
                    style={{ transitionDuration: `${TRANSITION_DURATION}ms`}}
                >
                    <Image
                        src={image.src}
                        alt="Background of an artisan working"
                        fill
                        className={cn(
                            'object-cover transition-transform ease-in-out',
                            index === currentIndex ? 'scale-105' : 'scale-100'
                        )}
                        style={{ transitionDuration: `${HOLD_DURATION + TRANSITION_DURATION}ms`}}
                        data-ai-hint={image.hint}
                        priority={index === 0}
                    />
                </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        </div>
    );
}
