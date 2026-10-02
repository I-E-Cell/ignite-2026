import { CountdownUnit } from "@/sections/CountdownSection/components/CountdownUnit";

export const CountdownTimer = () => {
  return (
    <div className="box-border caret-transparent flex justify-center min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full mt-[50px]">
      <div className="box-border caret-transparent flex justify-center max-w-[1568px] min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full">
        <div className="box-border caret-transparent flex justify-center min-h-[auto] min-w-[auto] outline-[3px] no-underline w-full">
          <div className="items-start box-border caret-transparent gap-x-[40.2188px] grid grid-cols-[repeat(2,max-content)] justify-center min-h-[auto] min-w-[auto] outline-[3px] gap-y-[30.7125px] no-underline md:gap-x-[48.2816px] md:flex md:grid-cols-none md:gap-y-[48.2816px]">
            <CountdownUnit
              firstDigit="1"
              secondDigit="9"
              label="Days"
              separatorClassName="flex translate-x-[-50.0%] translate-y-[-50.0%]"
              separatorIconClassName="block min-h-[auto] min-w-[auto]"
            />

            <CountdownUnit
              firstDigit="1"
              secondDigit="5"
              label="Hours"
              separatorClassName="hidden transform-none md:flex md:translate-x-[-50.0%] md:translate-y-[-50.0%]"
              separatorIconClassName="inline min-h-0 min-w-0 md:block md:min-h-[auto] md:min-w-[auto]"
            />

            <CountdownUnit
              firstDigit="5"
              secondDigit="9"
              label="Minutes"
              separatorClassName="flex translate-x-[-50.0%] translate-y-[-50.0%]"
              separatorIconClassName="block min-h-[auto] min-w-[auto]"
            />

            <CountdownUnit firstDigit="0" secondDigit="6" label="Seconds" />
          </div>

          <span className="box-border caret-transparent block h-px outline-[3px] absolute no-underline text-nowrap w-px overflow-hidden">
            19 days, 15 hours, 59 minutes, 6 seconds until the gates open
          </span>
        </div>
      </div>
    </div>
  );
};