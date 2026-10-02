export type DesktopMentorCardProps = {
  ariaLabel: string;
  primaryIconSrc: string;
  secondaryIconSrc: string;
  seatLabel: string;
  title: string;
  status: string;
  category: string;
  subtitle: string;
  groupLabel: string;
  description: string;
  firstMetricValue: string;
  firstMetricLabel: string;
  secondMetricValue: string;
  secondMetricLabel: string;
};

export const DesktopMentorCard = (props: DesktopMentorCardProps) => {
  return (
    <div className="box-border caret-transparent min-h-0 min-w-0 outline-[3px] no-underline md:min-h-[auto] md:min-w-[auto]">
      <div className="box-border caret-transparent opacity-[0.82] outline-[3px] no-underline">
        <div className="aspect-[4_/_5] box-border caret-transparent outline-[3px] relative no-underline w-full">
          <button
            type="button"
            aria-label={props.ariaLabel}
            disabled={true}
            className="bg-transparent caret-transparent block outline-[3px] absolute no-underline p-0 rounded-[22px] inset-0"
          >
            <span className="box-border caret-transparent block outline-[3px] absolute text-left no-underline overflow-hidden rounded-[22px] inset-0">
              <span className="bg-[radial-gradient(118%_75%_at_50%_8%,rgba(78,122,52,0.34)_0%,rgba(78,122,52,0.56)_56%),linear-gradient(165deg,rgb(22,46,22,0%)_0%,rgb(7,14,5)_100%)] bg-[position:0%_0%,0%_0%] bg-size-[auto,auto] shadow-[rgba(190,224,168,0.14)_0px_0px_0px_1px_inset] box-border caret-transparent block isolate outline-[3px] absolute no-underline overflow-hidden rounded-[22px] inset-0">
                <img
                  src={props.primaryIconSrc}
                  alt="Icon"
                  className="bottom-[-2%] box-border caret-transparent outline-[3px] absolute no-underline transform-none w-[76%] left-2/4 md:translate-x-[-50.0%]"
                />

                <span className="items-center box-border caret-transparent grid justify-items-center outline-[3px] pointer-events-none absolute no-underline top-0 bottom-[22%] inset-x-0">
                  <img
                    src={props.secondaryIconSrc}
                    alt="Icon"
                    className="box-border caret-transparent outline-[3px] no-underline w-[32%] md:w-[23.04px]"
                  />
                </span>

                <span className="box-border caret-transparent block mix-blend-soft-light opacity-40 outline-[3px] pointer-events-none absolute no-underline inset-0" />

                <span className="bg-[linear-gradient(to_bottom,rgba(4,10,5,0)_0%,rgba(4,10,5,0.32)_46%,rgba(2,6,3,0.88)_100%)] box-border caret-transparent flex flex-col outline-[3px] absolute gap-y-[2.4px] no-underline px-2 py-[8.8px] bottom-0 inset-x-0 md:gap-y-[4.48px] md:py-5">
                  <span className="box-border caret-transparent text-lime-400/90 block text-[10.24px] font-medium tracking-[1.2288px] leading-[15.872px] min-h-0 min-w-0 outline-[3px] no-underline uppercase font-geist_mono md:text-[9.92px] md:tracking-[1.984px] md:leading-[15.376px] md:mb-0">
                    {props.seatLabel}
                  </span>

                  <span className="box-border caret-transparent text-lime-50 block text-[14.08px] font-medium tracking-[-0.25344px] leading-[16.6144px] min-h-0 min-w-0 outline-[3px] no-underline font-headingNow md:text-[16.64px] md:tracking-[-0.29952px] md:leading-[20.6336px]">
                    {props.title}
                  </span>

                  <span className="bg-neutral-950/90 box-border caret-transparent text-lime-100/70 block text-[10.56px] font-medium tracking-[2.112px] leading-[16.368px] outline-[3px] absolute no-underline uppercase border border-lime-200/20 px-[6.4px] py-[-2.56px] rounded-full border-solid">
                    {props.status}
                  </span>
                </span>
              </span>

              <span className="box-border caret-transparent block outline-[3px] absolute text-left no-underline transform-none overflow-hidden rounded-[22px] inset-0">
                <span className="bg-[radial-gradient(110%_70%_at_12%_0%,rgba(92,140,58,0.3)_0%,rgba(92,140,58,0.58)_58%),linear-gradient(165deg,rgb(27,46,22,0%)_0%,rgb(7,14,5)_100%)] bg-[position:0%_0%,0%_0%] bg-size-[auto,auto] shadow-[rgba(190,224,168,0.18)_0px_0px_0px_1px_inset] box-border caret-transparent block text-lime-300 outline-[3px] no-underline uppercase font-geist_mono md:text-[9.6px]">
                  {props.category}
                </span>

                <span className="box-border caret-transparent text-lime-50 block text-[14.08px] font-medium tracking-[-0.2816px] leading-[16.6144px] min-h-0 min-w-0 outline-[3px] no-underline mt-[2.4px] font-headingNow md:text-[19.2px] md:tracking-[-0.384px] md:leading-[23.04px]">
                  {props.subtitle}
                </span>

                <span className="bg-lime-400/50 box-border caret-transparent block h-px min-h-0 min-w-0 outline-[3px] no-underline w-[19.2px] my-[-4.8px] md:my-[-12.8px]">
                </span>

                <span className="box-border caret-transparent text-stone-300/70 block text-[11.52px] font-medium leading-[17.856px] min-h-0 min-w-0 outline-[3px] no-underline mt-1 font-dm_sans md:text-[13.056px] md:leading-[20.6288px] md:min-h-[auto] md:min-w-[auto] md:mt-[9.6px]">
                  {props.groupLabel}
                </span>

                <span className="box-border caret-transparent text-stone-300/60 block text-[10.56px] leading-[15.6672px] min-h-0 min-w-0 outline-[3px] no-underline mt-1 font-dm_sans md:text-[13.056px] md:leading-[20.6288px] md:min-h-[auto] md:min-w-[auto] md:mt-[9.6px]">
                  {props.description}
                </span>

                <span className="box-border caret-transparent text-lime-50 block text-[16.8px] tracking-[0.336px] leading-[16.8px] min-h-0 min-w-0 outline-[3px] no-underline font-bebasneue md:text-[24.8px] md:tracking-[0.496px] md:leading-[24.8px] md:min-h-[auto] md:min-w-[auto]">
                  <span className="box-border caret-transparent gap-x-[1.6px] flex flex-col min-h-0 min-w-0 outline-[3px] gap-y-[1.6px] no-underline md:min-h-[auto] md:min-w-[auto]">
                    <span className="box-border caret-transparent text-lime-50 block text-[16.8px] tracking-[-0.336px] leading-[16.8px] min-h-0 min-w-0 outline-[3px] no-underline font-bebasNeue md:text-[24.8px] md:tracking-[-0.496px] md:leading-[24.8px]">
                      {props.firstMetricValue}  
                    </span>
                    <span className="box-border caret-transparent text-stone-300/60 block text-[10.56px] font-medium tracking-[0.528px] leading-[16.368px] min-h-0 min-w-0 outline-[3px] no-underline uppercase font-dm_sans md:min-h-[auto] md:min-w-[auto]">
                      {props.firstMetricLabel}
                    </span>
                  </span>

                  <span className="box-border caret-transparent gap-x-[1.6px] flex flex-col min-h-0 min-w-0 outline-[3px] gap-y-[1.6px] no-underline md:min-h-[auto] md:min-w-[auto]">
                    <span className="box-border caret-transparent text-lime-50 block text-[16.8px] tracking-[-0.336px] leading-[16.8px] min-h-0 min-w-0 outline-[3px] no-underline font-bebasNeue md:text-[24.8px] md:tracking-[-0.496px] md:leading-[24.8px]">
                      {props.secondMetricValue}
                    </span>
                    <span className="box-border caret-transparent text-stone-300/60 block text-[10.56px] font-medium tracking-[0.528px] leading-[16.368px] min-h-0 min-w-0 outline-[3px] no-underline uppercase font-dm_sans md:min-h-[auto] md:min-w-[auto]">
                      {props.secondMetricLabel}
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};