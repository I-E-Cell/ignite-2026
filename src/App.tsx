import { useEffect } from "react";
import { BackgroundLayer } from "@/components/BackgroundLayer";
import { Navbar } from "@/sections/Navbar";
import { Main } from "@/sections/Main";
import { Footer } from "@/sections/Footer";
import { IntroOverlay } from "@/components/IntroOverlay";
import { initSmoothScroll } from "@/utils/smoothScroll";

export const App = () => {
  useEffect(() => {
    initSmoothScroll();
  }, []);
  return (
    <div className="accent-auto box-border caret-transparent text-zinc-900 block text-[15px] not-italic normal-nums font-normal tracking-[-0.075px] leading-[23.23px] list-outside list-disc min-h-[1000px] outline-[3px] overflow-x-hidden overflow-y-auto overscroll-y-none pointer-events-auto relative text-start no-underline indent-[0px] normal-case visible border-separate font-dm_sans md:overscroll-y-auto before:accent-auto before:bg-stone-100 before:bg-[url('https://www.recursiveacm.in/images/bg/cloud.jpg')] before:bg-top before:bg-no-repeat before:bg-cover before:box-border before:caret-transparent before:text-zinc-900 before:block before:text-[15px] before:not-italic before:normal-nums before:font-normal before:tracking-[-0.075px] before:leading-[23.25px] before:list-outside before:list-disc before:outline-[3px] before:pointer-events-none before:fixed before:text-start before:no-underline before:indent-[0px] before:normal-case before:visible before:z-[-1] before:border-separate before:inset-0 before:font-dm_sans">
      <IntroOverlay />
      <BackgroundLayer
        variant="default"
        layerClassName="hidden"
        imageSrc=""
        imageAlt=""
        iframeSrc=""
        iframeTitle=""
      />
      <BackgroundLayer
        variant="default"
        layerClassName="bg-stone-100 bg-[url('https://www.recursiveacm.in/images/bg/cloud.jpg')] bg-top bg-no-repeat bg-cover content-[''] pointer-events-none fixed z-[-1] inset-0"
        imageSrc=""
        imageAlt=""
        iframeSrc=""
        iframeTitle=""
      />
      <Navbar />
      <BackgroundLayer
        variant="image"
        layerClassName=""
        imageSrc="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-1.svg"
        imageAlt="Icon"
        iframeSrc=""
        iframeTitle=""
      />
      <Main />
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
      <BackgroundLayer
        variant="iframe"
        layerClassName="hidden h-full fixed w-full z-[2147483647] left-0 top-0"
        imageSrc=""
        imageAlt=""
        iframeSrc="https://apply.devfolio.co/v2/overlay"
        iframeTitle="Continue your hackathon application"
      />
    </div>
  );
};

export default App;