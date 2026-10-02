export type FooterVisualProps = {
  variantClassName: string;
  imageSrc: string;
  imageClassName: string;
  showHeadingWrapper: boolean;
};

export const FooterVisual = (props: FooterVisualProps) => {
  return (
    <div
      className={`box-border caret-transparent outline-[3px] absolute no-underline ${props.variantClassName}`}
    >
      {props.showHeadingWrapper ? (
        <div
          role="heading"
          aria-label="RECURSIVE"
          className="box-border caret-transparent h-full isolate max-w-[375px] min-h-[auto] min-w-[auto] outline-[3px] relative no-underline w-full overflow-hidden md:max-w-screen-xl"
        >
          <img src={props.imageSrc} className={props.imageClassName} />
        </div>
      ) : (
        <img src={props.imageSrc} className={props.imageClassName} />
      )}
    </div>
  );
};