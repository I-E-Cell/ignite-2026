import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { BackgroundLayer } from "@/components/BackgroundLayer";
import { Navbar } from "@/sections/Navbar";
import { Main } from "@/sections/Main";
import { Footer } from "@/sections/Footer";
import { IntroOverlay } from "@/components/IntroOverlay";
import { RegistrationPage } from "@/pages/RegistrationPage";
import { ShowcasePage } from "@/pages/ShowcasePage";
import { initSmoothScroll, getLenis } from "@/utils/smoothScroll";

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    initSmoothScroll();
  }, []);

  // Reset scroll on route changes
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="accent-auto box-border caret-transparent text-zinc-900 block text-[15px] not-italic normal-nums font-normal tracking-[-0.075px] leading-[23.23px] list-outside list-disc min-h-[1000px] outline-[3px] overflow-x-hidden overflow-y-auto overscroll-y-none pointer-events-auto relative text-start no-underline indent-[0px] normal-case visible border-separate font-dm_sans md:overscroll-y-auto before:accent-auto before:bg-stone-100 before:bg-[url('https://www.recursiveacm.in/images/bg/cloud.jpg')] before:bg-top before:bg-no-repeat before:bg-cover before:box-border before:caret-transparent before:text-zinc-900 before:block before:text-[15px] before:not-italic before:normal-nums before:font-normal before:tracking-[-0.075px] before:leading-[23.25px] before:list-outside before:list-disc before:outline-[3px] before:pointer-events-none before:fixed before:text-start before:no-underline before:indent-[0px] before:normal-case before:visible before:z-[-1] before:border-separate before:inset-0 before:font-dm_sans">
      {location.pathname === "/" && <IntroOverlay />}
      {location.pathname === "/" && <BackgroundLayer variant="thunder" />}
      <Navbar />
      <BackgroundLayer
        variant="image"
        layerClassName=""
        imageSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-1.svg"
        imageAlt="Icon"
        iframeSrc=""
        iframeTitle=""
      />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/submissions" element={<Navigate to="/showcase" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
      <BackgroundLayer
        variant=""
        layerClassName=""
        imageSrc=""
        imageAlt=""
        iframeSrc=""
        iframeTitle=""
      />
      <BackgroundLayer
        variant="default"
        layerClassName="block absolute"
        imageSrc=""
        imageAlt=""
        iframeSrc=""
        iframeTitle=""
      />
    </div>
  );
};

export default App;