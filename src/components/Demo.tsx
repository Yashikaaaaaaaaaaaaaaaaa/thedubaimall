import { useState, useEffect } from 'react';
import { ShoppingBag, Twitter, Instagram, Facebook, Youtube } from 'lucide-react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import FeatureCarousel from '@/components/ui/feature-carousel';
import { Logos3 } from '@/components/ui/logos3';
import { ArgentLoopInfiniteSlider } from '@/components/ui/argent-loop-infinite-slider';
import { Footer } from '@/components/ui/footer';

const logoData = {
  heading: "RETAIL & BRAND ECOSYSTEM",
  logos: [
    {
      id: "logo-1",
      description: "Astro",
      image: "https://www.logo.wine/a/logo/Balenciaga/Balenciaga-Logo.wine.svg",
      className: "h-40 w-auto",
    },
    {
      id: "logo-2",
      description: "Figma",
      image: "https://www.logo.wine/a/logo/Gucci/Gucci-Logo.wine.svg",
      className: "h-40 w-auto",
    },
    {
      id: "logo-3",
      description: "Next.js",
      image: "https://www.logo.wine/a/logo/Nike,_Inc./Nike,_Inc.-Logo.wine.svg",
      className: "h-40 w-auto",
    },
    {
      id: "logo-4",
      description: "React",
      image: "https://www.logo.wine/a/logo/Adidas/Adidas-Logo.wine.svg",
      className: "h-40 w-auto",
    },
    {
      id: "logo-5",
      description: "shadcn/ui",
      image: "https://www.logo.wine/a/logo/Fendi/Fendi-Logo.wine.svg",
      className: "h-30 w-auto",
    },
    {
      id: "logo-6",
      description: "Supabase",
      image: "https://www.logo.wine/a/logo/Christian_Dior_(fashion_house)/Christian_Dior_(fashion_house)-Logo.wine.svg",
      className: "h-30 w-auto",
    },
    {
      id: "logo-7",
      description: "Tailwind CSS",
      image: "https://www.logo.wine/a/logo/Armani/Armani-Logo.wine.svg",
      className: "h-30 w-auto",
    },
    {
      id: "logo-8",
      description: "Vercel",
      image: "https://www.logo.wine/a/logo/Ralph_Lauren_Corporation/Ralph_Lauren_Corporation-Logo.wine.svg",
      className: "h-30 w-auto",
    },
  ],
};

interface MediaContent {
  src: string;
  poster?: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
}

interface MediaContentCollection {
  [key: string]: MediaContent;
}

const sampleMediaContent: MediaContentCollection = {
  video: {
    // Using a high-quality stock video URL
    src: 'https://www.pexels.com/download/video/34529189/',
    poster:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1280&auto=format&fit=crop',
    background:
      'https://media.cnn.com/api/v1/images/stellar/prod/240605131819-dubai-mall-expansion-2024-1.jpg?c=original',
    title: 'Global Retail Power',
    date: 'Built for brands that lead.',
    scrollToExpand: '→ Explore',
  }
};

const Demo = () => {
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const currentMedia = sampleMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, [mediaType]);

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='fixed top-4 right-4 z-50 flex gap-2'>
        <button
          onClick={() => setMediaType('video')}
          className={`px-4 py-2 rounded-lg transition-all ${
            mediaType === 'video'
              ? 'bg-white text-black shadow-lg'
              : 'bg-black/50 text-white border border-white/30 backdrop-blur-sm'
          }`}
        >
          Video
        </button>

        <button
          onClick={() => setMediaType('image')}
          className={`px-4 py-2 rounded-lg transition-all ${
            mediaType === 'image'
              ? 'bg-white text-black shadow-lg'
              : 'bg-black/50 text-white border border-white/30 backdrop-blur-sm'
          }`}
        >
          Image
        </button>
      </div>

      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        posterSrc={mediaType === 'video' ? currentMedia.poster : undefined}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
      >
        <div className="pt-20">
          <FeatureCarousel />
          <Logos3 {...logoData} />
          <ArgentLoopInfiniteSlider 
            footer={
              <Footer
                logo={<ShoppingBag className="h-8 w-8 text-primary" />}
                brandName="Dubai Mall"
                socialLinks={[
                  { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
                  { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
                  { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
                  { icon: <Youtube className="h-5 w-5" />, href: "#", label: "YouTube" },
                ]}
                mainLinks={[
                  { href: "#", label: "Fashion Avenue" },
                  { href: "#", label: "The Aquarium" },
                  { href: "#", label: "Ice Rink" },
                  { href: "#", label: "VR Park" },
                  { href: "#", label: "Dining" },
                ]}
                legalLinks={[
                  { href: "#", label: "Privacy Policy" },
                  { href: "#", label: "Terms of Service" },
                  { href: "#", label: "Cookie Policy" },
                ]}
                copyright={{
                  text: "© 2025 Dubai Mall. All rights reserved.",
                  license: "A property of Emaar",
                }}
              />
            }
          />
        </div>
      </ScrollExpandMedia>
    </div>
  );
};

export default Demo;
