export type CountdownMetaProps = {
  variant: string;
  label: string;
  dateText: string;
  locationText: string;
  firstIconUrl: string;
  secondIconUrl: string;
};

export const CountdownMeta = (props: CountdownMetaProps) => {
  if (props.variant === "location") {
    return (
      <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline">
        <p className="box-border caret-transparent text-neutral-700/60 text-[13.6px] tracking-[-0.204px] leading-[21.08px] outline-[3px] no-underline mt-[15px] font-dm_sans md:text-[15.36px] md:tracking-[-0.2304px] md:leading-[23.808px]">
          {props.locationText}
        </p>
      </div>
    );
  }

  return (
    <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline flex justify-center w-full">
      <div className="items-center box-border caret-transparent gap-x-[13.6px] flex flex-col justify-center min-h-[auto] min-w-[auto] outline-[3px] gap-y-[13.6px] no-underline w-[min(864px,100%)] mt-7 md:gap-x-[33.6px] md:flex-row md:gap-y-[33.6px]">
        <span className="bg-[linear-gradient(90deg,rgba(47,85,39,0)_0%,rgba(47,85,39,0.4)_78%,rgba(47,85,39,0.52)_100%)] box-border caret-transparent block basis-auto grow-0 shrink-0 h-px max-w-20 min-h-[auto] min-w-[auto] outline-[3px] no-underline w-20 md:basis-0 md:grow md:shrink md:max-w-44 md:w-auto md:basis-0 md:grow md:shrink"></span>

        <span className="items-center box-border caret-transparent flex flex-row justify-center outline-[3px] no-underline">
          <span className="box-border caret-transparent text-stone-600 gap-x-[6.8px] flex text-[11.52px] font-medium tracking-[2.5344px] leading-[17.856px] min-h-[auto] min-w-[auto] outline-[3px] no-underline uppercase text-nowrap font-geist_mono md:text-[13.44px] md:tracking-[2.9568px] md:leading-[20.832px]">
            <span className="box-border caret-transparent block text-[11.52px] h-px tracking-[-2.5344px] leading-[17.856px] outline-[3px] pointer-events-none absolute no-underline text-nowrap w-px z-0 left-2/4 top-[42%] md:text-[13.44px] md:tracking-[-2.9568px] md:leading-[20.832px]">
              <img
                src={props.firstIconUrl}
                alt="Icon"
                className="box-border caret-transparent text-[11.52px] h-full tracking-[2.5344px] leading-[17.856px] outline-[3px] relative no-underline text-nowrap w-full z-[-1] md:text-[13.44px] md:tracking-[-2.9568px] md:leading-[20.832px]"
              />
            </span>
            {props.label}
          </span>

          <img
            src={props.secondIconUrl}
            alt="Icon"
            className="box-border caret-transparent shrink-0 outline-[3px] no-underline w-[17px] md:w-[21px]"
          />

          <time className="box-border caret-transparent text-zinc-900 block text-[16.19px] tracking-[-2.4285px] leading-[25.0945px] min-h-[auto] min-w-[auto] outline-[3px] no-underline uppercase text-nowrap font-bebasNeue md:text-[27.9912px] md:tracking-[-4.19868px] md:leading-[43.3864px]">
            {props.dateText}
          </time>
        </span>

        <span className="bg-[linear-gradient(90deg,rgba(47,85,39,0)_0%,rgba(47,85,39,0.4)_78%,rgba(47,85,39,0.52)_100%)] box-border caret-transparent block basis-auto grow-0 shrink-0 h-px max-w-20 min-h-[auto] min-w-[auto] outline-[3px] no-underline w-20 scale-x-100 md:basis-0 md:grow md:shrink md:max-w-44 md:w-auto"></span>
      </div>
    </div>
  );
};