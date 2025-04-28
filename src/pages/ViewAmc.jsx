import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { getAMCbyId } from "../features/AMCapi";
import Loader from "../Components/Loader";
import { formatDate } from "../helper/commonHelperFunc";
import { stamp } from "../assets";


const paragraphStyle = {
  paddingLeft: '2.5em',
  textIndent: '-2.5em',
  lineHeight: '1.5',
};
const ViewAmc = forwardRef(({ id }, ref) => {
  const [data, setData] = useState();
  const location = useLocation();
  const amcId = id ? id : location?.state?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAMCbyId(amcId, null);
        setData(res?.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [amcId]);

  const pdfRef = useRef();
  const handleDownloadPDF = () => {
    const input = pdfRef.current;
    const opt = {
      margin: 0,
      filename: `${data?.vehicleDetails?.vinNumber}_AMC` || "360_Invoice",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: "avoid-all" },
    };
    html2pdf().from(input).set(opt).save();
  };

  useImperativeHandle(ref, () => ({
    handleDownloadPDF,
  }));
  if (!data) {
    return (
      <div className="mt-16 flex justify-center md:ml-32 sm:ml-32">
        {/* <Loading customText={"Loading"} /> */}
        <Loader />
      </div>
    );
  }

  return (
    <div ref={pdfRef} className=" p-6 font-body m-3 text-[13px] mx-20">
      <div className="flex flex-col items-start justify-center text-[14px]">
        <div>
           <h2
            className="text-[16px]  text-center font-bold underline"
            style={{ margin: 0 }}
          >
             {
          data?.customerDetails?.amcType === "AMC Assured" ?  "RG ASSURED AMC"  : "RG AMC AGREEMENT"}
          </h2>{
            data?.customerDetails?.amcType !== "AMC Assured" ?
          
          <h3 className=" pt-3 text-start" style={{ margin: 0 }}>
            This RG Annual Maintenance Contract Agreement <b>(“Agreement”)</b>{" "}
            is between the dealer,<b> Raam 4 Wheelers LLP(Raam) </b> and the{" "}
            <b> Customer/owner of the below mentioned MG Car.</b>
          </h3>
          :
          <h3 className=" pt-3 text-start" style={{ margin: 0 }}>
          This RG Assured Maintenance Contract Agreement <b>(“Agreement”)</b>{" "}
          is between the dealer,<b> Raam 4 Wheelers LLP(Raam/RG) </b> and the{" "}
          <b> Customer/owner of the below mentioned MG Car.</b>
        </h3>}
          <h3 className="pt-3" style={{ margin: 0 }}>
            The Dealer and the Customer hereinafter individually called "the
            Party" and collectively called the Parties”.
          </h3>
        </div>
        {/* Invoice Header */}
        <table
          style={{
            borderCollapse: "collapse",
            width: "50%",
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                  backgroundColor: "#f2f2f2",
                }}
              >
                Model
              </th>
              <th
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                  backgroundColor: "#f2f2f2",
                }}
              >
                VIN
              </th>
              {
data?.customerDetails?.amcType === "AMC Assured" &&

<th
style={{
  border: "1px solid #000",
  padding: "10px",
  backgroundColor: "#f2f2f2",
}}
>
Customer Name
</th>
              }
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                }}
              >
                {data?.vehicleDetails?.model || "NA"}
              </td>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                }}
              >
                {data?.vehicleDetails?.vinNumber || "NA"}
              </td>
              {
data?.customerDetails?.amcType === "AMC Assured" &&
              
                <td
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                }}
              >{
data?.customerDetails?.customerName
 || "NA"}
              </td>}
            </tr>
          </tbody>
        </table>
        <div className="mt-9">
          <p className="font-semibold underline">Details of the Agreement</p>
          {
data?.customerDetails?.amcType !== "AMC Assured" &&
<>
          <p>
            The service package has been named as “RG Annual Maintenance
            Contract”;
          </p>
          <p>
            Fuel Type: {data?.vehicleDetails?.fuelType || "NA"}
          </p></>}
          <p>
            Agreement Period: {data?.vehicleDetails?.agreementPeriod || "NA"}
          </p>
          <p>
            Agreement Start date:{" "}
            {formatDate(data?.vehicleDetails?.agreementStartDate)}
          </p>
          <p>
            Agreement Valid Date:
            {formatDate(data?.vehicleDetails?.agreementValidDate)}
          </p>
          <p>
            Agreement Start Milage :{" "}
            {data?.vehicleDetails?.agreementStartMilage}
          </p>
          <p>
            Agreement Valid Milage: {data?.vehicleDetails?.agreementValidMilage}{" "}
            kms/Running of the vehicle, whichever of the two occurs earlier.
          </p>
          {
 data?.customerDetails?.amcType !== "AMC Assured" && 
          <p>
            Maximum Valid Number of PMS: {data?.vehicleDetails?.MaximumValidPMS}
          </p>
          }
          <p>Location of the Dealer: {data?.vehicleDetails?.dealerLocation}</p>
        </div>

     {
          data?.customerDetails?.amcType === "AMC Assured" && 
        
   <p> <br />AMC Amount: <span style={{ textDecoration: "underline" }}>{(parseFloat(data?.vehicleDetails?.total) / 1.3).toFixed(2)}</span> (Refundable only if the vehicle is sold to Raam within the Agreement Period) <br />  <br />
   Assured AMC Premium Amount: INR <span style={{ textDecoration: "underline" }}>
  {(parseFloat(data.vehicleDetails.total) - (parseFloat(data.vehicleDetails.total) / 1.3)).toFixed(2)} </span>  (Refundable only if Raam is unable to match the price offered to you in the market before selling the vehicle, and Raam is unable or unwilling to match the offer within the Agreement Period).</p>}
       {
         data?.customerDetails?.amcType !== "AMC Assured" ?
        <p className=" italic mt-4">
          By enrolling in the RG AMC or availing its benefits, you acknowledge
          that you have read, understood, and agree to be bound by the following
          Terms and Conditions. If you do not agree, please revert on the email
          within 7 days from the date of policy generation
        </p> :
        <p className=" italic mt-4">
       By enrolling in the RG Assured AMC or availing its benefits, you acknowledge that you have read, understood, and agree to be bound by the following Terms and Conditions. If you do not agree, please revert on the email within 7 days from the date of policy generation.

        </p>}

        {!(location?.pathname === "/amc-view" ) && (data?.customerDetails?.amcType === "AMC" ) ?(
          <>
            <h2>Maintenance Agreement</h2>
            <p className="mt-3">
              <strong>Whereas:</strong>
            </p>
            <ol>
              <li>
                Raam provides maintenance services to the Vehicles of the
                Customer for the agreed period;
              </li>
              <li>
                Customer is desirous of entering into a RG Annual Maintenance
                Contract (“RG AMC”) plan provided by the Dealer for their
                Vehicle;
              </li>
              <li>
                Therefore, the Parties have agreed to enter into this Agreement,
                upon and subject to mutual terms and conditions thereof.
              </li>
            </ol>
            <p className="mt-3">
              <strong>
                WHEREBY IT IS AGREED between the Parties as follows:
              </strong>
            </p>
            <h3 className="font-bold">1. Scope of this Agreement:</h3>
            <p>
              1.1. This Agreement is applicable only for the Vehicle described
              above.
            </p>
            <br />
            <h3 className="font-bold">
              2. Term and Termination of this Agreement:
            </h3>
            <p>
              2.1. The AMC shall commence on the Agreement Start Date* and
              remain in effect for the Agreement Period*, unless terminated
              earlier upon the occurrence of any of the following events:
            </p>
            <ol
              style={{
                listStyleType: "lower-alpha",
                paddingLeft: "20px",
                lineHeight: "1.6",
              }}
            >
              <li>The Agreement Valid Date* is reached;</li>
              <li>The Agreement Valid Mileage* is exceeded;</li>
              <li>
                A breach or violation of any clause or obligation by the
                Customer;
              </li>
              <li>
                The Dealer's obligation to provide aftersales services is
                terminated; or
              </li>
              <li>
                Termination of this Agreement as provided under any other clause
                of this Agreement.
              </li>
            </ol>
            <p>
              2.2. The Agreement Period* cannot be extended further from the
              stipulated period for any.
            </p>

            <div>
              <p className="ml-6 mt-9">
                {" "}
                reason including for any of the services skipped/missed by the
                Parties.
              </p>
              <p className="italic mt-3">
                *The specific dates and details of the Agreement Period, Valid
                Date, and Valid Mileage are as specified in this Agreement.
              </p>
              <h2 className="font-bold mt-4">3. Features of AMC</h2>
              <h3 className="font-bold underline">3.1. Coverage:</h3>
              <h4 className="ml-3">
                3.1.1. For I.C.E (Internal Combustion Engine, Fuel Type –
                Petrol/Diesel):
              </h4>
              <ol
                type="a"
                className="ml-9"
                style={{
                  listStyleType: "lower-alpha",
                  paddingLeft: "20px",
                  lineHeight: "1.6",
                }}
              >
                <li>
                  Periodic service as per the manufacturer's recommendations.
                </li>
                <li>
                  Check/Replacement of: Oil filter, Air filter/s, A/c dust
                  filter/s, Gasket drain plug, Fuel filter, Transmission filter
                  as required during periodic service interval,
                </li>
                <li>
                  Replacement/Topping-up: Engine oil, Brake fluid, Windshield
                  washer fluid, Transmission oil, Coolant as required during
                  periodic service interval
                </li>

                <li>
                  Complete vehicle inspection & checks as recommended by MG.
                </li>
                <li>
                  Vehicle washing and vacuum cleaning during the periodic
                  service.
                </li>
                <li>Wheel alignment & Wheel balancing.</li>
                <li>
                  If the vehicle has a sunroof, it includes applying sunroof
                  grease for maintenance.
                </li>
                <li>
                  Pick and Drop of your MG vehicle for the Preventive
                  Maintenance Services covered under the AMC package.
                  <strong>Free Pick up and Drop</strong> is only applicable for
                  Vehicles in Hyderabad Premises.
                </li>
                <li>
                  i). Discount of Rs.2,000 on any of the following Value-Added
                  Services:
                  <li className="pt-3">3M MG Engine Compartment clean</li>
                  <li>3M AC Vent Disinfectant</li>
                  <li>3M Exterior Beautification</li>
                  <li>3M Premium Interior Cleaning (Foam)</li>
                  <li>3M Anti Microbial smoggy</li>
                  <li>3M AC Evaporator Cleaning</li>
                </li>
              </ol>

              <h4 className="mt-4">3.12 For EV (Electric Vehicles):</h4>
              <ol
                type="a"
                style={{
                  listStyleType: "lower-alpha",
                  paddingLeft: "20px",
                  lineHeight: "1.6",
                }}
              >
                <li>
                  Periodic service as per the manufacturer's recommendations.
                </li>
                <li>
                  Check/Replacement of Air filter/s as required during periodic
                  service interval
                </li>
                <li>
                  Replacement/Topping-up Brake fluid, Windshield washer fluid,
                  Transmission oil, Coolant as required during periodic service
                  interval,
                </li>
                <li>
                  Complete vehicle inspection & checks as recommended by MG.
                </li>
                <li>
                  Vehicle washing and vacuum cleaning during the periodic
                  service.
                </li>
                <li>Wheel alignment & Wheel balancing.</li>
                <li>
                  If the vehicle has a sunroof, it includes applying sunroof
                  grease for maintenance.
                </li>
                <li>
                  Pick and Drop of your MG vehicle for the Preventive
                  Maintenance Services covered under the AMC package.
                  <strong>Free Pick up and Drop</strong> is only applicable for
                  Vehicles in Hyderabad Premises.
                </li>
                <li className="mt-4">
                  Discount of Rs.2,000 on any of the following Value-Added
                  Services:
                  <ol
                    className="mt-3"
                    style={{
                      listStyleType: "lower-alpha",
                      paddingLeft: "20px",
                      lineHeight: "1.6",
                    }}
                  >
                    <li>3M MG Engine Compartment clean</li>
                    <li>3M AC Vent Disinfectant</li>
                    <li>3M Exterior Beautification</li>
                    <li>3M Premium Interior Cleaning (Foam)</li>
                  </ol>
                </li>
              </ol>

              <div>
                <h3>3M Anti Microbial smoggy</h3>
                <h3>3M AC Evaporator Cleaning</h3>
                <p className="font-medium">
                  <span className="underline">3.2. Limitations:</span>
                  RG AMC (AMC) DOES NOT INCLUDE the following:
                </p>
                <ol
                  type="a"
                  style={{
                    listStyleType: "lower-alpha",
                    paddingLeft: "20px",
                    lineHeight: "1.6",
                  }}
                >
                  <li>
                    The rectification of damage caused by:
                    <ol
                      type="i"
                      style={{
                        listStyleType: "lower-roman",
                        paddingLeft: "20px",
                      }}
                    >
                      <li>Accidents or external influences.</li>
                      <li>
                        The use in Vehicle of parts other than original MG spare
                        parts sold by MG India authorised workshop.
                      </li>
                      <li>
                        The use in the Vehicle of oils or other service products
                        which have not been approved/supplied by MG India Ltd.
                        and its Dealers.
                      </li>
                      <li>
                        Neglect, misuse, abuse or improper handling of a Vehicle
                        and unauthorised modifications made to a Vehicle by the
                        Customer or any third party.
                      </li>
                      <li>
                        The use of a Vehicle for any application other than
                        normal road use such as for the carriage of goods, or
                        any specialist application, etc.
                      </li>
                    </ol>
                  </li>
                  <li>
                    The repair or maintenance of any part not mentioned in the
                    list of inclusions above.
                  </li>
                  <li>
                    Inspection & replacement of wear & tear related parts such
                    as brake pads, brake discs, brake wear sensors and wiper
                    blades, V-belts, Timing Belt etc.
                  </li>
                  <li>Replacement of Tyres.</li>
                  <li>
                    Any damage to the fuel system parts due to water,
                    adulteration or foreign objects in the fuel.
                  </li>
                  <li>The maintenance and/or repairs of any paint work.</li>
                  <li>
                    The carrying out of any modifications required by law.
                  </li>
                  <li>
                    Any measures required by the Owner's Manual for a Vehicle to
                    be carried out in preparing a Vehicle for storage for an
                    extended period of time and the elimination of damage
                    arising during any such period of storage (hose cuts,
                    cracks, deformation of components, etc.).
                  </li>
                  <li>
                    The rectification of any damage or other work arising as a
                    consequence of the Customer refusing, or failing to make a
                    Vehicle available in the workshop of RAAM MG Dealer’s
                    Workshop.
                  </li>
                  <li>
                    Repairs carried out under any warranty given at the time of
                    sale of a Vehicle.
                  </li>
                  <li>
                    Any damages caused by 'force majeure' such as earthquake,
                    vandalism, floods, etc.
                  </li>
                </ol>
                <h3 className="font-bold">4. Dealer's Obligations:</h3>
                <ol type="1" style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
                  <li>
                    4.1 The Dealer shall perform all services covered under the
                    AMC with reasonable skill, care, and diligence, in
                    accordance with the manufacturer’s guidelines and
                    recommended practices.
                  </li>
                  <li>
                    4.2 The Dealer shall use only genuine MG parts, fluids, and
                    components during the execution of any services, repairs, or
                    replacements under the AMC.
                  </li>
                  <li>
                    4.3 The Dealer shall provide periodic maintenance and
                    inspections of the Vehicle as per the schedule specified in
                    the AMC, ensuring the efficient, safe, and reliable
                    operation of the Vehicle.
                  </li>
                  <li>
                    4.4 The Dealer shall promptly inform the Customer of any
                    additional repairs or services needed outside the scope of
                    the AMC and shall not proceed with such work without prior
                    approval from the Customer.
                  </li>
                  <li>
                    4.5 The Dealer agrees to arrange for the execution and
                    performance of the agreed Works at regular intervals during
                    the specified period, unless otherwise directed in writing
                    by the Customer. However, the Dealer's obligation to perform
                    the Works is subject to:
                    <ol type="1" style={{ paddingLeft: "20px" }}>
                      <li>
                        4.5.1 The Customer's compliance with all terms and
                        conditions of this Agreement, including timely payment
                        of any applicable fees.
                      </li>
                    </ol>
                  </li>
                </ol>
              </div>

              <div className="pt-20">
                <ol type="1" style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
                  <li>
                    4.5.2 The availability of necessary parts, components, and
                    resources required for the performance of the Works, which
                    may be affected by factors beyond the Dealer's reasonable
                    control;
                  </li>
                  <li>
                    4.5.3 The Vehicle being maintained in a condition that
                    allows for the effective execution of the Works, as
                    recommended by the manufacturer; and
                  </li>
                  <li>
                    4.5.4 Any other limitations or conditions outlined in this
                    Agreement.
                  </li>
                </ol>
                <p>
                  <strong>4.6.</strong> The Dealer reserves the absolute
                  discretion to install any genuine MG part or parts deemed
                  necessary to ensure the efficient, safe, and reliable
                  operation of the Vehicle. The Customer agrees that such
                  decisions by the Dealer shall be final and binding, provided
                  that the parts installed are in accordance with the
                  manufacturer’s specifications.
                </p>
                <h3 className="font-bold my-3">5. Customer's Obligations</h3>
                <p>The Customer agrees:</p>
                <ol type="1" style={{ paddingLeft: "30px", lineHeight: "1.6" }}>
                  <li>
                    <strong>
                      5.1 Vehicle Availability and Timely Servicing
                    </strong>
                    <ol type="1" style={{ paddingLeft: "20px" }}>
                      <li>
                        5.1.1 The Customer shall make the Vehicle available at
                        the Nominated Workshop by prior appointment during the
                        workshop’s regular working hours.
                      </li>
                      <li>
                        5.1.2 The Customer agrees to present the Vehicle for
                        servicing at or within the prescribed period before the
                        relevant service interval as per the terms of this
                        Agreement. Failure to do so shall void the Dealer's
                        obligations under the AMC.
                      </li>
                      <li>
                        5.1.3 The Customer shall also make the Vehicle available
                        as and when reasonably requested by the Dealer for
                        preventive treatments, inspections, or checks to ensure
                        optimal Vehicle performance.
                      </li>
                    </ol>
                  </li>
                  <li>
                    <strong>
                      5.2 Adherence to Owner's Manual and Manufacturer
                      Guidelines
                    </strong>
                    <ol type="1" style={{ paddingLeft: "20px" }}>
                      <li>
                        5.2.1 The Customer shall comply fully with all usage,
                        maintenance, and care instructions provided in the
                        Vehicle’s Owner's Manual.
                      </li>
                      <li>
                        5.2.2 Any failure by the Customer to adhere to the
                        manufacturer’s guidelines, including but not limited to
                        timely maintenance and proper operation, shall release
                        the Dealer from any liability under this Agreement.
                      </li>
                    </ol>
                  </li>
                  <li>
                    <strong>
                      5.3 Prompt Reporting of Defects and Minimization of
                      Damages
                    </strong>
                    <ol type="1" style={{ paddingLeft: "20px" }}>
                      <li>
                        5.3.1 The Customer shall immediately notify the Dealer
                        of any defect, malfunction, or failure in the Vehicle.
                      </li>
                      <li>
                        5.3.2 The Customer shall take all reasonable steps to
                        minimize consequential damages arising from such defects
                        or failures. Failure to do so will result in the Dealer
                        being absolved of any responsibility for additional
                        damages.
                      </li>
                    </ol>
                  </li>
                  <li>
                    <strong>5.4 Odometer and Instrument Integrity</strong>
                    <ol type="1" style={{ paddingLeft: "20px" }}>
                      <li>
                        5.4.1 The Customer shall promptly inform the Dealer if
                        the Vehicle’s odometer or other measuring instruments
                        malfunction, are tampered with, or suffer damage,
                        including damage to seals.
                      </li>
                      <li>
                        5.4.2 The Customer shall not make any alterations or
                        repairs to these instruments except through the Dealer
                        or its Authorized Workshop. Non-compliance shall nullify
                        any obligations of the Dealer under the AMC.
                      </li>
                    </ol>
                  </li>
                  <li>
                    <strong>
                      5.5 Reporting and Handling of Storage and Recommissioning
                    </strong>
                    <p className="ml-9">
                      5.5.1 The Customer shall immediately inform the Dealer of
                      any intention to store or
                    </p>
                  </li>
                </ol>
              </div>

              <ol className="pt-16" type="1" style={{ paddingLeft: "20px" }}>
                <li>
                  recommission the Vehicle and agree to follow the Dealer’s
                  instructions regarding necessary precautions.
                </li>
                <li>
                  5.5.2 The Customer agrees to permit only the Dealer or an
                  Authorized Workshop to carry out any storage or
                  recommissioning measures. Failure to do so shall release the
                  Dealer from any responsibility for subsequent issues.
                </li>
              </ol>
              <li>
                <strong>5.6 Insurance and Third-Party Claims</strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li>
                    5.6.1 The Customer agrees that in the event of accident
                    damage repairs covered under insurance, any deduction or
                    limitation imposed by the insurance company is the
                    Customer's sole responsibility. The Dealer shall not be
                    liable for any such deductions or shortfalls.
                  </li>
                </ol>
              </li>
              <li>
                <strong>5.7 Proper Vehicle Use and Compliance</strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li>
                    5.7.1 The Customer shall not misuse or operate the Vehicle
                    in a manner inconsistent with its intended purpose or
                    outside the conditions specified by the manufacturer.
                  </li>
                  <li>
                    5.7.2 Any unauthorized modifications or usage shall void the
                    Dealer’s obligations under this Agreement.
                  </li>
                </ol>
              </li>
              <li>
                <strong>5.8 Cooperation with the Dealer</strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li>
                    5.8.1 The Customer agrees to cooperate with the Dealer in
                    providing any documentation, approvals, or access to the
                    Vehicle required to fulfill the Dealer’s obligations under
                    the AMC.
                  </li>
                  <li>
                    5.8.2 Any failure to cooperate, including failure to deliver
                    the Vehicle for required servicing or repairs, will release
                    the Dealer from any liability under this Agreement.
                  </li>
                </ol>
              </li>
              <li>
                <strong>5.9 Indemnity</strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li>
                    5.9.1 The Customer shall indemnify and hold the Dealer
                    harmless against any claims, damages, or losses arising out
                    of the Customer’s failure to comply with their obligations
                    under this Agreement, including but not limited to improper
                    use, delayed servicing, or third-party actions.
                  </li>
                </ol>
              </li>
              <li>
                <strong>6 Payment</strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li>
                    <strong>6.1 Payment for RG AMC</strong>
                    <ol type="1" style={{ paddingLeft: "20px" }}>
                      <li>
                        6.1.1 The Customer shall pay the Dealer the full RG AMC
                        service package amount in advance, including applicable
                        taxes at the prevailing rates.
                      </li>
                      <li>
                        6.1.2 No adjustments or refunds of the service package
                        amount shall be made if the Vehicle has covered less
                        mileage than expected by the end of the Agreement
                        period.
                      </li>
                    </ol>
                  </li>
                  <li>
                    <strong>
                      6.2 Costs for Unauthorized Repairs or Modifications
                    </strong>
                    <ol type="1" style={{ paddingLeft: "20px" }}>
                      <li>
                        6.2.1 The Customer agrees to bear the cost of any Works
                        required as a result of improper repairs, maintenance
                        performed by any workshop that is not an Authorized
                        Workshop, or unauthorized modifications that deviate
                        from the Vehicle’s original specifications.
                      </li>
                      <li>
                        6.2.2 The cost of such Works shall be calculated at the
                        Dealer’s prevailing workshop rates for similar services.
                      </li>
                    </ol>
                  </li>
                  <li>
                    <strong>
                      6.3 Adjustments for Government Duties and Taxes
                    </strong>
                    <ol type="1" style={{ paddingLeft: "20px" }}>
                      <li>
                        6.3.1 The service package rates are calculated based on
                        the prevailing Government...
                      </li>
                    </ol>
                  </li>
                </ol>
              </li>

              <li className="pt-20">
                <strong>6.3 Adjustments for Government Duties and Taxes</strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li>
                    Duties and Taxes applicable to Spare Parts and Labour
                    charges.
                  </li>
                  <li>
                    6.3.2 In the event of any significant increase in statutory
                    duties or taxes affecting the costs of Spare Parts and
                    Labour, the Dealer reserves the right to adjust the service
                    package charges accordingly.
                  </li>
                </ol>
              </li>
              <li className="pt-4">
                <strong>7 Accident Repairs</strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li>
                    The Customer agrees that any damage caused to the Vehicle by
                    collision, accident, or any other cause shall be repaired
                    exclusively at an Authorized Dealer’s workshop. Failure to
                    comply with this obligation will result in the immediate
                    termination of this Agreement, rendering it null and void.
                  </li>
                </ol>
              </li>
              <li className="pt-4">
                <strong>8 Indemnity by the Customer</strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li>
                    8.1 The Customer agrees to indemnify, defend, and hold
                    harmless the Dealer, its employees, agents, affiliates, and
                    representatives (collectively, the "Indemnified Parties")
                    from and against any and all claims, demands, suits,
                    actions, losses, liabilities, damages, expenses (including
                    reasonable legal fees), and costs arising directly or
                    indirectly from:
                    <ol type="1" style={{ paddingLeft: "20px" }}>
                      <li>
                        8.1.1 Breach of Agreement: Any breach by the Customer of
                        any terms, conditions, or obligations set forth in this
                        Agreement.
                      </li>
                      <li>
                        8.1.2 Vehicle Use and Maintenance: Any damage, injury,
                        or loss arising from the improper use, modification, or
                        unauthorized repair of the Vehicle by the Customer or
                        any third party, including but not limited to repairs
                        made by non-authorized workshops.
                      </li>
                      <li>
                        8.1.3 Non-Compliance with Laws: Any violation of
                        applicable laws, regulations, or governmental orders by
                        the Customer related to the use or operation of the
                        Vehicle or any services under this Agreement.
                      </li>
                      <li>
                        8.1.4 Consequential Damages: Any consequential or
                        incidental damages, losses, or expenses resulting from
                        the Customer’s failure to properly maintain the Vehicle,
                        including the failure to follow maintenance schedules or
                        instructions.
                      </li>
                      <li>
                        8.1.5 Insurance Claims and Liabilities: Any issues
                        arising from the Customer’s insurance coverage,
                        including disputes with insurance companies, unpaid
                        premiums, or failure to maintain adequate coverage.
                      </li>
                    </ol>
                  </li>
                  <li className="pt-4">
                    <strong> 8.2 Third-Party Claims:</strong>
                    <ol type="1" style={{ paddingLeft: "20px" }}>
                      <li>
                        8.2.1 In addition to indemnifying the Dealer for claims
                        arising from the Customer’s own actions, the Customer
                        shall also indemnify the Dealer against any third-party
                        claims related to the Vehicle or the services provided
                        under this Agreement, including any damages, injury,
                        loss, or financial liability arising from the Vehicle’s
                        use or the Customer’s failure to perform their
                        obligations under this Agreement.
                      </li>
                    </ol>
                  </li>
                  <li>
                    8.3 Dealer’s Right to Defend:
                    <ol type="1" style={{ paddingLeft: "20px" }}>
                      <li>
                        8.3.1 The Dealer shall have the right, but not the
                        obligation, to assume the defense of any claim or action
                        for which the Customer is indemnifying the Dealer. In
                        the event that the Dealer does not assume such defense,
                        the Customer shall have the right to defend the claim at
                        their own expense, provided that the Dealer’s interests
                        are adequately protected.
                      </li>
                    </ol>
                  </li>
                </ol>
              </li>
              <li>
                <strong>9 Transfer of Vehicle by the Customer</strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li>
                    9.1 The benefits of the RG AMC package can be availed at any
                    authorized RAAM MG workshop across India.
                  </li>
                </ol>
              </li>

              <li className="pt-14">
                <strong>9.2 Transfer of AMC Benefits</strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li>
                    9.2.1 The RG AMC Agreement (hereinafter referred to as the
                    "AMC") shall remain in effect and cover services as provided
                    under this Agreement for any subsequent buyer or owner
                    (hereinafter referred to as the "New Owner") of the Vehicle.
                    The benefits of the AMC, including all associated services,
                    shall be transferred to the New Owner subject to the
                    following conditions:
                    <ol type="1" style={{ paddingLeft: "30px" }}>
                      <li>
                        9.2.1 Registration Requirement: The New Owner must
                        register themselves with the Dealer within seven (7)
                        days from the date of transfer of ownership of the
                        Vehicle from the original Customer to the New Owner.
                        This registration is mandatory for the continuation of
                        AMC services, and failure to register within the
                        specified time frame shall result in the termination of
                        the AMC benefits.
                      </li>
                      <li>
                        9.2.2 A duly filled and signed version of this Agreement
                        is submitted by the new Customer.
                      </li>
                      <li>
                        9.2.3 The new Customer’s details are updated in the
                        Dealer’s system.
                      </li>
                    </ol>
                  </li>
                  <li>
                    9.3 Upon successful registration by the New Owner, the AMC
                    benefits shall continue to be provided to the New Owner
                    under the same terms and conditions outlined in the original
                    Agreement, including all services such as maintenance,
                    repairs, and other services covered under the RG AMC. The
                    New Owner will be bound by all obligations, terms, and
                    conditions of the AMC from the date of registration.
                  </li>
                  <li>
                    9.4 If the New Owner owns multiple MG vehicles, the RG AMC
                    package is vehicle-specific and cannot be transferred from
                    one vehicle to another. The AMC benefits are tied to the
                    specific Vehicle listed in the Agreement and will only apply
                    to that Vehicle until the expiration or termination of the
                    Agreement.
                  </li>
                  <li>
                    9.5 In the event that the New Owner fails to register with
                    the Dealer within the specified seven (7) days, the AMC
                    benefits will automatically terminate, and the Dealer will
                    have no further obligation to provide services under this
                    Agreement. Additionally, the Dealer reserves the right to
                    cancel any remaining benefits of the AMC for the Vehicle.
                  </li>
                  <li>
                    9.6 The Dealer reserves the right to charge a nominal fee
                    for the transfer of the AMC to a New Owner. The amount of
                    such fee, if applicable, shall be communicated to the
                    Customer and New Owner at the time of transfer.
                  </li>
                </ol>
              </li>
              <li className="pt-6">
                <strong>
                  10 Defects and Applications Outside the Agreement
                </strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li className="pt-3">
                    10.1 In the event that, in the Dealer’s opinion, any part or
                    component of the Vehicle is deemed defective beyond repair
                    and is impairing, or likely to impair, the Vehicle’s
                    efficient, safe, and reliable operation, or could cause
                    consequential damage, and the rectification of such defect
                    is outside the scope of the RG AMC, the Dealer shall notify
                    the Customer in writing. The Dealer may recommend the
                    replacement of the defective part or component. If the
                    Customer refuses or fails to have such replacement carried
                    out within fifteen (15) days of receiving the notice, or
                    immediately if the replacement is necessary for safety, the
                    Dealer shall be absolved from all obligations under this
                    Agreement with respect to the Vehicle until such replacement
                    is made.
                  </li>
                  <li className="pt-3">
                    10.2 If the Dealer becomes aware that the Vehicle is being
                    used for any special application beyond the specified use,
                    which, in the Dealer’s opinion, is likely to increase the
                    Dealer’s responsibilities under this Agreement, the Dealer
                    may notify the Customer in writing and require the Customer
                    to immediately cease such use. If the Customer fails or
                    refuses to cease the special application upon receiving such
                    notice, the Dealer may, at its discretion, notify the
                    Customer in writing that the
                  </li>
                </ol>
              </li>

              <li className="ml-6 pt-14">
                Vehicle is withdrawn from this Agreement. In such case, the
                Dealer shall be absolved from all obligations under this
                Agreement with respect to that Vehicle. The Dealer shall not be
                liable for any refund of the service package amount to the
                Customer in such an event.
              </li>
              <li className="pt-4">
                <strong>
                  11 Vehicles Withdrawn from this Agreement - No Assignment
                </strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li>
                    11.1 Early Withdrawal by Customer
                    <ol type="a" style={{ paddingLeft: "20px" }}>
                      <li>
                        11.1.1 In the event the Customer withdraws the Vehicle
                        from this Agreement before the agreed period, the
                        Customer shall pay the Dealer as follows:
                        <ul style={{ paddingLeft: "20px" }}>
                          <li>
                            In case of voluntary withdrawal by the Customer, a
                            deduction of 5% of the total contracted amount for
                            RG AMC will be made by the Dealer, in addition to
                            any deductions for services already utilized by the
                            Customer under the terms of this Agreement.
                          </li>
                        </ul>
                      </li>
                    </ol>
                  </li>
                  <li>
                    11.2 Termination Due to Total Loss
                    <ol type="a" style={{ paddingLeft: "20px" }}>
                      <li>
                        11.2.1 No foreclosure charges will be payable by the
                        Customer if the RG AMC is terminated due to the Vehicle
                        being declared a "Total Loss" by the Insurance Agency
                        following an accident.
                      </li>
                      <li>
                        11.2.2 In such cases, the RG AMC amount will be refunded
                        to the Customer on a pro-rata basis, calculated
                        according to the period and mileage not covered by the
                        Vehicle from the date of the Agreement. However, this is
                        without prejudice to the Dealer's right to recover any
                        sums due as of the effective date of the withdrawal.
                      </li>
                    </ol>
                  </li>
                  <li>
                    11.3 Cessation of Dealer’s Obligations
                    <ol type="a" style={{ paddingLeft: "20px" }}>
                      <li>
                        11.3.1 Upon the withdrawal of the Vehicle from this
                        Agreement, the Dealer’s obligation to perform any
                        further Works shall cease immediately.
                      </li>
                    </ol>
                  </li>
                </ol>
              </li>
              <li className="pt-6">
                <strong>12 Dispute Resolution</strong>
                <ol type="1" style={{ paddingLeft: "20px" }}>
                  <li>
                    12.1 Any disputes, claims arising out of this Agreement are
                    subject to jurisdiction of the courts of Hyderabad only. Any
                    amendments in the clauses of the Agreement can be affected
                    as an addendum, after the written approval from both the
                    parties.
                  </li>
                  <li>
                    12.2 Any dispute, difference or question arising from this
                    Agreement shall be discussed between the parties and
                    resolved amicably. If any amicable solution cannot be
                    reached within one month, either party shall have the right
                    to have the said dispute settled by arbitration in
                    accordance with the provisions of the India Arbitration Act.
                    The seat and venue of the Arbitration shall be Hyderabad.
                    The language of the Arbitration shall be in English.
                  </li>
                  <li>
                    12.3 This Agreement shall be governed, interpreted, and
                    construed in accordance with the laws of India.
                  </li>
                </ol>
              </li>
              <li className="pt-6">
                <strong>13 Liability</strong>
                <ol type="a" style={{ paddingLeft: "20px" }}>
                  <li>
                    Neither party shall be liable for failure to fulfill its
                    obligations due to causes beyond its reasonable control,
                    including indirect or consequential losses.
                  </li>
                  <li>
                    This Agreement is exclusive between the Dealer and the
                    Customer, and MG and MG India Private Limited are absolved
                    from any direct or indirect liabilities arising out of this
                    Agreement.
                  </li>
                </ol>
              </li>

              <p className="pt-36 font-bold">14. Force Majeure</p>
              <p>
                14. Force Majeure In the event of Force Majeure, the time period
                for fulfilling obligations affected by Force Majeure will be
                extended by a reasonable period as determined by the Dealer.
                Neither party shall claim compensation for delays or
                non-performance due to Force Majeure. <br />
                a) The affected party shall use reasonable efforts to mitigate
                the consequences of the Force Majeure and cooperate with the
                other party to find alternative means of fulfilling obligations.{" "}
                <br />
                b) Force Majeure includes unforeseen or unavoidable events
                beyond the affected party's control, such as natural disasters,
                war, riots, acts of government, strikes, pandemics, and civil
                disturbances. <br />
                c) Force Majeure will not relieve any party from obligations not
                affected by such events, including contractual payments that are
                due unless payment is directly hindered by Force Majeure.
              </p>

              <img src={stamp} alt="stamp" className="mt-9 w-[30%]" />
            </div>
          </>
             ) : 
        <>

        
           <p className="mt-6">
              <strong>WHEREAS:</strong>
            </p>

            <p className="mt-9"><strong>a.</strong> Raam offers an Annual Maintenance Contract for Preventive Maintenance services of the vehicles for a term of certain years upon payment of a certain sum, i.e., <strong>AMC Amount</strong>.</p><br />
        
        <p><strong>b.</strong> The Customer has the option to purchase an Assured AMC Plan by paying an additional amount equivalent to <strong>30% of AMC Amount</strong>, hereinafter referred to as the <strong>“Assured AMC Premium Amount”</strong>.</p><br />
      
        <p><strong>c.</strong> Under the Assured AMC Plan, the Customer is entitled to the following benefits:</p>
        <ul className="ml-[20px]  pt-20">
          <li>A) Preventive Maintenance services as per point 4.1 mentioned below in the document.</li>
          <li>B) A guaranteed buyback offer where, if the Customer sells the vehicle back to Raam within the agreement period, Raam shall refund the AMC Amount to the Customer.</li>
          <li>C) If the Customer chooses to sell the vehicle in the market and provides documentary proof indicating a higher resale value than RG's offer (including the AMC refund amount), RG will refund only the Assured AMC Premium amount instead of the complete AMC Amount.</li>
        </ul><br />
        <p><strong>d.</strong> The Plan offers: <br /> Annual Maintenance Contract (AMC)  benefits for the designated vehicle for the agreed period; along with 
        <br/>b) an assured buyback option with a refund of the AMC amount (<em>excluding GST amount</em>).</p><br />


            <p><strong>e.</strong> The Customer is desirous of entering into a RG Assured AMC Agreement provided by Raam for their Vehicle.</p><br />
        
        <p><strong>f.</strong> Based upon the agreed terms and conditions, the Parties agree to enter into this Agreement with the following terms and conditions.</p><br />
      
    <br />  <p>WHEREBY IT IS AGREED between the Parties as follows: -</p>

<br />
      
      <p><strong>1.

      SERVICES & TERMS:
      </strong>
      </p> 
        <p style={paragraphStyle}>1.1. The Plan includes AMC services for a period till valid date or valid kilometre’s (mentioned in the initial section), whichever is earlier.</p>
        <p style={paragraphStyle}>1.2. The AMC services shall be availed exclusively at authorized Raam service centres.</p>
        <p style={paragraphStyle}>1.3. The AMC covers periodic servicing, and select repairs as per AMC terms and conditions in 4.1 mentioned in the document.</p>
        <p style={paragraphStyle}>1.4. Any services availed outside Raam service centers will not be covered under this Plan and may result in forfeiture of AMC benefits.</p>
        <p style={paragraphStyle}>1.5. The Customer may avail of the AMC amount refund option before completing valid date as specified in the Plan terms.</p>
        <p style={paragraphStyle}>1.6. The AMC amount refund option can be exercised only upon the sale of MG Car to Raam or purchase of a new Car in exchange for the original MG Car from Raam</p>
        <p style={paragraphStyle}>1.7. Upon returning the vehicle to Raam under this Plan, Raam shall offer a refund of the AMC Amount along with the Buyback value of the car.</p>
        <p style={paragraphStyle}>1.8. If the Customer provides valid proof of a higher price from the open market, Raam shall make reasonable efforts to match the higher price.</p>
        <p style={paragraphStyle}>1.9. If Raam is unable to match the higher price (including the AMC amount), it shall refund the Assured AMC Premium amount paid by the Customer only (excluding applicable taxes, if any).</p>
        <p style={paragraphStyle}>1.10. It is explicitly agreed by the Customer that if he sells vehicle to anyone other than Raam, he shall receive only the Assured AMC Premium amount and not the full AMC Amount. The AMC premium amount refund is subjective to the conditions mentioned in the 15th point.</p>
        <p style={paragraphStyle} className="mt-52" >1.11. The buyback price shall be determined based on the vehicle's condition, mileage, service history, and compliance with the prescribed maintenance standards set by Raam.</p>
        <p style={paragraphStyle} >1.12 The vehicle must not have been involved in any major accidents, flood damage, or modifications that significantly alter its structure or performance.</p>
        <p style={paragraphStyle}>1.13. The Customer shall provide all necessary documents, including but not limited to the original purchase invoice, registration certificate, insurance records, and service history, at the time of evaluation.</p>
        <p style={paragraphStyle}  >1.14. Raam reserves the right to reject a buyback request if the vehicle does not meet the terms and conditions stipulated under this Agreement.</p>
        <p style={paragraphStyle}>1.15. The Customer shall not have any claim/ownership over the original MG Car and the accessories after the sale of the MG Car to Raam is complete. It is further agreed between the Raam and the Customer that, the sale will be complete upon making payment of Buyback Value (excluding the amount held for RC transfer) by the Raam to the customer, in cases of customer receives money. If the Customer agrees to purchase a new car from the Raam, the Buyback Value shall be deducted from the value of the new car, in such cases, the sale will be considered as complete upon receiving the gate pass for new car by the customer.</p>
        <p style={paragraphStyle}>1.16. In case the customer fails to provide the original box, original and spare key, charger and necessary accessories/components for the MG Car under the conditions specified above, evaluation Value shall be reduced accordingly</p>
        <p style={paragraphStyle}>1.17. The MG car must satisfy the Raam in following conditions:</p>
        <p style={{ marginLeft: '20px' }}>
          a) The MG Car is in a roadworthy condition and free from significant damage.<br />
          b) All scheduled maintenance and services must have been performed at authorized MG service centers only.<br />
          c) The vehicle should not have been modified or altered from its original specifications without approval from RAAM.<br />
          d) The vehicle must have valid and existing insurance, licenses and registration at the time of buyback.<br />
          e) MG car is not used for commercial purposes (e.g., rentals, taxis etc.)<br />
          f) Car is not involved in any fraud or misrepresentation committed by the Customer
        </p><br />

        <p style={{ fontWeight: 'bold', fontSize: '16px'}} >2. TERM AND TERMINATION OF THIS AGREEMENT:</p> 
        <p style={paragraphStyle}>2.1. This RG Assured AMC Plan shall commence on the Agreement Start Date* and remain in effect for the Agreement Period*, unless terminated earlier upon the occurrence of any of the following events:</p>
        <p style={{ marginLeft: '20px' }}>
          a) The Agreement Valid Date* is reached;<br />
          b) The Agreement Valid Mileage* is exceeded;<br />
          c) A breach or violation of any clause or obligation by the Customer;<br />
          d) The Dealer's obligation to provide aftersales services is terminated; or<br />
          e) Termination of this Agreement as provided under any other clause of this Agreement.<br />
          f) The transfer / sale of vehicle to any person/ company, the RG Assured AMC shall not be transferable.
        </p>
        <p style={paragraphStyle} className="mt-52" >2.2. The Agreement Period* cannot be extended further from stipulated period for any reason including for any of the services skipped/missed by the Parties.</p>
        <p style={{ fontStyle: 'italic', fontSize: '13px' }}>*The specific dates and details of the Agreement Period, Valid Date, and Valid Mileage are as specified in this Agreement.</p>

      <div>
        <p style={{  fontSize: '16px' }}>3. 
        All taxes or liabilities payable to any regulatory authority shall be borne by the customer and/or billed to the account of the customer.</p>
      </div>
      
      <div style={{  fontWeight: 'bold' }} className="pt-6">4. FEATURES OF ASSURED AMC:</div>

<div style={{ marginLeft: "20px"}}>4.1. Coverage:</div>
<div style={{ marginLeft: "40px" }}>
  <div >4.1.1. For I.C.E (Internal Combustion Engine, Fuel Type – Petrol/Diesel):</div>
  <div>a) Periodic service as per the manufacturer's recommendations.</div>
  <div>b) Check/ Replacement of Oil filter, Air filter/s, A/c dust filter/s, Gasket drain plug, Fuel filter, Transmission filter as required during periodic service interval.</div>
  <div>c) Replacement/ Topping-up Engine oil, brake fluid, windshield washer fluid, transmission oil and coolant as required during periodic service interval.</div>
  <div>d) Complete vehicle inspection & checks as recommended by MG.</div>
  <div>e) Vehicle washing and vacuum cleaning during the preventive services.</div>
  <div>f) Wheel alignment & Wheel balancing.</div>
  <div>g) If the vehicle has a sunroof, it includes applying sunroof grease for maintenance.</div>
  <div>h) Pick and Drop of your MG vehicle for the Preventive Maintenance Services covered under the AMC package. Free Pick up and Drop is only applicable for Vehicles in Hyderabad Premises.</div>
  <div>i) Discount of Rs.2,000 on any of the following Value-Added Services:</div>
  <div style={{ marginLeft: "20px" }}>
    <div>3M MG Engine Compartment clean</div>
    <div>3M AC Vent Disinfectant</div>
    <div>3M Exterior Beautification</div>
    <div>3M Premium Interior Cleaning (Foam)</div>
    <div>3M Anti Microbial smoggy</div>
    <div>3M AC Evaporator Cleaning</div>
  </div>

  <div style={{ marginTop: "12px" }}>4.1.2. For EV (Electric Vehicles):</div>
  <div>a) Periodic service as per the manufacturer's recommendations.</div>
  <div>b) Check/ Replacement of Air filter/s as required during periodic service interval.</div>
  <div>c) Replacement/ Topping-up brake fluid, windshield washer fluid, transmission oil and coolant as required during periodic service interval.</div>
  <div>d) Complete vehicle inspection & checks as recommended by MG.</div>
  <div>e) Vehicle washing and vacuum cleaning during the periodic service.</div>
  <div>f) Wheel alignment & Wheel balancing.</div>
  <div>g) If the vehicle has a sunroof, it includes applying sunroof grease for maintenance.</div>
</div>

<div style={{ marginLeft: "20px"}} className="mt-80">4.2. Limitations: RG Assured AMC (AMC) DOES NOT INCLUDE the following:</div>
<span className="ml-[40px]"><p>a) The rectification of damage caused by:</p>
  <p style={{ marginLeft: "20px" }}>
    <p>i. Accidents or external influences.</p>
    <p>ii. The use in Vehicle of parts other than original MG spare parts sold by MG India authorised workshop.</p>
    <p>iii. The use in the Vehicle of oils or other service products which have not been approved/supplied by MG India Ltd. And its Dealers.</p>
    <p>iv. Neglect, misuse, abuse or improper handling of a Vehicle and unauthorised modifications made to a Vehicle by the Customer or any third party.</p>
    <p>v. The use of a Vehicle for any application other than normal road use such as for the carriage of goods, or any specialist application, etc.</p>
  </p></span>
<div style={{ marginLeft: "40px" }}>

  <div className="pt-12" >b) The repair or maintenance of any part not mentioned in the list of inclusions above.</div>
  <div>c) Inspection & replacement of wear & tear related parts such as brake pads, brake discs, brake wear sensors and wiper blades, V-belts, etc.</div>
  <div>d) Replacement of Tyres.</div>
  <div>e) Any damage to the fuel system parts due to water, adulteration or foreign objects in the fuel.</div>
  <div>f) The maintenance and/or repairs of any paint work.</div>
  <div>g) The carrying out of any modifications required by law.</div>
  <div>h) Any measures required by the Owner's Manual for a Vehicle to be carried out in preparing a Vehicle for storage for an extended period of time and the elimination of damage arising during any such period of storage (hose cuts, cracks, deformation of components, etc.).</div>
  <div>i) The rectification of any damage or other work arising as a consequence of the Customer refusing, or failing to make a Vehicle available in the MG authorized workshops.</div>
  <div>j) Repairs carried out under any warranty given at the time of sale of a Vehicle.</div>
  <div>k) Any damages Caused by 'force majeure' such as earthquake, vandalism, floods etc.</div>
</div>

<div style={{ marginTop: "16px" }}>5. Dealer's Obligations:</div>
  <div style={paragraphStyle}  className="ml-[20px]">5.1. The Dealer shall perform all services covered under the Assured AMC with reasonable skill, care, and diligence, in accordance with the manufacturer’s guidelines and recommended practices.</div>
  <div  style={paragraphStyle} className="ml-[20px]">5.2. The Dealer shall use only genuine MG parts, fluids, and components during the execution of any services, repairs, or replacements under the Assured AMC.</div>
  <div  style={paragraphStyle} className="ml-[20px]">5.3. The Dealer shall provide periodic maintenance and inspections of the Vehicle as per the schedule specified in the Assured AMC, ensuring the efficient, safe, and reliable operation of the Vehicle.</div>
  <div style={{ marginLeft: "20px" }}>
 
  <div style={paragraphStyle} className="ml-[20px] mt-[60px]">5.4. The Dealer shall promptly inform the Customer of any additional repairs or services needed outside the scope of the Assured AMC and shall not proceed with such work without prior approval from the Customer.</div>

  <div style={paragraphStyle}>5.5. The Dealer agrees to arrange for the execution and performance of the agreed Works at regular intervals during the specified period, unless otherwise directed in writing by the Customer. However, the Dealer's obligation to perform the Works is subject to:</div>
  <div  style={{ marginLeft: "20px" }}>
    <div style={paragraphStyle}>5.5.1. The Customer's compliance with all terms and conditions of this Agreement, including timely payment of any applicable fees;</div>
    <div style={paragraphStyle}>5.5.2. The availability of necessary parts, components, and resources required for the performance of the Works, which may be affected by factors beyond the Dealer's reasonable control;</div>
  </div>
  <div style={paragraphStyle}>5.6. The Vehicle being maintained in a condition that allows for the effective execution of the Works, as recommended by the manufacturer; and</div>
  <div style={paragraphStyle}>5.7. Any other limitations or conditions outlined in this Agreement.</div>
  <div style={paragraphStyle}>5.8. The Dealer reserves the absolute discretion to install any genuine MG part or parts deemed necessary (applicable charges would be collected) to ensure the efficient, safe, and reliable operation of the Vehicle. The Customer agrees that such decisions by the Dealer shall be final and binding, provided that the parts installed are in accordance with the manufacturer’s specifications.</div>
</div>

<div style={{ marginTop: "16px" }} className="pt-6">6. <strong>Customer's obligations:</strong> The Customer agrees:</div>
<div style={{ marginLeft: "20px" }}>
  <div>6.1. Vehicle Availability and Timely Servicing:</div>
  <div style={{ marginLeft: "20px" }}>
    <div style={paragraphStyle}>6.1.1. The Customer shall make the Vehicle available at the Nominated Workshop by prior appointment during the workshop’s regular working hours.</div>
    <div style={paragraphStyle}>6.1.2. The Customer agrees to present the Vehicle for servicing at or within the prescribed period before the relevant service interval as per the terms of this Agreement. Failure to do so shall void the Dealer's obligations under the AMC.</div>
    <div style={paragraphStyle}>6.1.3. The Customer shall also make the Vehicle available as and when reasonably requested by the Dealer for preventive treatments, inspections, or checks to ensure optimal Vehicle performance.</div>
  </div>
  <div >6.2. Adherence to Owner's Manual and Manufacturer Guidelines:</div>
  <div style={{ marginLeft: "20px" }}>
    <div style={paragraphStyle}>6.2.1. The Customer shall comply fully with all usage, maintenance, and care instructions provided in the Vehicle’s Owner's Manual.</div>
    <div style={paragraphStyle}>6.2.2. Any failure by the Customer to adhere to the manufacturer’s guidelines, including but not limited to timely maintenance and proper operation, shall release the Dealer from any liability under this Agreement.</div>
  </div>
  <div>6.3. Prompt Reporting of Defects and Minimization of Damages</div>
  <div style={{ marginLeft: "20px" }}>
    <div style={paragraphStyle}>6.3.1. The Customer shall immediately notify the Dealer of any defect, malfunction, or failure in the Vehicle.</div>
    <div style={paragraphStyle}>6.3.2. The Customer shall take all reasonable steps to minimize consequential damages arising from such defects or failures. Failure to do so will result in the Dealer being absolved of any responsibility for additional damages.</div>
  </div>
  <div className="mt-[220px]">6.4. Odometer and Instrument Integrity:</div>
  <div style={{ marginLeft: "20px" }}>
    <div style={paragraphStyle} >6.4.1. The Customer shall promptly inform the Dealer if the Vehicle’s odometer or other measuring instruments malfunction, are tampered with, or suffer damage, including damage to seals.</div>
    <div style={paragraphStyle} >6.4.2. The Customer shall not make any alterations or repairs to these instruments except through the Dealer or its Authorized Workshop. Non-compliance shall nullify any obligations of the Dealer under the AMC.</div>
  </div>
  <div>6.5. Reporting and Handling of Storage and Recommissioning</div>
  <div style={{ marginLeft: "20px" }}>
    <div style={paragraphStyle}  >6.5.1. The Customer shall immediately inform the Dealer of any intention to store or recommission the Vehicle and agree to follow the Dealer’s instructions regarding necessary precautions.</div>
    <div style={paragraphStyle}  >6.5.2. The Customer agrees to permit only the Dealer or an Authorized Workshop to carry out any storage or recommissioning measures. Failure to do so shall release the Dealer from any responsibility for subsequent issues.</div>
  </div>
  <div style={paragraphStyle} >6.6. Insurance and Third-Party Claims: The Customer agrees that in the event of accident damage repairs covered under insurance, any deduction or limitation imposed by the insurance company is the Customer's sole responsibility. The Dealer shall not be liable for any such deductions or shortfalls.</div>
  <div>6.7. Proper Vehicle Use and Compliance</div>
  <div style={{ marginLeft: "20px" }}>
    <div style={paragraphStyle} >6.7.1. The Customer shall not misuse or operate the Vehicle in a manner inconsistent with its intended purpose or outside the conditions specified by the manufacturer.</div>
    <div style={paragraphStyle} >6.7.2. Any unauthorized modifications or usage shall void the Dealer’s obligations under this Agreement.</div>
  </div>
  <div>6.8. Cooperation with the Dealer</div>
  <div style={{ marginLeft: "20px" }}>
    <div style={paragraphStyle} >6.8.1. The Customer agrees to cooperate with the Dealer in providing any documentation, approvals, or access to the Vehicle required to fulfill the Dealer’s obligations under the AMC.</div>
    <div style={paragraphStyle} >6.8.2. Any failure to cooperate, including failure to deliver the Vehicle for required servicing or repairs, will release the Dealer from any liability under this Agreement.</div>
  </div>
  <div style={paragraphStyle}  className="pt-6">6.9. Indemnity: The Customer shall indemnify and hold the Dealer harmless against any claims, damages, or losses arising out of the Customer’s failure to comply with their obligations under this Agreement, including but not limited to improper use, delayed servicing, or third-party actions.</div>
</div><br />

    <h3 style={{ fontWeight: 'bold' }}>7. Payment</h3> 
        <p style={paragraphStyle}  className="ml-[20px]">7.1 Payment shall be made via [accepted payment methods such as credit card, debit card, bank transfer, or UPI] as per the instructions provided by Raam.</p>
        <p  style={paragraphStyle} className="ml-[20px]">7.2 No part payments or instalment-based payments shall be accepted for availing the benefits of this Plan.</p>
        <p  style={paragraphStyle} className="ml-[20px]">7.3 Upon successful payment, Raam shall issue an official receipt and confirmation of Plan enrolment to the Customer.</p>
   <ol style={{  marginLeft: '20px' }} className="pt-[80px]">
   <li>7.4 
             Payment for RG Assured AMC Plan
            <ol style={{  marginLeft: '20px' }}>
                <li style={paragraphStyle} >7.4.1 The Customer shall pay the Dealer the full RG Assured AMC service package amount in advance, including applicable taxes at the prevailing rates.</li>
                <li style={paragraphStyle} >7.4.2 No adjustments or refunds of the service package amount shall be made if the Vehicle has covered less mileage than expected by the end of the Agreement period.</li>
            </ol>
        </li>
        <li>7.5
            Costs for Unauthorized Repairs or Modifications
            <ol style={{  marginLeft: '20px' }}>
                <li style={paragraphStyle} >7.5.1 The Customer agrees to bear the cost of any Works required as a result of improper repairs, maintenance performed by any workshop that is not an Authorized Workshop, or unauthorized modifications that deviate from the Vehicle’s original specifications.</li>
                <li style={paragraphStyle} >7.5.2 The cost of such Works shall be calculated at the Dealer’s prevailing workshop rates for similar services.</li>
            </ol>
        </li>
        <li>7.6
            Adjustments for Government Duties and Taxes
            <ol style={{  marginLeft: '20px' }}>
                <li style={paragraphStyle} >7.6.1 The service package rates are calculated based on the prevailing Government Duties and Taxes applicable to Spare Parts and Labour charges.</li>
                <li style={paragraphStyle} >7.6.2 In the event of any significant increase in statutory duties or taxes affecting the costs of Spare Parts and Labour, the Dealer reserves the right to adjust the service package charges accordingly.</li>
            </ol>
        </li>
    </ol>
<br />
    <h3 style={{ fontWeight: 'bold' }}>8. Accident repairs</h3> 
    <p>The Customer agrees that any damage caused to the Vehicle by collision, accident, or any other cause shall be repaired exclusively at an Authorized Dealer’s workshop. Failure to comply with this obligation will result in the immediate termination of this Agreement, rendering it null and void.</p>
<br />
    <h3 style={{ fontWeight: 'bold' }}>9. Indemnity by the Customer:</h3>
    <p className="ml-[20px]">9.1 The Customer agrees to indemnify, defend, and hold harmless the Dealer, its employees, agents, affiliates, and representatives (collectively, the "Indemnified Parties") from and against any and all claims, demands, suits, actions, losses, liabilities, damages, expenses (including reasonable legal fees), and costs arising directly or indirectly from:</p>
        <p style={paragraphStyle}  className="ml-[20px]">9.2 Breach of Agreement: Any breach by the Customer of any terms, conditions, or obligations set forth in this Agreement.</p>
        <p  style={paragraphStyle} className="ml-[20px]">9.3 Vehicle Use and Maintenance: Any damage, injury, or loss arising from the improper use, modification, or unauthorized repair of the Vehicle by the Customer or any third party, including but not limited to repairs made by non-authorized workshops.</p>
        <p  style={paragraphStyle} className="ml-[20px]">9.4 Non-Compliance with Laws: Any violation of applicable laws, regulations, or governmental orders by the Customer related to the use or operation of the Vehicle or any services under this Agreement.</p>
        <p  style={paragraphStyle} className="ml-[20px]">9.5 Consequential Damages: Any consequential or incidental damages, losses, or expenses resulting from the Customer’s failure to properly maintain the Vehicle, including the failure to follow maintenance schedules or instructions.</p>
    <span style={{  marginLeft: '20px' }} className="pt-[82px]">
     
        <p style={paragraphStyle}>9.6 Insurance Claims and Liabilities: Any issues arising from the Customer’s insurance coverage, including disputes with insurance companies, unpaid premiums, or failure to maintain adequate coverage.</p>
        <p style={paragraphStyle}>9.7 Third-Party Claims: In addition to indemnifying the Dealer for claims arising from the Customer’s own actions, the Customer shall also indemnify the Dealer against any third-party claims related to the Vehicle or the services provided under this Agreement, including any damages, injury, loss, or financial liability arising from the Vehicle’s use or the Customer’s failure to perform their obligations under this Agreement.</p>
        <p style={paragraphStyle}>9.8 Dealer’s Right to Defend: The Dealer shall have the right, but not the obligation, to assume the defense of any claim or action for which the Customer is indemnifying the Dealer. In the event that the Dealer does not assume such defense, the Customer shall have the right to defend the claim at their own expense, provided that the Dealer’s interests are adequately protected.</p>
    </span>
<br />
    <h3 style={{ fontWeight: 'bold' }}>10. Transfer of Vehicle by the Customer:</h3>
    <ol style={{  marginLeft: '20px' }}>
        <li style={paragraphStyle}>10.1 The benefits of the RG Assured AMC plan package can be availed at any authorized RAAM MG workshop across India.</li>
        <li style={paragraphStyle}>10.2 It is explicitly agreed by the Customer that the plan provided under this Agreement is non-transferrable.</li>
    </ol>
<br />
    <h3 style={{ fontWeight: 'bold' }}>11. Defects and applications outside the agreement:</h3>
        <p className="pl-[20]">11.1 
            In the event that, in the Dealer’s opinion, any part or component of the Vehicle is deemed defective beyond repair and is impairing, or likely to impair, the Vehicle’s efficient, safe, and reliable operation, or could cause consequential damage, and the rectification of such defect is outside the scope of the RG Assured AMC plan, the Dealer shall notify the Customer in writing. The Dealer may recommend the replacement of the defective part or component. If the Customer refuses or fails to have such replacement carried out within fifteen (15) days of receiving the notice, or immediately if the replacement is necessary for safety, the Dealer shall be absolved from all obligations under this Agreement with respect to the Vehicle until such replacement is made.
        </p>
        <p  style={paragraphStyle}className="pl-[20]">11.2 If the Dealer becomes aware that the Vehicle is being used for any special application beyond the specified use, which, in the Dealer’s opinion, is likely to increase the Dealer’s responsibilities under this Agreement, the Dealer may notify the Customer in writing and require the Customer to immediately cease such use.</p>
        <p  style={paragraphStyle}className="pl-[20]">11.3 If the Customer fails or refuses to cease the special application upon receiving such notice, the Dealer may, at its discretion, notify the Customer in writing that the Vehicle is withdrawn from this Agreement. In such case, the Dealer shall be absolved from all obligations under this Agreement with respect to that Vehicle. The Dealer shall not be liable for any refund of the service package amount to the Customer in such an event.</p>
<br />
    <h3 style={{ fontWeight: 'bold' }}>12. Vehicles withdrawn from this agreement - no assignment</h3>
    <ol style={{ marginLeft: '20px' }} className="pt-20">
        <li>12.1
            Termination Due to Total Loss
            <ol style={{ marginLeft: '20px' }}>
                <li style={paragraphStyle}>12.1.1 No foreclosure charges will be payable by the Customer if the RG Assured AMC is terminated due to the Vehicle being declared a "Total Loss" by the Insurance Agency following an accident.</li>
                <li style={paragraphStyle}>12.1.2 In such cases, the AMC amount will be refunded to the Customer on a pro-rata basis, calculated according to the period and mileage not covered by the Vehicle from the date of the Agreement. However, this is without prejudice to the Dealer's right to recover any sums due as of the effective date of the withdrawal.</li>
            </ol>
        </li>
        <li>12.2
            Cessation of Dealer’s Obligations
            <ol style={{ marginLeft: '20px' }}>
                <li style={paragraphStyle}>12.2.1Upon the withdrawal of the Vehicle from this Agreement, the Dealer’s obligation to perform any further Works shall cease immediately.</li>
            </ol>
        </li>
    </ol>
<br />
    <h3 style={{ fontWeight: 'bold' }}>13. Termination:</h3>
    <p>The Plan shall automatically terminate upon the occurrence of the earliest of the following events:</p>
    <ul style={{ marginLeft: '20px' }}>
        <li>(i) The successful sale or exchange of the car to Raam or any third party;</li>
        <li>(ii) The car exceeding valid years of age; or</li>
        <li>(iii) The car being driven more than valid kms.</li>
    </ul>
<br />
    <h3 style={{ fontWeight: 'bold' }}>14. Refund:</h3>
    <ol style={{ marginLeft: '20px' }}>
        <li>14.1
            If the customer wants to sell the vehicle outside of Raam due to better quote i.e., higher than the sum of buyback value offered by Raam and the AMC refundable amount, then the Assured AMC Premium amount will be refunded to the customer. But the following conditions need to be fulfilled to be eligible for the AMC amount Refund-
            <ol style={{ marginLeft: '20px' }}>
                <li style={paragraphStyle}>14.1.1 First Right of Refusal: The first right to purchase the MG car at the customer's desired price should be given to RAAM. This means getting the MG car evaluated by Raam is mandatory. If RAAM denies the customer’s desired value via an official email, the customer is free to sell it outside.</li>
                <li style={paragraphStyle}>14.1.2 RC Transfer Proof: Proof of RC (Registration Certificate) transfer to the new owner along with the proof of transaction must be provided by the customer to RAAM within 3 months from the date of refusal.</li>
            </ol>
        </li>
        <li>14.2Once these proofs are submitted, the Assured AMC Premium amount will be refunded to Customer’s account within 30 days.</li>
    </ol>
<br />
    <h3 style={{ fontWeight: 'bold' }}>15. Dispute Resolution:</h3>
    <ol style={{ marginLeft: '20px' }}>
        <li style={paragraphStyle}>15.1 Any disputes, claims arising out of this Agreement are subject to jurisdiction of the courts of Hyderabad only. Any amendments in the clauses of the Agreement can be affected as an addendum, after the written approval from both the parties.</li>
        <li style={paragraphStyle}>15.2 This Agreement shall be governed, interpreted and construed in accordance with the laws of India.</li>
    </ol>
<br />
    <h3 style={{ fontWeight: 'bold' }} className="pt-[160px]">16. LIABILITY:</h3>
    <ol style={{ marginLeft: '20px' }}>
        <li style={paragraphStyle}>16.1 Neither party shall be liable for failure to fulfil its obligations due to causes beyond its reasonable control, including indirect or consequential losses.</li>
        <li style={paragraphStyle}>16.2 This Agreement is exclusive between the Dealer and the Customer, and MG and MG India Private Limited are absolved from any direct or indirect liabilities arising out of this Agreement.</li>
    </ol>
<br />
    <h3 style={{ fontWeight: 'bold' }} >17. Limitation of liability:</h3>
    <ol style={{ marginLeft: '20px' }}>
        <li style={paragraphStyle}>17.1 Raam shall not be liable for any loss, damage, or depreciation in the vehicle’s value due to misuse, accidents, modifications, or any factors.</li>
        <li style={paragraphStyle}>17.2 The refund under this Agreement shall be strictly limited to the amounts specified under ‘Details of this Agreement’ and shall not cover any additional costs incurred by the Customer.</li>
    </ol>
<br />
    <h3 style={{ fontWeight: 'bold' }}>18. FORCE MAJEURE</h3>
    <p>
        In the event of Force Majeure, the time period for fulfilling obligations affected by Force Majeure will be extended by a reasonable period as determined by the Dealer. Neither party shall claim compensation for delays or non-performance due to Force Majeure. <br />
    </p>
    <ul style={{ marginLeft: '20px' }}>
        <li style={paragraphStyle}>a) The affected party shall use reasonable efforts to mitigate the consequences of the Force Majeure and cooperate with the other party to find alternative means of fulfilling obligations.</li>
        <li style={paragraphStyle}>b) Force Majeure includes unforeseen or unavoidable events beyond the affected party's control, such as natural disasters, war, riots, acts of government, strikes, pandemics, and civil disturbances.</li>
        <li style={paragraphStyle}>c) Force Majeure will not relieve any party from obligations not affected by such events, including contractual payments that are due unless payment is directly hindered by Force Majeure.</li>
    </ul>
<br />
    <p>By enrolling in the RG Assured AMC Plan or availing its benefits, Customer acknowledges that he/she has read, understood, and agrees to be bound by the above Terms and Conditions.</p>
<br />
    <img src={stamp} alt="stamp" className="mt-9 w-[30%]" />
        </>
        
        
        }
      </div>
    </div>
  );
});

export default ViewAmc;
