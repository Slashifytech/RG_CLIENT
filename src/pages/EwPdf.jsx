import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  carVector,
  pdfHeaderFour,
  pdfHeaderOne,
  pdfHeaderThree,
  pdfHeaderTwo,
  topHeaderPdf,
} from "../assets";
import { useLocation } from "react-router-dom";
import { getEwId } from "../features/EwApi";
import html2pdf from "html2pdf.js";
import Loader from "../Components/Loader";

const EwPdf = forwardRef(({ id }, ref) => {
  const location = useLocation();
  const pdfRef = useRef();
  const [data, setData] = useState();
  const ewId = id ? id : location?.state?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEwId(ewId, null);
        setData(res?.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [ewId]);

  const handleDownloadPDF = () => {
    const input = pdfRef.current;
    const opt = {
      margin: 0,
      filename: `${data?.vehicleDetails?.vinNumber}_EW_Policy` || "Ew_Policy",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a2", orientation: "portrait" },
      pagebreak: { mode: "avoid-all" },
    };
    html2pdf().from(input).set(opt).save();
  };

  useImperativeHandle(ref, () => ({
    handleDownloadPDF,
  }));
  if (!data) {
    return (
      <div className="mt-64 flex justify-center md:ml-32 sm:ml-32">
        <Loader />
      </div>
    );
  }
  return (
    <div ref={pdfRef} className={` bg-white p-6 border  shadow-md `} >
      <img
        src={topHeaderPdf}
        alt="img"
        className={`w-full mt-[14%] ${
          location.pathname === "/ew-view" ? "hidden " : "block"
        }`}
      />
      <div
        className={`border border-black pt-6 px-6 mb-6 ${
          location.pathname === "/ew-view" ? "hidden" : "block"
        }`}
      >
        The contract under <b>policy number</b> OG-25-1803-1817-00000348 has
        been concluded based on the details and declarations provided by you.
        The summarized transcript of the same is outlined below. You are
        required to review and confirm the accuracy of this information. <br />
        <br />
        <p>
          If you identify any discrepancies, require modifications, or disagree
          with any aspect of the details mentioned, you must notify us within 15
          days from the date of receipt of this document. Failure to respond
          within this timeframe will be considered as your acceptance of the
          accuracy of the provided details.
        </p>
        <br />
        <p>
          Please be advised that the statements and disclosures contained within
          this transcript serve as the foundation for the issuance of this
          policy. It is imperative that all material facts have been truthfully
          disclosed, as any misrepresentation, omission, or non-disclosure of
          critical information will render the policy void from inception. In
          such cases, no claims will be entertained, and any paid amount may be
          forfeited
        </p>
        <img src={carVector} alt="img" loading="lazy" />
      </div>
      <div
        className={`${location.pathname === "/ew-view" ? "mt-6 " : "mt-20"}`}
      >
        <img
          src={pdfHeaderOne}
          alt="header"
          loading="lazy"
          className={`${location.pathname === "/ew-view" ? "hidden" : "block"}`}
        />

        {/* CUSTOMER DETAILS */}
        <div className="bg-[#1F2A44] text-white font-bold p-2 text-sm uppercase tracking-widest mt-9 pb-4">
          Customer Details
        </div>
        <div className="p-4 space-y-2 bg-white">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <span className="font-semibold">Name :</span>{" "}
              <span className="flex-1 border border-gray-400 p-1 bg-blue-100 py-3 ml-3 mt-3">
                {data?.customerDetails?.customerName}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold">Address :</span>{" "}
              <span className="flex-1 border border-gray-400 p-1 bg-blue-100 py-3 ml-3 mt-3">
                {data?.customerDetails?.address}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex items-center w-full">
              <span className="font-semibold w-1/4">City :</span>
              <span className="border border-gray-400 p-1 bg-blue-100 py-3  mt-3 flex-1 w-3/4">
                {data?.customerDetails?.city}
              </span>
            </div>
            <div className="flex items-center w-full">
              <span className="font-semibold w-1/4">State :</span>
              <span className="border border-gray-400 p-1 bg-blue-100 py-3  mt-3 flex-1 w-3/4">
                {data?.customerDetails?.state}
              </span>
            </div>
            <div className="flex items-center w-full">
              <span className="font-semibold w-1/4">Pin Code :</span>
              <span className="border border-gray-400 p-1 bg-blue-100 py-3  mt-3 flex-1 w-3/4">
                {data?.customerDetails?.zipCode}
              </span>
            </div>
            <div className="flex items-center w-full">
              <span className="font-semibold w-1/4">Mobile No. :</span>
              <span className="border border-gray-400 p-1 bg-blue-100 py-3  mt-3 flex-1 w-3/4">
                {data?.customerDetails?.contact}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="font-semibold">Email :</span>{" "}
              <span className="flex-1 border border-gray-400 p-1 bg-blue-100 py-3 ml-3 mt-3">
                {data?.customerDetails?.email}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold">DOB :</span>
              <span className="flex-1 border border-gray-400 p-1 bg-blue-100 py-3 ml-3 mt-3">
                {data?.customerDetails?.dob}
              </span>
            </div>
          </div>
        </div>
        {/* EXTENDED WARRANTY POLICY DETAILS */}
        <div className="bg-[#1F2A44] text-white font-bold p-2 text-sm uppercase tracking-widest mt-6 pb-4">
          Extended Warranty Policy Details
        </div>
        <div className="p-4 space-y-2 bg-white">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex items-center w-full">
              <span className="font-semibold w-1/3">Policy Number :</span>
              <span className="border border-gray-400 p-1 bg-blue-100 py-3 mt-3 flex-1 w-2/3">
                {data?.ewDetails?.policyNumber}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-3">
            <div className="flex items-center w-full">
              <span className="font-semibold w-1/3">Policy Issue Date:</span>
              <span className="border border-gray-400 p-1 bg-blue-100 py-3 mt-3 flex-1 w-2/3">
                {data?.ewDetails?.policyDate}
              </span>
            </div>
            <div className="flex items-center w-full">
              <span className="font-semibold w-1/3">Warranty Amount :</span>
              <span className="border border-gray-400 p-1 bg-blue-100 py-3 mt-3 flex-1 w-2/3">
                {data?.ewDetails?.warrantyAmount}
              </span>
            </div>
          </div>
            <div className="flex items-center w-full">
              <span className="font-semibold w-1/3">Policy Issue Date :</span>
              <span className="border border-gray-400 p-1 bg-blue-100 py-3 mt-3 flex-1 w-2/3">
                {data?.ewDetails?.policyDate}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mt-3">
            <div className="flex items-center w-full">
              <span className="font-semibold w-1/3">Plan Type :</span>
              <span className="border border-gray-400 p-1 bg-blue-100 py-3 mt-3 flex-1 w-2/3">
                {data?.ewDetails?.planType}
              </span>
            </div>
            <div className="flex items-center w-full">
              <span className="font-semibold w-1/3">Plan Sub Type :</span>
              <span className="border border-gray-400 p-1 bg-blue-100 py-3 mt-3 flex-1 w-2/3">
                {data?.ewDetails?.planSubType}
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <span className="font-semibold">Registration Type :</span>{" "}
            <span className="flex-1 border border-gray-400 p-1 bg-blue-100 py-3 mt-3">
              {data?.ewDetails?.registrationType}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-3">
            <div className="flex items-center w-full">
              <span className="font-semibold w-1/3">Kilometers :</span>
              <span className="border border-gray-400 p-1 bg-blue-100 py-3 mt-3 flex-1 w-2/3">
                {data?.ewDetails?.startKm}
              </span>
            </div>
            <div className="flex items-center w-full">
              <span className="font-semibold w-1/3"> KM To :</span>
              <span className="border border-gray-400 p-1 bg-blue-100 py-3 mt-3 flex-1 w-1/2">
                {data?.ewDetails?.endKm} KM
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="font-semibold ">Status :</span>{" "}
            <span className="flex-1 ml-3 border border-gray-400 p-1 bg-blue-100 py-3 mt-3">
              {data?.ewDetails?.ewStatus}
            </span>
          </div>
        </div>
        {/* VEHICLES DETAILS */}
        <div className="bg-[#1F2A44] text-white font-bold p-2 text-sm uppercase tracking-widest mt-6 pb-4">
          Vehicles Details
        </div>
      </div>
      <div className="flex items-center mt-[50%]">
        <span className="font-semibold ">Registration Number :</span>{" "}
        <span className="flex-1 ml-3 border border-gray-400 p-1 bg-blue-100 py-3 mt-3">
          {data?.vehicleDetails?.registrationNumber}
        </span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold ">Date of Sale :</span>{" "}
        <span className="flex-1 ml-3 border border-gray-400 p-1 bg-blue-100 py-3 mt-3">
          {data?.vehicleDetails?.saleDate}
        </span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold ">Present Kilometer :</span>{" "}
        <span className="flex-1 ml-3 border border-gray-400 p-1 bg-blue-100 py-3 mt-3">
          {data?.vehicleDetails?.presentKm}
        </span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold ">Date of Delivery:</span>{" "}
        <span className="flex-1 ml-3 border border-gray-400 p-1 bg-blue-100 py-3 mt-3">
          {data?.vehicleDetails?.deliveryDate}
        </span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold ">Warranty Limit :</span>{" "}
        <span className="flex-1 ml-3 border border-gray-400 p-1 bg-blue-100 py-3 mt-3">
          {data?.vehicleDetails?.warrantyLimit}
        </span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold ">Model :</span>{" "}
        <span className="flex-1 ml-3 border border-gray-400 p-1 bg-blue-100 py-3 mt-3">
          {data?.vehicleDetails?.vehicleModel}
        </span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold ">Fuel Type :</span>{" "}
        <span className="flex-1 ml-3 border border-gray-400 p-1 bg-blue-100 py-3 mt-3">
          {data?.vehicleDetails?.fuelType}
        </span>
      </div>
      <div className="flex items-center">
        <span className="font-semibold ">Vin Number/ Chesis No. :</span>{" "}
        <span className="flex-1 ml-3 border border-gray-400 p-1 bg-blue-100 py-3 mt-3">
          {data?.vehicleDetails?.vinNumber}
        </span>
      </div>{" "}
      <div className="flex items-center">
        <span className="font-semibold ">Engine Number :</span>{" "}
        <span className="flex-1 ml-3 border border-gray-400 p-1 bg-blue-100 py-3 mt-3">
          {data?.vehicleDetails?.engineNumber}
        </span>
      </div>
      <hr className="border border-black mt-8" />
      <p className="pt-9 font-bold">
        RSA (Roadside Assistance) Coverage Details:
      </p>
      <p className="mt-6 ">
        One towing service per policy year from the breakdown location to the
        nearest authorized OEM service center, up to a distance of 50 km. <br />
        Onsite repair assistance, including battery jump-start, minor repairs,
        tire replacement, and more. <br />
        Toll-Free Number for RSA Assistance: 1800-209-1030.
      </p>
      <div
        className={`${
          location.pathname === "/ew-view" ? "hidden" : "block mt-[80%]"
        }`}
      >
        <img src={pdfHeaderTwo} alt="header" loading="lazy"  className="mt-9"/>

        <div className="-mt-2">
          <div>
            <div className="grid grid-cols-3">
              <div className="p-3 text-left w-[44%] font-bold  bg-[#1a1f3d] px-6 text-[21px] text-white">
                Number
              </div>

              <div className="p-3 text-left font-bold text-[21px] text-[#1a1f3d]">
                Parts Covered
              </div>
              <div className="p-3 text-left font-bold text-[21px] text-[#1a1f3d]">
                Not Covered
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full ">
            <div className="flex flex-row">
              <span className="text-2xl font-bold text-[40px] bg-[#1a1f3d] text-white p-12  ">
                001
              </span>
              <div className=" -rotate-90 bg-[#ebf6ff] w-[210px] h-16  -ml-[4.6%] mt-[3.9%]   font-semibold "></div>
              <span className="bg-[#ebf6ff] grid grid-cols-2 p-6 -ml-[4.5%] w-full  justify-center items-center">
                <p className="pl-12 font-semibold">☑ Motor With Transmission</p>
                <p>
                  ☒ PMS items such as all Fluids, Filters etc. <br /> ☒ Main
                  Battery Pack and battery contactors, BMS(Covered by respective
                  OEMs) <br /> ☒ Oil seals <br /> ☒ Damage due to lack of
                  maintenance, ☒ All kind of mountings <br />☒ Any damage due to
                  external fluid seepage
                </p>
              </span>
            </div>
            <div className="flex flex-row   ">
              <span className="text-2xl font-bold text-[40px] bg-[#1a1f3d] text-white p-12  ">
                002
              </span>
              <div className=" -rotate-90 bg-[#ebf6ff] w-[150px]  font-semibold h-16  -ml-11 mt-10 "></div>
              <span className="bg-white grid grid-cols-2 p-6 -ml-[3%] w-full  justify-center items-center">
                <p className="pl-12 font-semibold">
                  ☑ Motor Control Unit (Controller)
                </p>
                <p>☒ Any damage due to external fluid seepage</p>
              </span>
            </div>{" "}
            <div className="flex flex-row   ">
              <span className="text-2xl font-bold text-[40px] bg-[#1a1f3d] text-white px-12 py-16  ">
                003
              </span>
              <div className=" -rotate-90 bg-[#ebf6ff]  w-[191px]  font-semibold h-16  -ml-[63px] mt-14 pl-6">
                In Cooling System
              </div>
              <span className="bg-[#ebf6ff] grid grid-cols-2 p-6 -ml-[4.5%] w-full  justify-center items-center">
                <p className="pl-12 ">
                  ☑ Radiator, coolant pump, auxiliary tank.
                </p>
                <p>☒ Hoses and clamps</p>
              </span>
            </div>{" "}
            <div className="flex flex-row   ">
              <span className="text-2xl font-bold text-[40px] bg-[#1a1f3d] text-white px-12 py-20  ">
                004
              </span>
              <div className=" -rotate-90 bg-[#ebf6ff]  w-[250px]  font-semibold h-16  -ml-[88px] mt-[75.5px] pl-6">
                In Steering & Sups System
              </div>
              <span className="bg-white grid grid-cols-2 p-6 -ml-[6%] w-full  justify-center items-center">
                <p className="pl-12 ">
                  ☑ Rack and pinion, steering box, steering <br /> column,
                  Universal Joint Crosses, <br /> Electronic power steering
                  motor.
                </p>
                <p>
                  ☒ Ball Joints & Tie Rods, Tie Rod ends, Lower Arms <br /> ☒
                  Rubber, Plastic or Half Metallic Hoses <br /> ☒ Struts & Shock
                  Absorber, All Springs/ Bellows/Mountings <br /> ☒ Wheel
                  Bearing <br /> ☒ Bearing Hub Bush kits and rubber parts
                </p>
              </span>
            </div>{" "}
            <div className="flex flex-row   ">
              <span className="text-2xl font-bold text-[40px] bg-[#1a1f3d] text-white py-20 px-12  ">
                005
              </span>
              <div className=" -rotate-90 bg-[#ebf6ff]  w-[200px]  font-semibold h-16  -ml-[67px] mt-[5.2%] pl-6">
                In Front Wheel Drive
              </div>
              <span className="bg-[#ebf6ff] grid grid-cols-2 p-6 -ml-[4.5%] w-full  justify-center items-center">
                <p className="pl-12 ">
                  ☑ Drive shaft and Couplings, Differential Units, <br />
                  Constant velocity joints, Hub, Drive flange, <br />
                  Transfer case
                </p>
                <p>
                  ☒ Damage due to lack of maintenance <br />
                  ☒ All standalone gasket/filter/oil <br />
                </p>
              </span>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-3 mt-[45%]">
              <div className="p-3 text-left w-[44%] font-bold   px-6 text-[21px] text-[#1a1f3d]">
                Number
              </div>

              <div className="p-3 text-left font-bold text-[21px] text-[#1a1f3d]">
                Parts Covered
              </div>
              <div className="p-3 text-left font-bold text-[21px] text-[#1a1f3d]">
                Not Covered
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full  ">
            <div className="flex flex-row">
              <span className="text-2xl font-bold text-[40px] bg-[#1a1f3d] text-white p-12  ">
                006
              </span>
              <div className=" -rotate-90 bg-[#ebf6ff] w-[230px] h-16  -ml-[4.7%] mt-[4.4%]   font-semibold ">
                {" "}
                IN BRAKE SYSTEM
              </div>
              <span className="bg-[#ebf6ff] grid grid-cols-2 p-6 -ml-[4.5%] w-full  justify-center items-center">
                <p className="pl-12 font-semibold">
                  {" "}
                  ☑ Master cylinder, Brake Booster, Vacuum pump, <br />
                  Callipers, ABS ECU with modulator, Wheel speed <br />
                  sensor, Brake pedal switch.{" "}
                </p>
                <p>
                  ☒ Damage due to any external influence <br />
                  ☒ Damage due to lack of maintenance <br />
                  ☒ Wheel cylinder <br />
                  ☒ Brake Pads, drums <br />
                  ☒ Brake Disc <br />
                  ☒ Parking brake mechanism <br />
                  ☒ Wheel bearings <br />
                </p>
              </span>
            </div>
            <div className="flex flex-row   ">
              <span className="text-2xl font-bold text-[40px] bg-[#1a1f3d] text-white p-12  ">
                007
              </span>
              <div className=" -rotate-90 bg-[#ebf6ff] w-[300px]  font-semibold h-16  -ml-[6.4%] text-center mt-16 ">
                IN ELECTRICALS
              </div>
              <span className="bg-white grid grid-cols-2 p-6 -ml-[3%] w-full  justify-center items-center">
                <p className=" font-semibold">
                  ☑ Wiper and washer motor, Window motors, <br />
                  Fan motors, Panel switches and instruments, <br />
                  Driver information system, Body control module, <br />
                  Ambient temp sensor, Rain light sensor, <br />
                  Blue tooth box, Rear view camera, Window <br />
                  winding controller, Electrical ORVM, <br />
                  Combination Switch.
                </p>
                <p className="-ml-6">
                  ☒ Sensor failing due to burning/heat,
                  <br />
                  ☒ Sensors failing due to any external influence,
                  <br />
                  ☒ Sulphation to any component
                  <br />
                  ☒ Horn
                  <br />
                  ☒ Relays/Fuses
                  <br />
                  ☒ Bulbs, Lamps
                  <br />☒ Water Entry in any component
                </p>
              </span>
            </div>{" "}
            <div className="flex flex-row   ">
              <span className="text-2xl font-bold text-[40px] bg-[#1a1f3d] text-white px-12 py-16  ">
                008
              </span>
              <div className=" -rotate-90 bg-[#ebf6ff]  w-[250px]  text-center font-semibold h-16  -ml-[81px] mt-[5%] pl-6">
                IN AIR CONDITIONING
              </div>
              <span className="bg-[#ebf6ff] grid grid-cols-2 p-6 -ml-[5.5%] w-full  justify-center items-center">
                <p className="pl-12">
                  ☑ AC compressor, Condenser, Evaporator, AC
                  <br />
                  control Panel, Thermal expansion valve,
                  <br />
                  Blower motor, Heater unit, Automatic climate
                  <br />
                  control switch
                  <br />
                </p>
                <p>
                  ☒ AC Gas, All hoses <br />☒ Damage due to any external
                  influence
                </p>
              </span>
            </div>{" "}
            <div className="flex flex-row   ">
              <span className="text-2xl font-bold text-[40px] bg-[#1a1f3d] text-white px-12 py-20  ">
                009
              </span>
              <div className=" -rotate-90 bg-[#ebf6ff]  w-[220px] text-center font-semibold h-16  -ml-[68px] mt-[115px] pl-6">
                IN SAFETY SYSTEM & AGGREGATE PARTS
              </div>
              <span className="bg-white grid grid-cols-2 p-6 -ml-[6%] w-full  justify-center items-center">
                <p className="pl-16">
                  ☑ Airbag control Unit, Cruise Control Unit
                </p>
                <p className="ml-3">
                  ☒ Deflation of air bag or accident
                  <br />
                  ☒ Any items which are not factory fitted
                  <br />
                  ☒ GPS/Navigation Unit
                  <br />
                  ☒ Tyre
                  <br />
                  ☒ Aux Batteries ☒ Seats
                  <br />
                  ☒ Speakers
                  <br />
                  ☒ Chassis frame
                  <br />
                  ☒ Rear dead axle body parts
                  <br />
                </p>
              </span>
            </div>{" "}
            <div className="flex flex-row  ">
              <span className="text-2xl font-bold text-[40px] bg-[#1a1f3d] text-white py-20 px-12  ">
                010
              </span>
              <div className=" -rotate-90 bg-[#ebf6ff] text-center w-[250px]  font-semibold h-16  -ml-[78px] mt-[5%] pl-6">
                In Charging & Power System
              </div>
              <span className="bg-[#ebf6ff] grid grid-cols-2 p-6 -ml-[5.5%] w-full  justify-center items-center">
                <p className="pl-12">
                  ☑ Charging socket, HV lines, Power distribution <br />
                  Unit, DC DC Convertor, On- board charger, <br />
                  VECU
                </p>
                <p>
                  ☒ Home charging Cable 010 <br /> ☒ Home charging board
                </p>
              </span>
            </div>
            <div className="flex flex-row   mb-[68%] ">
              <span className="text-2xl font-bold text-[40px] bg-[#1a1f3d] text-white py-20 px-12  ">
                011
              </span>
              <div className=" -rotate-90 bg-[#ebf6ff]  w-[200px]  font-semibold h-16  -ml-[58px] mt-[5.2%] pl-6">
                In Ignition System
              </div>
              <span className="bg-[#ebf6ff] grid grid-cols-2 p-6 -ml-[4.5%] w-full  justify-center items-center">
                <p className="pl-14">☑ Ignition switch, Immobilizer ECU</p>
                <p>☒ Any consequential loss due to negligence</p>
              </span>
            </div>
          </div>

          <div className="mb-[50%]">
            <img src={pdfHeaderThree} alt="header" loading="lazy" />
            <div className="grid grid-cols-2 ">
              <span>
                <div className="p-4">
                  <h3 className="flex items-start space-x-2 text-lg font-semibold ">
                    <span className="bg-[#1a1f3d] text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">
                      <span className="-mt-2">1</span>
                    </span>
                    <span>
                      What are the steps that I should follow to keep my
                      warranty benefits intact?
                    </span>
                  </h3>
                  <ul className="mt-2 space-y-2">
                    <li>
                      ☑ Ensure you service your vehicle always at
                      manufacturer-authorized workshops.
                    </li>
                    <li>
                      ☑ Preserve all the documents of services for future
                      concerns
                    </li>
                  </ul>
                </div>

                <div className="p-4">
                  <h3 className="flex items-start space-x-2 text-lg font-semibold ">
                    <span className="bg-[#1a1f3d] text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">
                    <span className="-mt-2">2</span>
                    </span>
                    <span>
                      What are common reasons of claim rejections and how to
                      avoid mistakes during claims?
                    </span>
                  </h3>
                  <ul className="mt-2 space-y-2">
                    <li>
                      {" "}
                      ☑ Vehicle maintenance services are not proper, either
                      skipped or delayed.
                    </li>
                    <li>
                      ☑ Vehicle is repaired/serviced outside the OEM authorized
                      workshops.
                    </li>
                    <li>
                      ☑ Negligence resulting in consequential loss (For example,
                      in case of black smoke or oil leakage through any
                      component and if the vehicle is driven in spite of
                      warnings then there are high chances of other parts
                      getting damaged) and such related losses are not covered.
                    </li>
                  </ul>
                </div>

                <div className="p-4">
                  <h3 className="flex items-start space-x-2 text-lg font-semibold ">
                    <span className="bg-[#1a1f3d] text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">
                    <span className="-mt-2">3</span>
                    </span>
                    <span>
                      Is periodic service like changing oil, filters etc.
                      covered under this policy?
                    </span>
                  </h3>
                  <ul className="mt-2 space-y-2">
                    <li>
                      ☑ No, these are mandatory services which should be done by
                      you to keep your car away from any potential failures
                    </li>
                  </ul>
                </div>

                <div className="p-4">
                  <h3 className="flex items-start space-x-2 text-lg font-semibold ">
                    <span className="bg-[#1a1f3d] text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">
                    <span className="-mt-2">4</span>
                    </span>
                    <span>
                      My policy has an error and I need to rectify the same,
                      whom do I contact to get it done?
                    </span>
                  </h3>
                  <ul className="mt-2 space-y-2">
                    <li>
                      ☑ There is one way to get it done, however this needs to
                      be done within 15 days from the date of issuance of the
                      policy. An email needs to be written along with the policy
                      document to ew@mghyderabad.com
                    </li>
                  </ul>
                </div>

                <div className="p-4">
                  <h3 className="flex items-start space-x-2 text-lg font-semibold ">
                    <span className="bg-[#1a1f3d] text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">
                    <span className="-mt-2">5</span>
                    </span>
                    <span>
                      Is my policy transferable in case if I sell my vehicle to
                      another buyer?
                    </span>
                  </h3>
                  <ul className="mt-2 space-y-2">
                    <li>
                      ☑ Yes, however the new owner needs to contact us to get
                      the details changed on the policy within 15 days of
                      transfer of ownership of vehicle. How
                    </li>
                  </ul>
                </div>

               
              </span>
              <span>
                <div className="p-4 ">
                  <ul className="mt-2 space-y-2">
                    <li>
                      ever, only the unused portion of the warranty shall be
                      transferred to the new customer.
                    </li>
                  </ul>
                </div>
                <div className="p-4 ">
                  <h3 className="flex items-start space-x-2 text-lg font-semibold ">
                    <span className="bg-[#1a1f3d] text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">
                    <span className="-mt-2">6</span>
                    </span>
                    <span>When can I cancel this policy?</span>
                  </h3>
                  <ul className="mt-2 space-y-2">
                    <li>
                      ☑ 100% refund is applicable in case if the policy is
                      canceled within 15 days of the issuance. This is called
                      free look up period. Refund is applicable in case there is
                      no claim made under this policy.
                    </li>
                  </ul>
                </div>
              </span>
            </div>
          </div>
          <div className="mt-9">
            <img src={pdfHeaderFour} alt="header" loading="lazy" />

            <div className="p-6 ">
              {/* Coverage Section */}
              <div className="bg-blue-900 text-white font-bold p-2 rounded pb-4">
                1. COVERAGE
              </div>
              <div className="p-4 text-gray-900 space-y-4">
                <div>
                  <h3 className="font-bold text-blue-500">
                    (A) COVERAGE BASIS
                  </h3>
                  <p>
                    The policy is issued based on the details provided by the
                    vehicle owner, with the applicable amount paid as stated in
                    the policy schedule.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-blue-500">
                    (B) SCOPE OF COVERAGE
                  </h3>
                  <ul className="list-disc list-inside">
                    <li>
                      Covers repair or replacement costs for covered mechanical
                      and electrical components in case of failure due to
                      manufacturing defects, as per OEM specifications.
                    </li>
                    <li>
                      The liability of the company will not exceed the coverage
                      amount specified in the policy schedule.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-blue-500">
                    (C) TOWING & BREAKDOWN ASSISTANCE
                  </h3>
                  <ul className="list-disc list-inside">
                    <li>
                      Towing service to the nearest authorized service center
                      (as per policy terms).
                    </li>
                    <li>
                      Onsite repair assistance for minor issues, including
                      battery jump-start, tire replacement, and minor repairs.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-blue-500">
                    (D) CHILD PART COVERAGE* (IF OPTED)
                  </h3>
                  <ul className="list-disc list-inside">
                    <li>Can be availed only on a "Reparation Basis".</li>
                    <li>
                      Covers repair or replacement of a specific child part in
                      case of failure due to manufacturing defects.
                    </li>
                    <li>
                      The coverage amount applies to a single child part and
                      cannot be utilized for multiple parts.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-blue-500">
                    (E) CLAIM SETTLEMENT
                  </h3>
                  <p>
                    Claims will be settled as per the coverage amount, and once
                    fully utilized, reinstatement is not applicable.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-blue-500">
                    (F) EXCLUSIONS & LIMITATIONS
                  </h3>
                  <p>
                    The policy is subject to specific terms, conditions, and
                    exclusions as outlined in the policy schedule.
                  </p>
                </div>
              </div>

              {/* Extensions Section */}
              <div className="bg-blue-900 text-white font-bold p-2 rounded mt-6">
                2. EXTENSIONS
              </div>
              <div className="p-4 text-gray-900 space-y-4">
                <div>
                  <h3 className="font-bold">• "Battery Assistance":</h3>
                  <p>
                    Jump-start service provided if the vehicle is immobilized
                    due to a flat battery within 100 km from the city center of
                    the owner's residence.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">• "Flat Tyre Assistance":</h3>
                  <p>
                    Onsite help for refilling or replacing a flat tyre within a
                    safe area within 100 km from the city center of the owner's
                    residence.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">• "Minor Repairs":</h3>
                  <p>
                    Basic mechanical or electrical repairs will be arranged to
                    make the vehicle mobile again if it breaks down within 100
                    km from the city center.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">• "Towing Facility":</h3>
                  <p>
                    In case of a breakdown, the vehicle will be towed to the
                    nearest preferred workshop within 100 km from the city
                    center.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">• *Emergency Message Relay*:</h3>
                  <p>
                    Urgent messages can be sent to specified contacts upon the
                    owner’s request in case of a breakdown.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold">Additional Conditions:</h3>
              <p>
                {" "}
                <b>a. Ownership Transfer:</b> Roadside assistance benefits
                expire upon the transfer of vehicle ownership.{" "}
              </p>
              <p>
                {" "}
                <b>b. Usage Limit</b> Services can be used up to **4 times per
                policy period*{" "}
              </p>
            </div>
          </div>
          <div className="p-6 ">
            {/* General Exclusions Section */}
            <div className="bg-blue-900 text-white font-bold p-2 rounded pb-4">
              3. GENERAL EXCLUSIONS (APPLICABLE TO ALL TYPES OF
              VEHICLES/EQUIPMENT)
            </div>
            <div className="p-4 text-gray-900 space-y-2">
              <p className="font-bold">No Coverage for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Claims beyond the policy’s expiry date or kilometer limit.
                </li>
                <li>
                  Repairs or replacements covered under manufacturer or extended
                  warranties.
                </li>
                <li>Deductibles mentioned in the policy.</li>
                <li>
                  Damage due to accidents where the vehicle is still
                  operational.
                </li>
                <li>
                  Issues caused by neglecting periodic maintenance or servicing
                  at unauthorized workshops.
                </li>
                <li>
                  Breakdowns due to overloading, misuse, or exceeding
                  manufacturer limits.
                </li>
                <li>
                  Damage from natural disasters, riots, terrorism, or vandalism.
                </li>
                <li>
                  Theft or loss of personal belongings inside the vehicle.
                </li>
                <li>
                  Consequential damage from continued use despite known defects.
                </li>
                <li>
                  Claims covered under another policy, manufacturer recalls, or
                  warranty.
                </li>
                <li>
                  Replacement of consumables like fuel, oil, batteries, or
                  maintenance parts.
                </li>
                <li>Unauthorized repairs or use of non-genuine parts.</li>
                <li>Vehicle modifications not approved by the manufacturer.</li>
                <li>
                  Damage due to illegal activities, racing, or off-road use.
                </li>
                <li>Natural claims or intentional damage.</li>
                <li>
                  Additional costs beyond policy limits, such as extra towing or
                  accommodation.
                </li>
                <li>
                  Minor inconveniences like noises, vibrations, or normal wear
                  and tear.
                </li>
                <li>
                  Electrical or mechanical failures caused by unreported short
                  circuits or overheating.
                </li>
                <li>
                  Software or firmware issues, coolant, or dirt contamination.
                </li>
                <li>
                  External electronic components like roadside assistance or
                  incidental costs.
                </li>
                <li>Delays in notifying or reporting claims.</li>
                <li>
                  Cyber risks, electronic malfunctions unrelated to performance.
                </li>
                <li>
                  Wearable issues like scratches, touch screen malfunctions,
                  upholstery, or tires.
                </li>
                <li>
                  Routine maintenance tasks like oil changes, wheel balancing,
                  or AC servicing.
                </li>
                <li>
                  Wear-tear and non-insurable components like glass, batteries,
                  and seats.
                </li>
                <li>Rust, corrosion, or sheet metal problem.</li>
                <li>
                  Engine or fuel system damage due to poor-quality fuel or
                  starvation.
                </li>
                <li>Poor workmanship or third-party repair damage.</li>
                <li>
                  Legal liabilities, third-party injuries, or property damage.
                </li>
                <li>Unauthorized modifications, leading to damage.</li>
                <li>
                  Any dismantling or additional work beyond approved repairs.
                </li>
              </ul>
            </div>

            {/* General Definitions Section */}
            <div className="bg-blue-900 text-white font-bold p-2 rounded mt-6 pb-4">
              4. GENERAL DEFINITIONS
            </div>
            <div className="p-6 text-gray-900 space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Claims made after the policy expiry date or exceeding the
                  kilometer limit.
                </li>
                <li>
                  Replacement of parts already covered under the manufacturer’s
                  standard or extended warranty.
                </li>
                <li>Deductibles as specified in the policy.</li>
                <li>
                  . Damage from accidents that do not involve a
                  mechanical/electrical breakdown.{" "}
                </li>
                <li>
                  Failure caused by neglecting periodic maintenance or servicing
                  at unauthorized workshops.{" "}
                </li>
                <li>
                  Damage due to misuse, overloading, or exceeding
                  manufacturer-specified limits.
                </li>
              </ul>
            </div>
          </div>
          <div className="p-6 text-gray-900 space-y-2">
            <p className="font-bold">No Coverage for:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Losses due to natural disasters, war, riots, terrorism, or
                vandalism.
              </li>
              <li>Theft or loss of personal belongings inside the vehicle.</li>
              <li>Damage from continued vehicle use despite known defects.</li>
              <li>
                Claims covered under another warranty, recall campaign, or
                manufacturer’s warranty.
              </li>
              <li>
                Replacement costs for battery, fluids, consumables, and routine
                maintenance parts.
              </li>
              <li>
                Repairs using non-genuine parts or servicing at unauthorized
                workshops.
              </li>
              <li>
                Damage caused by improper use, overloading, or unauthorized
                modifications.
              </li>
              <li>Losses from racing, off-roading, or illegal activities.</li>
              <li>Fraudulent claims, intentional damage, or negligence.</li>
              <li>
                Expenses beyond policy limits, such as taxes, excess towing, and
                extra accommodation.
              </li>
              <li>
                Minor issues like noise, vibration, or normal wear that do not
                affect functionality.
              </li>
              <li>
                Mechanical/electrical failures due to overheating, short
                circuits, or lack of proper tools/spares.
              </li>
              <li>
                Damage from poor-quality fuel, coolant, lubricants, or hydraulic
                lock.
              </li>
              <li>
                Costs for roadside assistance, towing, or incidental breakdown
                expenses.
              </li>
              <li>
                Repairs for parts still under the manufacturer’s warranty.
              </li>
              <li>
                Warranty voided due to odometer tampering or unreported issues
                before repair.
              </li>
              <li>
                Cyber-related issues or electronic malfunctions unrelated to
                vehicle performance.
              </li>
              <li>Additional repairs beyond covered components.</li>
              <li>
                Continued vehicle use despite known defects voids the warranty.
              </li>
              <li>
                Claims resulting from the installation of non-approved add-ons.
              </li>
              <li>
                Wear-and-tear on external parts, paint, upholstery, or damage
                from environmental factors.
              </li>
              <li>
                Repairs for entertainment, navigation, or control systems
                (audio, video, electronics).
              </li>
              <li>
                Failures of non-covered parts affecting covered components.
              </li>
              <li>
                Routine maintenance jobs such as cleaning, polishing, fluid
                changes, tuning, and alignment.
              </li>
              <li>
                Non-maintenance issues due to lack of care, including spark
                plugs, brake pads, filters, belts, hose, seats, batteries,
                tires, and glass components.
              </li>
              <li>
                Routine replacement of fluids, oils, coolants, AC gas, and
                grease, except when required for a covered repair.
              </li>
              <li>
                Rusting, perforation of sheet metal, or catalytic
                converter/silencer corrosion.
              </li>
              <li>
                Engine or fuel system damage due to poor-quality or contaminated
                fuel, coolant, or lubricants.
              </li>
              <li>
                Failures caused by water entry, turbocharger, or differential
                due to hydrostatic lock or oil starvation.
              </li>
              <li>Losses caused by poor workmanship.</li>
              <li>Claims made after the policy limit has expired.</li>
              <li>
                Any consequential damage, third-party liability, personal
                injury, or property damage.
              </li>
              <li>
                Damage from non-manufacturer-approved accessories or
                modifications.
              </li>
              <li>
                Issues related to unauthorized tampering or failure to report
                issues before repairs.
              </li>
              <li>
                Claims in non-covered parts, even if they impact covered
                components.
              </li>
              <li>
                Costs for external expenses like lodging, meals, towing, or
                commercial losses due to vehicle breakdown.
              </li>
              <li>
                Failures in non-covered entertainment, navigation, or control
                electronics (audio, video, communication systems).
              </li>
            </ul>
          </div>
          <div className="bg-blue-900 text-white font-bold p-2 rounded pb-4">
          <span className="-mt-3">

            5. GENERAL CONDITIONS
          </span>
          </div>{" "}
          <ul className=" list-inside space-y-1 my-4">
            <li>
              Notify the warranty in writing within 3 days of any event that may
              lead to a claim.
            </li>
          </ul>
          <div className="bg-blue-900 text-white font-bold p-2 rounded mt-12 pb-4">
          <span className="-mt-3">

            6. CUSTOMER SUPPORT
            </span>
          </div>
          <ul className=" list-inside space-y-1 my-4">
            <li>
              For complaints or queries, contact the customer service team at
              1800 209 8383.
            </li>
          </ul>
          <div className="flex border overflow-hidden shadow-md "></div>
        </div>
      </div>
      <p className="mt-12 font-semibold">ew@360carprotect.in | 18002091030</p>
    </div>
  );
});

export default EwPdf;
