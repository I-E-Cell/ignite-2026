export const MentorsCallToAction = () => {
  return (
    <div className="box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] no-underline">
      <div className="items-center box-border caret-transparent gap-x-[18.4px] flex flex-col outline-[3px] gap-y-[18.4px] no-underline mt-[45px]">
        <p className="box-border caret-transparent text-stone-300/40 text-[10.56px] font-semibold tracking-[1.4784px] leading-[16.368px] min-h-[auto] min-w-[auto] outline-[3px] no-underline uppercase font-geist_mono">
          Mentor &amp; judge profiles are currently locked · Revealing soon
        </p>

        <button
          type="button"
          aria-label="Explore all mentors and judges - Currently Locked"
          disabled={true}
          className="items-center bg-lime-950/90 caret-transparent text-stone-200 gap-x-[10.4px] flex text-[14.08px] font-semibold justify-center leading-[21.824px] min-h-[auto] min-w-[272px] outline-[3px] relative gap-y-[10.4px] no-underline border border-lime-200/20 overflow-hidden px-[20.1325px] py-[11.52px] rounded-full font-dm_sans md:px-7"
        >
          <span className="items-center box-border caret-transparent text-lime-300 grid h-5 justify-items-center min-h-[auto] min-w-[auto] outline-[3px] no-underline w-5">
            <img
              src="https://c.animaapp.com/LNkMILMOwPiVywCgFtLcSg/assets/icon-30.svg"
              alt="Icon"
              className="box-border caret-transparent h-[15.2px] outline-[3px] no-underline w-[15.2px]"
            />
          </span>

          <span className="box-border caret-transparent block min-h-[auto] min-w-[auto] outline-[3px] no-underline">
            Explore all mentors &amp; judges
          </span>
        </button>
      </div>
    </div>
  );
};