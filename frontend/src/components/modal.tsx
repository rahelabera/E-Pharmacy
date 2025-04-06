import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Modal = ({ onClose, children, actionBar, isDelete }: any) => {
  const [modalContainer, setModalContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    // Use type assertion to inform TypeScript
    const container = document.querySelector(
      ".modal-container"
    ) as HTMLElement | null;
    setModalContainer(container);

    document.body.classList.add("overflow");
    return () => {
      document.body.classList.remove("overflow");
    };
  }, []);

  if (!modalContainer) return null;
  return ReactDOM.createPortal(
    <div>
      <div
        onClick={ onClose }
        className="fixed z-[10000] py-28 bg-black/80  top-0 left-0 right-0 bottom-0 "
      ></div>
      <div className={ ` ${isDelete ? " w-[22rem] sm:w-[30rem] md:w-[50rem] h-[15rem]" : "overflow-y-scroll w-[22rem] sm:w-[30rem] md:w-[50rem] h-[33rem] "} fixed z-[11000]  bg-white top-[50%] left-[50%] right-[40%] bottom-[50%] -translate-y-1/2 -translate-x-1/2 rounded-lg` } >
        <div className="flex justify-end pr-1 md:pr-3">{ actionBar }</div>
        <div className="flex justify-center mx-auto ">
          <div className="w-full">{ children }</div>
        </div>
      </div>
    </div>,
    modalContainer
  );
};

export default Modal;