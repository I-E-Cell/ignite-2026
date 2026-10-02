export type CountdownUnitProps = {
  firstDigit: string;
  secondDigit: string;
  label: string;
  separatorClassName?: string;
  separatorIconClassName?: string;
};

export const CountdownUnit = (props: CountdownUnitProps) => {
  return (
    <div className="items-center box-border caret-transparent gap-x-[17.55px] flex flex-col min-h-[auto] min-w-[auto] outline-[3px] relative gap-y-[17.55px] no-underline md:gap-x-[25.1904px] md:gap-y-[25.1904px]">
      <div className="box-border caret-transparent gap-x-[8.04375px] flex min-h-[auto] min-w-[auto] outline-[3px] no-underline md:gap-x-[11.5456px] md:gap-y-[11.5456px]">
        <span className="box-border caret-transparent block h-[103.838px] min-h-[auto] min-w-[auto] outline-[3px] relative no-underline w-[73.125px] md:h-[149.043px] md:w-[104.96px]">
          <span className="bg-lime-950 shadow-[rgba(255,255,255,0.34)_0px_1px_0px_0px,rgba(16,32,14,0.8)_0px_2px_2px_0px,rgba(16,32,14,0.4)_0px_2px_6px_2px] box-border caret-transparent block isolate outline-[3px] absolute no-underline overflow-hidden rounded-[10.2375px] inset-0 md:rounded-[14.6944px]">
            <span className="items-start bg-[linear-gradient(rgb(58,100,49,0%),rgb(42,67,36,100%))] box-border caret-transparent flex h-3/6 justify-center outline-[3px] absolute no-underline overflow-hidden rounded-b-[10.2375px] top-0 inset-x-0 md:rounded-t-[14.6944px] md:rounded-b-none">
              <b className="box-border caret-transparent text-stone-100 block text-[77.5125px] tabular-nums h-[103.838px] tracking-[-0.775125px] leading-[103.838px] min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full font-bebasNeue md:text-[111.258px] md:h-[149.043px] md:tracking-[-1.11258px] md:leading-[149.043px]">
                {props.firstDigit}
              </b>
            </span>

            <span className="items-end bg-[linear-gradient(rgb(30,50,24,0%),rgb(22,36,15,100%))] shadow-[rgba(0,0,0,0.5)_0px_1px_0px_0px_inset] box-border caret-transparent flex h-3/6 justify-center outline-[3px] absolute no-underline overflow-hidden rounded-b-[10.2375px] bottom-0 inset-x-0 md:rounded-b-[14.6944px]">
              <b className="box-border caret-transparent text-stone-100 block text-[77.5125px] tabular-nums h-[103.838px] tracking-[-0.775125px] leading-[103.838px] min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full font-bebasNeue md:text-[111.258px] md:h-[149.043px] md:tracking-[-1.11258px] md:leading-[149.043px]">
                {props.firstDigit}
              </b>
            </span>

            <span className="bg-black/60 shadow-[rgba(220,240,200,0.09)_0px_1px_0px_0px] box-border caret-transparent block h-px outline-[3px] pointer-events-none absolute no-underline translate-y-[-0.5px] z-[-7] top-2/4 inset-x-0" />
            <span className="bg-[linear-gradient(103deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.03)_26%,rgba(255,255,255,0)_48%)] shadow-[rgba(255,255,255,0.08)_0px_0px_0px_1px_inset] box-border caret-transparent block outline-[3px] pointer-events-none absolute no-underline z-[-8] rounded-[10.2375px] inset-0 md:rounded-[14.6944px]" />
          </span>
        </span>

        <span className="box-border caret-transparent block h-[103.838px] min-h-[auto] min-w-[auto] outline-[3px] relative no-underline w-[73.125px] md:h-[149.043px] md:w-[104.96px]">
          <span className="box-border caret-transparent block isolate outline-[3px] absolute no-underline overflow-hidden rounded-[10.2375px] inset-0 md:rounded-[14.6944px]">
            <span className="items-start bg-[linear-gradient(rgb(58,100,49,0%),rgb(42,67,36,100%))] box-border caret-transparent flex h-3/6 justify-center outline-[3px] absolute no-underline overflow-hidden rounded-t-[10.2375px] top-0 inset-x-0 md:rounded-t-[14.6944px]">
              <b className="box-border caret-transparent text-stone-100 block text-[77.5125px] tabular-nums h-[103.838px] tracking-[-0.775125px] leading-[103.838px] min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full font-bebasNeue md:text-[111.258px] md:h-[149.043px] md:tracking-[-1.11258px] md:leading-[149.043px]">
                {props.secondDigit}
              </b>
            </span>

            <span className="items-end bg-[linear-gradient(rgb(30,50,24,0%),rgb(22,36,15,100%))] box-border caret-transparent flex h-3/6 justify-center outline-[3px] absolute no-underline overflow-hidden rounded-b-[10.2375px] bottom-0 inset-x-0 md:rounded-b-[14.6944px]">
              <b className="box-border caret-transparent text-stone-100 block text-[77.5125px] tabular-nums h-[103.838px] tracking-[-0.775125px] leading-[103.838px] min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full font-bebasNeue md:text-[111.258px] md:h-[149.043px] md:tracking-[-1.11258px] md:leading-[149.043px]">
                {props.secondDigit}
              </b>
            </span>

            <span className="bg-black/60 shadow-[rgba(220,240,200,0.09)_0px_1px_0px_0px] box-border caret-transparent block h-px outline-[3px] pointer-events-none absolute no-underline translate-y-[-0.5px] z-[-7] top-2/4 inset-x-0" />
            <span className="bg-[linear-gradient(103deg,rgba(255,255,255,0.17)_0%,rgba(255,255,255,0.03)_26%,rgba(255,255,255,0)_48%)] shadow-[rgba(255,255,255,0.08)_0px_0px_0px_1px_inset] box-border caret-transparent block outline-[3px] pointer-events-none absolute no-underline z-[-8] rounded-[10.2375px] inset-0 md:rounded-[14.6944px]" />
          </span>
        </span>
      </div>

      <span className="box-border caret-transparent text-neutral-800 block text-[10.88px] font-medium tracking-[1.7408px] leading-[16.864px] min-h-[auto] min-w-[auto] outline-[3px] no-underline uppercase pl-[2.6112px] font-geist_mono md:text-[12.8px] md:tracking-[3.072px] md:leading-[19.84px] md:pl-[3.072px]">
        {props.label}
      </span>

      {props.separatorClassName && props.separatorIconClassName ? (
        <span
          className={`box-border caret-transparent gap-x-[12.4312px] flex flex-col outline-[3px] absolute right-[-21.9375px] gap-y-[12.4312px] no-underline top-[51.9188px] md:gap-x-[17.8432px] md:right-[-31.488px] md:gap-y-[17.8432px] md:top-[74.5216px] ${props.separatorClassName}`}
        >
          <i
            className={`aspect-square bg-neutral-800/60 shadow-[rgba(240,246,232,0.6)_0px_0px_6px_0px] box-border caret-transparent italic outline-[3px] no-underline w-[6.21562px] rounded-[50%] md:w-[8.9216px] ${props.separatorIconClassName}`}
          ></i>
          <i
            className={`aspect-square bg-neutral-800/60 shadow-[rgba(240,246,232,0.6)_0px_0px_6px_0px] box-border caret-transparent italic outline-[3px] no-underline w-[6.21562px] rounded-[50%] md:w-[8.9216px] ${props.separatorIconClassName}`}
          ></i>
        </span>
      ) : null}
    </div>
  );
};