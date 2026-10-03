import { useEffect, useRef } from "react";

export const HeroMedia = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {
          // Autoplay policy fallback
        });
      }
    };

    playVideo();
    window.addEventListener("recursive-intro-done", playVideo);
    window.addEventListener("pointerdown", playVideo, { once: true });
    window.addEventListener("scroll", playVideo, { once: true });

    return () => {
      window.removeEventListener("recursive-intro-done", playVideo);
      window.removeEventListener("pointerdown", playVideo);
      window.removeEventListener("scroll", playVideo);
    };
  }, []);

  return (
    <div className="hero-video-wrap">
      <img
        src="https://www.recursiveacm.in/images/hero/hero_poster_v3.jpg"
        alt="The Chair on the Hill"
        aria-hidden="true"
        draggable="false"
        className="hero-video hero-poster"
      />

      <video
        ref={videoRef}
        src="https://www.recursiveacm.in/bg/hero_loop_pp.mp4"
        poster="https://www.recursiveacm.in/images/hero/hero_poster_v3.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="hero-video"
      />



      <style>{`
        .hero-video-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          pointer-events: none;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};