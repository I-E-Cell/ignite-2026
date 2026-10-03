export type SectionHeaderProps = {
  variant: string;
  title?: string;
  titleLineOne?: string;
  titleLineTwo?: string;
  eyebrow?: string;
  description?: string;
  descriptionWords?: string[];
  rootClassName?: string;
  artifactWrapperClassName?: string;
  artifactInnerClassName?: string;
  titleClassName?: string;
  titleOuterSpanClassName?: string;
  titleInnerSpanClassName?: string;
  descriptionWrapperClassName?: string;
  descriptionInnerClassName?: string;
  descriptionClassName?: string;
  eventLabel?: string;
  eventDate?: string;
  eventDetails?: string;
  daysTens?: string;
  daysOnes?: string;
  hoursTens?: string;
  hoursOnes?: string;
  minutesTens?: string;
  minutesOnes?: string;
  secondsTens?: string;
  secondsOnes?: string;
  countdownSummary?: string;
};

export const SectionHeader = (props: SectionHeaderProps) => {
  const artifactUrl =
    "https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/artifact.png";

  const renderWords = (
    words: string[] | undefined,
    outerClassName: string,
    innerClassName: string,
  ) => {
    return (words ?? []).map((word, index) => (
      <span className={outerClassName} key={`${word}-${index}`}>
        <span className={innerClassName}>{word}</span>
      </span>
    ));
  };

  const renderDigit = (digit: string) => {
    return (
      <span className="box-border caret-transparent block h-[103.838px] min-h-[auto] min-w-[auto] outline-[3px] relative no-underline w-[73.125px] md:h-[149.043px] md:w-[104.96px]">
        <span className="bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(16,32,14,0)_100%)] box-border caret-transparent block isolate outline-[3px] absolute no-underline overflow-hidden rounded-[10.2375px] inset-0 md:rounded-[14.6944px]">
          <span className="items-center text-stone-100 block caret-transparent flex h-[3/6] justify-center outline-[3px] absolute no-underline overflow-hidden rounded-[10.2375px] inset-0 md:rounded-[14.6944px]">
            <b className="box-border caret-transparent text-stone-100 block text-[77.5125px] tabular-nums h-[103.838px] tracking-[-0.775125px] leading-[103.838px] min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full font-bebasNeue md:text-[111.258px] md:h-[149.043px] md:tracking-[-1.11258px] md:leading-[149.043px]">
              {digit}
            </b>
          </span>

          <span className="items-end bg-[linear-gradient(rgb(30,50,24)_0%,rgb(22,36,15)_100%)] shadow-[rgba(0,0,0,0.5)_0px_1px_0px_0px_inset] box-border caret-transparent flex h-3/6 justify-center outline-[3px] absolute no-underline overflow-hidden rounded-b-[10.2375px] bottom-0 inset-x-0 md:rounded-b-[14.6944px]">
            <b className="box-border caret-transparent text-stone-100 block text-[77.5125px] tabular-nums h-[103.838px] tracking-[-0.775125px] leading-[103.838px] min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full font-bebasNeue md:text-[111.258px] md:h-[149.043px] md:tracking-[-1.11258px] md:leading-[149.043px]">
              {digit}
            </b>
          </span>

          <span className="bg-black/60 shadow-[rgba(240,240,200,0.09)_0px_1px_0px_0px] box-border caret-transparent block h-px outline-[3px] pointer-events-none absolute no-underline translate-y-[-0.5px] z-[7] top-2/4 inset-x-0" />

          <span className="bg-[linear-gradient(103deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.03)_26%,rgba(255,255,255,0)_48%)] shadow-[rgba(255,255,255,0.08)_0px_0px_0px_1px_inset] box-border caret-transparent block outline-[3px] pointer-events-none absolute no-underline z-[-8] rounded-[10.2375px] inset-0 md:rounded-[14.6944px]" />
        </span>
      </span>
    );
  };

  const renderCountdownUnit = (
    firstDigit: string,
    secondDigit: string,
    label: string,
    separatorClassName?: string,
    dotClassName?: string,
  ) => {
    return (
      <div className="items-center box-border caret-transparent gap-x-[17.55px] flex flex-col min-h-[auto] min-w-[auto] outline-[3px] relative gap-y-[17.55px] no-underline md:gap-x-[25.1904px] md:gap-y-[25.1904px]">
        <div className="box-border caret-transparent flex gap-x-[8.04375px] flex h-[auto] min-h-[auto] outline-[3px] gap-y-[8.04375px] no-underline md:gap-x-[11.5456px] md:gap-y-[11.5456px]">
          {renderDigit(firstDigit)}
          {renderDigit(secondDigit)}
        </div>

        <span className="box-border caret-transparent text-neutral-800 block text-[10.88px] font-medium tracking-[1.7408px] leading-[16.864px] min-h-[auto] min-w-[auto] outline-[3px] no-underline uppercase pl-[2.6112px] font-geist_mono md:text-[12.8px] md:tracking-[3.072px] md:leading-[19.84px] md:pl-[3.072px]">
          {label}
        </span>

        {separatorClassName && dotClassName ? (
          <span className={separatorClassName}>
            <i className={dotClassName}></i>
            <i className={dotClassName}></i>
          </span>
        ) : null}
      </div>
    );
  };

  if (props.variant === "artifactOnly") {
    return (
      <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline">
        <div className="box-border caret-transparent outline-[3px] no-underline flex justify-center mb-5">
          <img
            src={artifactUrl}
            alt=""
            className="box-border caret-transparent max-w-full min-h-[auto] min-w-[auto] object-contain opacity-[0.88] outline-[3px] pointer-events-none no-underline w-[116.382px] md:w-[260px]"
          />
        </div>
      </div>
    );
  }

  if (props.variant === "tracks") {
    return (
      <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full scroll-mt-[88px]">
        <div className="box-border caret-transparent outline-[3px] no-underline">
          <span className="box-border caret-transparent text-lime-400 text-[11.52px] font-medium tracking-[2.304px] leading-[17.856px] outline-[3px] no-underline uppercase font-geist_mono">
            {props.eyebrow}
          </span>
        </div>

        <h2 className="box-border caret-transparent font-medium outline-[3px] no-underline font-headingNow text-lime-50 text-[35.2px] tracking-[-1.232px] leading-[39.424px] mt-[11.2px] md:text-[57.6px] md:tracking-[-2.016px] md:leading-[64.512px] md:mb-[-5.184px] md:pb-[-5.184px]">
          <span className="box-border caret-transparent outline-[3px] no-underline overflow-hidden flex text-[35.2px] justify-center tracking-[-1.232px] leading-[39.424px] mb-[-3.168px] pb-[-3.168px] md:text-[57.6px] md:tracking-[-2.016px] md:leading-[64.512px] md:mb-[-5.184px] md:pb-[-5.184px]">
            <span className="box-border caret-transparent block text-[35.2px] tracking-[-1.232px] leading-[39.424px] min-h-[auto] min-w-[auto] outline-[3px] no-underline md:text-[57.6px] md:tracking-[-2.016px] md:leading-[64.512px]">
              {props.titleLineOne}
            </span>
          </span>

          <span className="box-border caret-transparent flex text-[35.2px] justify-center tracking-[-1.232px] leading-[39.424px] mb-[-3.168px] outline-[3px] no-underline overflow-hidden pb-[-3.168px] md:text-[57.6px] md:tracking-[-2.016px] md:leading-[64.512px] md:mb-[-5.184px] md:pb-[-5.184px]">
            <span className="box-border caret-transparent block text-[35.2px] tracking-[-1.232px] leading-[39.424px] min-h-[auto] min-w-[auto] outline-[3px] no-underline md:text-[57.6px] md:tracking-[-2.016px] md:leading-[64.512px]">
              {props.titleLineTwo}
            </span>
          </span>
        </h2>

        <div className="box-border caret-transparent outline-[3px] no-underline max-w-[704px] mt-[18px] mx-auto">
          <div className="box-border caret-transparent gap-x-[30px] flex flex-col outline-[3px] gap-y-[30px] no-underline">
            <p className="box-border caret-transparent text-stone-200/90 text-base tracking-[-0.192px] leading-[25.92px] min-h-[auto] min-w-[auto] outline-[3px] no-underline font-dm_sans md:text-[18.56px] md:tracking-[-0.22272px] md:leading-[30.0672px]">
              {renderWords(
                props.descriptionWords,
                "box-border caret-transparent text-base tracking-[-0.192px] leading-[25.92px] outline-[3px] no-underline md:text-[18.56px] md:tracking-[-0.22272px] md:leading-[30.0672px]",
                "box-border caret-transparent inline-block text-base tracking-[-0.192px] leading-[25.92px] opacity-[0.18] outline-[3px] no-underline translate-y-1 md:text-[18.56px] md:tracking-[-0.22272px] md:leading-[30.0672px]",
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (props.variant === "mentors") {
    return (
      <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full">
        <div className="box-border caret-transparent outline-[3px] no-underline">
          <span className="box-border caret-transparent text-lime-400 text-[11.52px] font-medium tracking-[2.304px] leading-[17.856px] outline-[3px] no-underline uppercase font-geist_mono">
            {props.eyebrow}
          </span>
        </div>

        <h2 className="box-border caret-transparent font-medium outline-[3px] no-underline font-headingNow text-lime-50 text-[35.2px] tracking-[-1.232px] leading-[40.48px] mt-[11.2px] md:text-[57.6px] md:tracking-[-2.016px] md:leading-[66.24px]">
          <span className="box-border caret-transparent outline-[3px] no-underline overflow-hidden flex text-[35.2px] justify-center tracking-[-1.232px] leading-[40.48px] mb-[-3.168px] pb-[-3.168px] md:text-[57.6px] md:tracking-[-2.016px] md:leading-[66.24px] md:mb-[-5.184px] md:pb-[-5.184px]">
            <span className="box-border caret-transparent block outline-[3px] no-underline text-[35.2px] tracking-[-1.232px] leading-[40.48px] min-h-[auto] min-w-[auto] md:text-[57.6px] md:tracking-[-2.016px] md:leading-[66.24px]">
              {props.title}
            </span>
          </span>
        </h2>

        <div className="box-border caret-transparent outline-[3px] no-underline">
          <p className="box-border caret-transparent text-stone-200/60 text-base leading-[25.92px] max-w-[704px] outline-[3px] no-underline mt-[18px] mx-auto font-dm_sans md:text-[18.4px] md:leading-[29.808px]">
            {props.description}
          </p>
        </div>
      </div>
    );
  }

  if (props.variant === "faq") {
    return (
      <div className="box-border caret-transparent outline-[3px] no-underline items-center flex flex-col justify-center min-h-[auto] min-w-[auto] text-center w-full mb-[28.8px] md:mb-[57.6px]">
        <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline">
          <div className="box-border caret-transparent flex justify-center outline-[3px] no-underline items-center mb-3 md:mb-5">
            <img
              src={artifactUrl}
              alt=""
              className="box-border caret-transparent max-w-full min-h-[auto] min-w-[auto] object-contain opacity-[0.88] outline-[3px] pointer-events-none no-underline w-[116.382px] md:w-[260px]"
            />
          </div>
        </div>

        <h2 className="box-border caret-transparent font-medium outline-[3px] no-underline font-headingNow text-neutral-900 text-[41.6px] tracking-[-1.456px] leading-[45.76px] min-h-[auto] min-w-[auto] uppercase md:text-[73.6px] md:tracking-[-2.576px] md:leading-[80.96px]">
          <span className="box-border caret-transparent outline-[3px] no-underline overflow-hidden flex text-[41.6px] justify-center tracking-[-1.456px] leading-[45.76px] mb-[-3.744px] pb-[-3.744px] md:text-[73.6px] md:tracking-[-2.576px] md:leading-[80.96px]">
            <span className="box-border caret-transparent block outline-[3px] no-underline text-[41.6px] tracking-[-1.456px] leading-[45.76px] min-h-[auto] min-w-[auto] md:text-[73.6px] md:tracking-[-2.576px] md:leading-[80.96px]">
              {props.title}
            </span>
          </span>
        </h2>
      </div>
    );
  }

  if (props.variant === "venue") {
    return (
      <div className="box-border caret-transparent outline-[3px] no-underline items-center flex flex-col min-h-[auto] min-w-[auto] mb-8 md:mb-[38.4px]">
        <div className="box-border caret-transparent outline-[3px] no-underline min-h-[auto] min-w-[auto] opacity-100 md:opacity-0 md:translate-y-[-3.5px]">
          <div className="box-border caret-transparent flex justify-center outline-[3px] no-underline items-center mb-4">
            <img
              src={artifactUrl}
              alt=""
              className="box-border caret-transparent max-w-full min-h-[auto] min-w-[auto] object-contain opacity-[0.88] outline-[3px] pointer-events-none no-underline w-[116.382px] md:w-[260px]"
            />
          </div>
        </div>

        <div className="box-border caret-transparent outline-[3px] no-underline min-h-[auto] min-w-[auto] opacity-100 transform-none md:opacity-0 md:translate-y-[-2.5px]">
          <span className="box-border caret-transparent text-green-200/60 text-[12.4px] font-semibold tracking-[2.48px] leading-[19.22px] outline-[3px] no-underline uppercase mb-[13.6px] font-geist_mono">
            {props.eyebrow}
          </span>
        </div>

        <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline max-w-[928px] text-center mx-auto">
          <h2 className="box-border caret-transparent text-neutral-900 text-[38.4px] font-medium tracking-[-1.344px] leading-[42.24px] outline-[3px] no-underline font-headingNow md:text-[66.56px] md:tracking-[-2.3296px] md:leading-[73.216px]">
            <span className="box-border caret-transparent flex text-[38.4px] justify-center flex text-[38.4px] tracking-[-1.344px] leading-[42.24px] mb-[-3.456px] outline-[3px] no-underline overflow-hidden pb-[-3.456px] md:text-[66.56px] md:tracking-[-2.3296px] md:leading-[73.216px] md:mb-[-5.9904px] md:pb-[-5.9904px]">
              <span className="box-border caret-transparent block text-[38.4px] tracking-[-1.344px] leading-[42.24px] min-h-[auto] min-w-[auto] outline-[3px] no-underline transform-none md:text-[66.56px] md:tracking-[-2.3296px] md:leading-[73.216px] md:translate-y-[-112.0%]">
                {props.titleLineOne}
              </span>
            </span>

            <span className="box-border caret-transparent flex text-[38.4px] justify-center tracking-[-1.344px] leading-[42.24px] mb-[-3.456px] outline-[3px] no-underline overflow-hidden pb-[-3.456px] md:text-[66.56px] md:tracking-[-2.3296px] md:leading-[73.216px]">
              <span className="box-border caret-transparent block text-[38.4px] tracking-[-1.344px] leading-[42.24px] min-h-[auto] min-w-[auto] outline-[3px] no-underline transform-none md:text-[66.56px] md:tracking-[-2.3296px] md:leading-[73.216px] md:translate-y-[-112.0%]">
                {props.titleLineTwo}
              </span>
            </span>
          </h2>

          <p className="box-border caret-transparent text-zinc-600 text-[15.2px] tracking-[-0.152px] leading-[23.56px] max-w-[704px] outline-[3px] no-underline mt-4 mx-auto font-dm_sans md:text-[16.84px] md:tracking-[-0.1684px] md:leading-[26.102px]">
            {props.description}
          </p>
        </div>
      </div>
    );
  }

  if (props.variant === "organizersEyebrow") {
    return (
      <div className="box-border caret-transparent outline-[3px] no-underline min-h-[auto] min-w-[auto] opacity-0 translate-y-[-3px]">
        <span className="box-border caret-transparent text-lime-700 inline-block text-[10.88px] font-medium tracking-[2.6112px] leading-[16.864px] opacity-90 outline-[3px] no-underline uppercase font-geist_mono md:text-[12.8px] md:tracking-[3.072px] md:leading-[19.84px]">
          {props.eyebrow}
        </span>
      </div>
    );
  }

  if (props.variant === "organizersTitle") {
    return (
      <div className="box-border caret-transparent outline-[3px] no-underline max-w-[184.681px] min-h-[auto] min-w-[auto] mt-4 md:max-w-full">
        <h2 className="box-border caret-transparent font-medium outline-[3px] no-underline font-headingNow text-zinc-900 text-[28px] tracking-[-0.98px] leading-[29.68px] md:text-[61.886px] md:tracking-[-2.16601px] md:leading-[65.5992px]">
          <span className="box-border caret-transparent outline-[3px] no-underline overflow-hidden block text-[28px] tracking-[-0.98px] leading-[29.68px] mb-[-2.52px] pb-[-2.52px] md:text-[61.886px] md:tracking-[-2.16601px] md:leading-[65.5992px] md:mb-[-5.56974px] md:pb-[-5.56974px]">
            <span className="box-border caret-transparent block outline-[3px] no-underline text-[28px] tracking-[-0.98px] leading-[29.68px] md:text-[61.886px] md:tracking-[-2.16601px] md:leading-[65.5992px]">
              {props.title}
            </span>
          </span>
        </h2>
      </div>
    );
  }

  if (props.variant === "countdown") {
    return (
      <div className="box-border caret-transparent outline-[3px] no-underline items-center flex flex-col max-w-[1664px] relative text-center z-[1] mx-auto px-5 md:px-16">
        <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline">
          <div className="box-border caret-transparent flex justify-center outline-[3px] no-underline mb-6">
            <img
              src={artifactUrl}
              alt=""
              className="box-border caret-transparent max-w-full min-h-[auto] min-w-[auto] object-contain opacity-[0.88] outline-[3px] pointer-events-none no-underline w-[116.382px] md:w-[260px]"
            />
          </div>
        </div>

        <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full">
          <h2 className="box-border caret-transparent font-medium outline-[3px] no-underline font-headingNow text-[44.8px] tracking-[-1.568px] leading-[50.176px] md:text-[76.8px] md:tracking-[-2.688px] md:leading-[86.016px]">
            <span className="box-border caret-transparent flex text-[44.8px] justify-center outline-[3px] no-underline overflow-hidden text-[44.8px] tracking-[-1.568px] leading-[50.176px] mb-[-4.032px] pb-[-4.032px] md:text-[76.8px] md:tracking-[-2.688px] md:leading-[86.016px]">
              <span className="box-border caret-transparent block min-h-[auto] min-w-[auto] outline-[3px] no-underline text-[44.8px] tracking-[-1.568px] leading-[50.176px] md:text-[76.8px] md:tracking-[-2.688px] md:leading-[86.016px]">
                {props.title}
              </span>
            </span>
          </h2>

          <div className="box-border caret-transparent flex justify-center min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full">
            <div className="box-border caret-transparent flex flex-col justify-center min-h-[auto] min-w-[auto] outline-[3px] no-underline gap-y-[13.6px] w-full md:flex-row md:gap-y-[33.6px]">
              <span className="box-border caret-transparent text-[#16281A] text-[13.6px] font-semibold tracking-[2.958px] leading-[20.832px] outline-[3px] no-underline uppercase font-geist_mono">
                {props.eventLabel}
              </span>

              <span className="box-border caret-transparent text-[#16281A] text-[13.6px] font-semibold tracking-[2.958px] leading-[20.832px] outline-[3px] no-underline uppercase font-geist_mono md:ml-2">
                {props.eventDate}
              </span>
            </div>
          </div>

          <p className="box-border caret-transparent text-[#16281A]/70 text-[13.6px] tracking-[-0.204px] leading-[21.08px] outline-[3px] no-underline mt-[15px] font-dm_sans md:text-[15.36px] md:tracking-[-0.2304px] md:leading-[23.808px]">
            {props.eventDetails}
          </p>

          <div className="box-border caret-transparent flex justify-center min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full mt-[50px]">
            <div className="box-border caret-transparent flex justify-center max-w-[1568px] min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full">
              <div className="box-border caret-transparent flex justify-center min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full">
                <div className="items-start box-border caret-transparent flex gap-x-[46.2816px] grid grid-cols-none outline-[3px] no-underline gap-y-[48.2816px] md:flex md:gap-x-[48.2816px] md:grid-cols-none md:gap-y-[48.2816px]">
                  {renderCountdownUnit(
                    props.daysTens ?? "",
                    props.daysOnes ?? "",
                    "Days",
                  )}
                  {renderCountdownUnit(
                    props.hoursTens ?? "",
                    props.hoursOnes ?? "",
                    "Hours",
                  )}
                  {renderCountdownUnit(
                    props.minutesTens ?? "",
                    props.minutesOnes ?? "",
                    "Minutes",
                  )}
                  {renderCountdownUnit(
                    props.secondsTens ?? "",
                    props.secondsOnes ?? "",
                    "Seconds",
                  )}
                </div>
              </div>

              <span className="box-border caret-transparent block h-px outline-[3px] absolute no-underline text-nowrap w-px overflow-hidden">
                {props.countdownSummary}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        props.rootClassName ??
        "box-border caret-transparent outline-[3px] no-underline items-center flex flex-col max-w-screen-2xl relative text-center mx-auto px-5 md:px-16"
      }
    >
      <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline">
        <div
          className={
            props.artifactInnerClassName ??
            "box-border caret-transparent flex justify-center outline-[3px] no-underline mb-[22px]"
          }
        >
          <img
            src={artifactUrl}
            alt=""
            className="box-border caret-transparent max-w-full min-h-[auto] min-w-[auto] object-contain opacity-[0.88] outline-[3px] pointer-events-none no-underline w-[116.382px] md:w-[260px]"
          />
        </div>
      </div>

      <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full">
        <h2
          className={
            props.titleClassName ??
            "box-border caret-transparent font-medium outline-[3px] no-underline font-headingNow text-[41.6px] tracking-[-1.456px] leading-[45.76px] md:text-[73.6px] md:tracking-[-2.576px] md:leading-[80.96px]"
          }
        >
          <span
            className={
              props.titleOuterSpanClassName ??
              "box-border caret-transparent outline-[3px] no-underline overflow-hidden flex text-[41.6px] justify-center tracking-[-1.456px] leading-[45.76px] mb-[-3.744px] pb-[-3.744px] md:text-[73.6px] md:tracking-[-2.576px] md:leading-[80.96px] md:mb-[-6.624px] md:pb-[-6.624px]"
            }
          >
            <span
              className={
                props.titleInnerSpanClassName ??
                "box-border caret-transparent block outline-[3px] no-underline text-[41.6px] tracking-[-1.456px] leading-[45.76px] min-h-[auto] min-w-[auto] md:text-[73.6px] md:tracking-[-2.576px] md:leading-[80.96px]"
              }
            >
              {props.title}
            </span>
          </span>
        </h2>
      </div>

      <div
        className={
          props.descriptionWrapperClassName ??
          "box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline max-w-[1408px] w-full mt-[60px]"
        }
      >
        <div
          className={
            props.descriptionInnerClassName ??
            "items-center box-border caret-transparent flex flex-col outline-[3px] no-underline gap-x-[30px] gap-y-[30px]"
          }
        >
          <p
            className={
              props.descriptionClassName ??
              "box-border caret-transparent text-stone-900 text-[16.2838px] tracking-[-0.195405px] leading-[28.6594px] max-w-[1376px] min-h-[auto] min-w-[auto] outline-[3px] no-underline mx-auto font-dm_sans md:text-[33.5964px] md:tracking-[-0.403157px] md:leading-[59.1297px]"
            }
          >
            {renderWords(
              props.descriptionWords,
              "box-border caret-transparent text-[16.2838px] tracking-[-0.195405px] leading-[28.6594px] outline-[3px] no-underline md:text-[33.5964px] md:tracking-[-0.403157px] md:leading-[59.1297px]",
              "box-border caret-transparent inline-block text-[16.2838px] tracking-[-0.195405px] leading-[28.6594px] opacity-[0.18] outline-[3px] no-underline translate-y-1 md:text-[33.5964px] md:tracking-[-0.403157px] md:leading-[59.1297px]",
            )}
          </p>
        </div>
      </div>
    </div>
  );
};