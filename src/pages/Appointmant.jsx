import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets, doctors } from "../assets/assets";
import RelatedDoctor from "../components/RelatedDoctor";

const Appointment = () => {
  const { docId } = useParams();
  const { Doctors, currencySymbol } = useContext(AppContext);
  const dayOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlot = async () => {
    setDocSlot([]);

    // Getting current date
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      // Getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Setting end time with the index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // Setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Add slot to array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });

        // Increment time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      // Update the state
      setDocSlot((prev) => [...prev, timeSlots]);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlot();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlot);
  }, [docSlot]);

  return (
    docInfo && (
      <div>
        {/* Doctor details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 mt-[-80px] sm:mt-0">
            {/* Doctor info name, experience */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* Doctor about */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1 ">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* Booking slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlot.length > 0 &&
              docSlot.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{item[0] && dayOfWeek[item[0].datetime.getDay()]}</p>{" "}
                  {/* Get the day of the week */}
                  <p>{item[0] && item[0].datetime.getDate()}</p>{" "}
                  {/* Get the day of the month */}
                </div>
              ))}
          </div>
        </div>
        <div className="flex justify-center items-center gap-3 w-full overflow-x-scroll mt-4">
  {/* Slot time rendering */}
  {docSlot.length > 0 &&
    docSlot[slotIndex].map((item, index) => (
      <p
        onClick={() => setSlotTime(item.time)}
        className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
          item.time === slotTime ? "bg-primary text-white" : "text-gray-400 border border-gray-300"
        }`}
        key={index}
      >
        {typeof item.time === "string" && item.time.toLowerCase()}
      </p>
    ))}
</div>
<div className="flex justify-center">
  <button className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6">
    Book an Appointment
  </button>
</div>

{/*---Listing Related Doctors----- */}
<RelatedDoctor docId={docId} speciality={docInfo.speciality}/>

      </div>
    )
  );
};

export default Appointment;
