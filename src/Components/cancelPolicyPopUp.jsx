import React from "react";


const CancelPolicyPopUp = ({ isPopUpOpen, closePopUp, handleCancelPolicy, item}) => {

  return (
    <>
      {isPopUpOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-52  px-6 ${
            isPopUpOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9  rounded-lg md:w-[38%] w-full  relative p-9  ">
            <p className="text-center font-DMsans text-black font-semibold text-[16px]">
              Are you sure to cancel the Policy ?
            </p>
            <div className="flex justify-center items-center font-DMsans gap-5 mt-5">
              <span
                onClick={closePopUp}
                className="px-8 py-2 cursor-pointer  rounded-lg text-primary border border-primary"
              >
                No
              </span>
              <span
                onClick={() => {
                    handleCancelPolicy(item?._id)
                  closePopUp();
                }}
                className="px-8 py-2 cursor-pointer rounded-lg text-white bg-primary"
              >
                Yes
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CancelPolicyPopUp;
