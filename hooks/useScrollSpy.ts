
import React, { useEffect, useState, useRef } from 'react';

export const useScrollSpy = (sectionIds: string[]) => {
    const [activeId, setActiveId] = useState<string>('');
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { 
                rootMargin: '-10% 0px -60% 0px',
                threshold: 0
            }
        );

        sectionIds.forEach(id => {
            const element = document.getElementById(id);
            if (element && observerRef.current) {
                observerRef.current.observe(element);
            }
        });

        return () => observerRef.current?.disconnect();
    }, [sectionIds]);

    return activeId;
};

export const useAutoScrollToActive = (activeId: string, containerRef: React.RefObject<HTMLDivElement>) => {
    useEffect(() => {
        if (activeId && containerRef.current) {
            const activeItem = document.getElementById(`summary-item-${activeId}`);
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [activeId, containerRef]);
};