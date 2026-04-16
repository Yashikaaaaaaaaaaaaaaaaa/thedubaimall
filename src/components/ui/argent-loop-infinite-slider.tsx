import * as React from "react";

interface ProjectData {
  title: string;
  image: string;
  category: string;
  year: string;
  description: string;
}

const PROJECT_DATA: ProjectData[] = [
  {
    title: "Fashion Avenue",
    image: "https://assets.vogue.in/photos/5ce41de67a66d260e6e75a5c/master/pass/Why-every-fashion-girls-needs-to-have-Dubai-Mall-on-her-radar-featured.jpg",
    category: "Luxury Retail",
    year: "2025",
    description: "The world's largest luxury flagship destination.",
  },
  {
    title: "The Aquarium",
    image: "https://images.unsplash.com/photo-1512391806023-e43a4e65899f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWklMjBhcXVhcml1bXxlbnwwfHwwfHx8MA%3D%3D",
    category: "Entertainment",
    year: "2025",
    description: "A window into the wonders of the ocean.",
  },
  {
    title: "Dubai Ice Rink",
    image: "https://kidzapp.com/_next/image?url=https%3A%2F%2Fd1snrxh3s61e7p.cloudfront.net%2Fmedia%2Fvenues%2F2895280e-6e20-465e-b31c-f39df81f6f31%2Fdubai-ice-rink-at-dubai-mall.webp&w=1440&q=40",
    category: "Lifestyle",
    year: "2025",
    description: "Olympic-sized skating experience.",
  },
  {
    title: "VR Park",
    image: "https://res.klook.com/images/w_1200,h_630,c_fill,q_65/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/puo88ijw13gowh8resjh/PlayDXB-DubaiMallVRPark-KlookIndia.jpg",
    category: "Technology",
    year: "2025",
    description: "Challenge reality in the ultimate VR destination.",
  },
  {
    title: "The Waterfall",
    image: "https://www.traveltodubai.ae/wp-content/uploads/2025/07/image-1200x852-28.png",
    category: "Iconic Landmark",
    year: "2025",
    description: "A stunning four-story indoor waterfall.",
  },
];

const CONFIG = {
  SCROLL_SPEED: 0.75,
  LERP_FACTOR: 0.05,
  BUFFER_SIZE: 5,
  MAX_VELOCITY: 150,
  SNAP_DURATION: 500,
};

// Utility functions
const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

const getProjectData = (index: number) => {
  const i =
    ((Math.abs(index) % PROJECT_DATA.length) + PROJECT_DATA.length) %
    PROJECT_DATA.length;
  return PROJECT_DATA[i];
};

const getProjectNumber = (index: number) => {
  return (
    ((Math.abs(index) % PROJECT_DATA.length) + PROJECT_DATA.length) %
      PROJECT_DATA.length +
    1
  )
    .toString()
    .padStart(2, "0");
};

export function ArgentLoopInfiniteSlider({ footer }: { footer?: React.ReactNode }) {
  // Refs for state that changes frequently (animation loop)
  const state = React.useRef({
    currentY: 0,
    targetY: 0,
    isDragging: false,
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
    dragStart: { y: 0, scrollY: 0 },
    projectHeight: 0, // Will be set on mount
    minimapHeight: 250, // Fixed height from CSS
  });

  // Refs to store DOM elements
  const projectsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const minimapRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const infoRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const footerRef = React.useRef<HTMLDivElement>(null);
  const minimapWrapperRef = React.useRef<HTMLDivElement>(null);
  const requestRef = React.useRef<number>();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Helper to update parallax for a single item
  const updateParallax = (
    img: HTMLImageElement | null,
    scroll: number,
    index: number,
    height: number
  ) => {
    if (!img) return;
    
    if (!img.dataset.parallaxCurrent) {
      img.dataset.parallaxCurrent = "0";
    }
    
    let current = parseFloat(img.dataset.parallaxCurrent);
    const target = (-scroll - index * height) * 0.2;
    current = lerp(current, target, 0.1);
    
    if (Math.abs(current - target) > 0.01) {
        img.style.transform = `translateY(${current}px) scale(1.5)`;
        img.dataset.parallaxCurrent = current.toString();
    }
  };

  const updateSnap = () => {
    const s = state.current;
    const progress = Math.min(
      (Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION,
      1
    );
    const eased = 1 - Math.pow(1 - progress, 3);
    s.targetY =
      s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased;
    if (progress >= 1) s.isSnapping = false;
  };

  const snapToProject = () => {
    const s = state.current;
    const current = Math.round(-s.targetY / s.projectHeight);
    const target = -current * s.projectHeight;
    s.isSnapping = true;
    s.snapStart = {
      time: Date.now(),
      y: s.targetY,
      target: target,
    };
  };

  const updatePositions = () => {
    const s = state.current;
    const minimapY = (s.currentY * s.minimapHeight) / s.projectHeight;

    // Update Projects
    projectsRef.current.forEach((el, index) => {
      const y = index * s.projectHeight + s.currentY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      updateParallax(img, s.currentY, index, s.projectHeight);
    });

    // Update Minimap Images
    minimapRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      if (img) {
          updateParallax(img, minimapY, index, s.minimapHeight);
      }
    });

    // Update Info
    infoRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
    });

    // Update Footer
    if (footerRef.current) {
      const y = PROJECT_DATA.length * s.projectHeight + s.currentY;
      footerRef.current.style.transform = `translateY(${y}px)`;
    }

    // Fade out minimap when approaching footer
    if (minimapWrapperRef.current) {
      const progressToFooter = -s.currentY / (PROJECT_DATA.length * s.projectHeight);
      const opacity = Math.max(0, 1 - (progressToFooter - 0.8) * 5);
      minimapWrapperRef.current.style.opacity = opacity.toString();
      minimapWrapperRef.current.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
    }
  };

  const animate = () => {
    const s = state.current;
    const now = Date.now();

    if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 100) {
      const snapPoint =
        -Math.round(-s.targetY / s.projectHeight) * s.projectHeight;
      if (Math.abs(s.targetY - snapPoint) > 1) snapToProject();
    }

    if (s.isSnapping) updateSnap();
    if (!s.isDragging) {
      s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR;
    }

    updatePositions();
  };
  
  const animationLoop = () => {
     animate();
     requestRef.current = requestAnimationFrame(animationLoop);
  };

  React.useEffect(() => {
    state.current.projectHeight = window.innerHeight;
    state.current.targetY = 0;
    state.current.currentY = 0;
    
    const onWheel = (e: WheelEvent) => {
      const s = state.current;
      const minY = 0;
      const maxY = -PROJECT_DATA.length * s.projectHeight;

      // Check if we should capture the scroll
      const isAtTop = s.targetY >= minY - 1;
      const isAtBottom = s.targetY <= maxY + 1;
      const scrollingUp = e.deltaY < 0;
      const scrollingDown = e.deltaY > 0;

      if ((isAtTop && scrollingUp) || (isAtBottom && scrollingDown)) {
        // Let the page scroll
        return;
      }

      // Capture scroll
      e.preventDefault();
      s.isSnapping = false;
      s.lastScrollTime = Date.now();
      const delta = Math.max(
        Math.min(e.deltaY * CONFIG.SCROLL_SPEED, CONFIG.MAX_VELOCITY),
        -CONFIG.MAX_VELOCITY
      );
      
      s.targetY = Math.max(maxY, Math.min(minY, s.targetY - delta));
    };

    const onTouchStart = (e: TouchEvent) => {
        const s = state.current;
        s.isDragging = true;
        s.isSnapping = false;
        s.dragStart = { y: e.touches[0].clientY, scrollY: s.targetY };
        s.lastScrollTime = Date.now();
    }

    const onTouchMove = (e: TouchEvent) => {
        const s = state.current;
        if (!s.isDragging) return;
        
        const minY = 0;
        const maxY = -PROJECT_DATA.length * s.projectHeight;
        
        const newTargetY = s.dragStart.scrollY + (e.touches[0].clientY - s.dragStart.y) * 1.5;
        s.targetY = Math.max(maxY, Math.min(minY, newTargetY));
        s.lastScrollTime = Date.now();
    }

    const onTouchEnd = () => {
        state.current.isDragging = false;
    }

    const onResize = () => {
        state.current.projectHeight = window.innerHeight;
        const container = containerRef.current;
        if (container) {
            container.style.height = `${window.innerHeight}px`;
        }
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);
    
    onResize();
    requestRef.current = requestAnimationFrame(animationLoop);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="parallax-container relative w-full h-screen overflow-hidden bg-black text-white">
      <ul className="project-list absolute inset-0 list-none p-0 m-0">
        {PROJECT_DATA.map((data, i) => {
          return (
            <div
              key={i}
              className="project absolute inset-0 w-full h-full overflow-hidden"
              ref={(el) => {
                if (el) projectsRef.current.set(i, el);
                else projectsRef.current.delete(i);
              }}
            >
              <img src={data.image} alt={data.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
          );
        })}
      </ul>

      {footer && (
        <div 
          ref={footerRef}
          className="absolute inset-0 w-full h-full flex flex-col justify-end bg-background"
        >
          {footer}
        </div>
      )}

      <div ref={minimapWrapperRef} className="minimap absolute right-8 top-1/2 -translate-y-1/2 z-50 w-64 md:w-80 pointer-events-none transition-opacity duration-300">
        <div className="minimap-wrapper relative h-[250px] overflow-hidden">
          <div className="minimap-img-preview absolute left-0 top-0 w-1/2 h-full overflow-hidden border border-white/20">
            {PROJECT_DATA.map((data, i) => {
              return (
                <div
                  key={i}
                  className="minimap-img-item absolute inset-0 w-full h-full overflow-hidden"
                  ref={(el) => {
                    if (el) minimapRef.current.set(i, el);
                    else minimapRef.current.delete(i);
                  }}
                >
                  <img src={data.image} alt={data.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              );
            })}
          </div>
          <div className="minimap-info-list absolute right-0 top-0 w-1/2 h-full overflow-hidden">
            {PROJECT_DATA.map((data, i) => {
              const num = (i + 1).toString().padStart(2, "0");
              return (
                <div
                  key={i}
                  className="minimap-item-info absolute inset-0 w-full h-full flex flex-col justify-center px-4 text-[10px] uppercase tracking-widest leading-relaxed"
                  ref={(el) => {
                    if (el) infoRef.current.set(i, el);
                    else infoRef.current.delete(i);
                  }}
                >
                  <div className="minimap-item-info-row flex justify-between mb-1">
                    <p className="opacity-50">{num}</p>
                    <p className="font-bold">{data.title}</p>
                  </div>
                  <div className="minimap-item-info-row flex justify-between mb-1">
                    <p className="opacity-50">{data.category}</p>
                    <p className="opacity-50">{data.year}</p>
                  </div>
                  <div className="minimap-item-info-row">
                    <p className="opacity-70">{data.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
