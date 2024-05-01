import { useEffect } from "react";
import { CloseIcon } from "./icons";
type ModalProps = {
  open: boolean;
  close: () => void;
  children: React.ReactElement;
};

export const Modal = (props: any) => {
  const { open, close, children } = props;
  useEffect(() => {
    if (open) {
      document.body.style.cssText = `overflow: hidden`;
    } else {
      document.body.style.cssText = `overflow: auto`;
    }
  }, [open]);
  return (
    <div
      {...props}
      className={`fixed z-50 top-0 left-0 bottom-0 h-screen w-screen overflow-scroll backdrop-blur-sm bg-black/50 items-center justify-center ${
        open ? "flex" : "hidden"
      } ${props.className ? props.className : ""}`}
    >
      <button className="absolute top-8 right-8" onClick={close}>
        <CloseIcon />
      </button>
      {children}
      {/* <div className="w-[calc(100vw-32px)] md:container relative h-3/4 bg-white/75 lg:rounded-3xl"> */}
      {/* </div> */}
    </div>
  );
};
