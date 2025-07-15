
'use client';

import { useEffect, useRef } from 'react';
import type { AdUnitProps } from '@/lib/types';
import { Card } from './ui/card';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const AdUnit = ({ adSlot, adClient, adFormat = "auto", fullWidthResponsive = true }: AdUnitProps) => {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const adElement = adRef.current;
        if (!adElement) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect.width > 0) {
                    try {
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                        // Disconnect after the ad is pushed to avoid multiple pushes
                        resizeObserver.disconnect();
                    } catch (err) {
                        console.error('AdSense push error:', err);
                    }
                }
            }
        });
        
        resizeObserver.observe(adElement);

        return () => {
            if (adElement) {
                resizeObserver.unobserve(adElement);
            }
            resizeObserver.disconnect();
        };
    }, []);

    if (!adSlot || !adClient) {
        return null;
    }

    return (
        <Card ref={adRef} className="flex justify-center items-center p-4 my-4 min-h-[100px] bg-muted/50 w-full overflow-hidden">
             <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%' }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive.toString()}
                data-adtest={process.env.NODE_ENV === 'development' ? 'on' : 'off'}
             />
        </Card>
    );
};

export default AdUnit;
