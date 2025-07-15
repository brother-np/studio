
'use client';

import { useEffect, useRef } from 'react';
import type { AdUnitProps } from '@/lib/types';
import { Card } from './ui/card';


declare global {
    interface Window {
        adsbygoogle: any;
    }
}

const AdUnit = ({ adSlot, adClient, adFormat = "auto", fullWidthResponsive = true }: AdUnitProps) => {
    const adRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (adRef.current && adRef.current.offsetWidth === 0) {
            console.warn('Ad container has no width, ad will not be displayed.');
            return;
        }
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    if (!adSlot || !adClient) {
        return null;
    }

    return (
        <Card ref={adRef} className="flex justify-center items-center p-4 my-4 min-h-[100px] bg-muted/50 w-full">
             <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%' }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive.toString()}
             />
        </Card>
    );
};

export default AdUnit;
