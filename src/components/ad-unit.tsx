
'use client';

import { useEffect } from 'react';
import type { AdUnitProps } from '@/lib/types';
import { Card } from './ui/card';


declare global {
    interface Window {
        adsbygoogle: any;
    }
}

const AdUnit = ({ adSlot, adClient, adFormat = "auto", fullWidthResponsive = true }: AdUnitProps) => {
    useEffect(() => {
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
        <Card className="flex justify-center items-center p-4 my-4 min-h-[100px] bg-muted/50 w-full overflow-hidden">
             <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive.toString()}
             />
        </Card>
    );
};

export default AdUnit;
