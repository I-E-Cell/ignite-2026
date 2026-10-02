export type BackgroundLayerProps = {
  variant: string;
  layerClassName: string;
  imageSrc: string;
  imageAlt: string;
  iframeSrc: string;
  iframeTitle: string;
};

export const BackgroundLayer = (props: BackgroundLayerProps) => {
  if (props.variant === "image") {
    return (
      <img
        src={props.imageSrc}
        alt={props.imageAlt}
        className="box-border caret-transparent h-0 outline-[3px] absolute no-underline w-0"
      />
    );
  }

  if (props.variant === "iframe") {
    return (
      <div
        className={`box-border caret-transparent outline-[3px] no-underline ${props.layerClassName}`}
      >
        <iframe
          src={props.iframeSrc}
          title={props.iframeTitle}
          className="box-border caret-transparent h-full outline-[3px] relative no-underline w-full"
        ></iframe>
      </div>
    );
  }

  return (
    <div
      className={`box-border caret-transparent outline-[3px] no-underline ${props.layerClassName}`}
    ></div>
  );
};