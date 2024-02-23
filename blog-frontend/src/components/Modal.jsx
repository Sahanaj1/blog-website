import { useEffect } from "react";

function ModalView({
  children,
  isModalActive,
  setIsModalActive,
}) {
  useEffect(() => {
    addEventListener("keydown", escapeToCloseModal);
    return () => window.removeEventListener("keydown", escapeToCloseModal);
    function escapeToCloseModal(e) {
      if (e.key === "Escape") {
        setIsModalActive(false);
      }
    }
  }, []);

  return (
    <div>
      {isModalActive && (
        <div className="fixed z-[70] w-full overflow-x-hidden overflow-y-auto inset-0 md:h-full">
          <div className="bg-slate-500 opacity-40 fixed z-60 w-full h-full"></div>
          <div
            className="click-modal relative w-full h-full flex justify-center items-center"
            onClick={(e) => {
              e.stopPropagation();
              if (e.target.classList.contains("click-modal")) {
                setIsModalActive(false);
              }
            }}
          >
            {/* <div className="relative"> */}
            {/* <button
              type="button"
              className="absolute z-50 -right-3 -top-3 bg-transparen rounded-lg text-sm ml-auto inline-flex items-center"
              data-modal-toggle="authentication-modal"
              onClick={toggleModalView}
            >
              <IoMdClose
                fontSize={32}
                className="text-danger rounded-full border bg-textWhite hover:bg-danger hover:text-textWhite"
              />
              <span className="sr-only">Close modal</span>
            </button> */}
            {children}
            {/* </div> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModalView;
