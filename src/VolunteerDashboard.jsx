import React, { useState, useEffect } from "react";
import axios from "axios";

export default function VolunteerPage() {

  const volunteerUserId = "user123";
  const donationId = "donation456";
  const [complete,setComplete] = useState(false);

  const [volunteerDonation, setVolunteerDonation] = useState({
    donationId,
    userId: volunteerUserId,
  });

  const [assignedDonation, setAssignedDonation] = useState(null);
  const [volunteer, setVolunteer] = useState(null);

  const [showRequest, setShowRequest] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  // Fallback values
  const fallbackDonation = {
    donorName: "Varsha Reddy",
    address: "17.4299,78.4532",
    foodType: "Rice & Veg Curry",
    quantity: 20,
    shelter: "Shelter A, Jubilee Hills",
    etaMinutes: 45,
  };

  const fallbackVolunteer = {
    name: "Arjun Rao",
    contact: "+91-9876543210",
    email: "arjun.rao@ngo.org",
    location: "17.4201,78.4483",
    availability: "9 AM - 6 PM",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationRes, volunteerRes] = await Promise.all([
          axios.get(`https://example.com/api/donation/${donationId}`),
          axios.get(`https://example.com/api/volunteer/${volunteerUserId}`),
        ]);

        const donationData = donationRes.data || fallbackDonation;
        const volunteerData = volunteerRes.data || fallbackVolunteer;

        setAssignedDonation(donationData);
        setVolunteer(volunteerData);
        setCountdown(45 * 60);
      } catch (error) {
        console.warn("❗ Fetch failed, using fallback data:", error);
        setAssignedDonation(fallbackDonation);
        setVolunteer(fallbackVolunteer);
        setCountdown(fallbackDonation.etaMinutes * 60);
      }
    };

    fetchData();
  }, []);

  const handleAccept = () => {
    setAccepted(true);
    setShowRequest(false);
    setShowProgress(true);

    const origin = volunteer?.location;
    const destination = assignedDonation?.address;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    window.open(mapsUrl, "_blank");
  };

  useEffect(() => {
    if (!showProgress || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showProgress, countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progressPercent = assignedDonation
    ? 100 - (countdown / (assignedDonation.etaMinutes * 60)) * 100
    : 0;

  if (!assignedDonation || !volunteer) {
    return <div className="p-6 text-center text-lg text-gray-600">Loading volunteer data...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#4E342E] font-sans p-6">
      <header className="bg-[#F57C00] text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
      </header>

      <section className="max-w-4xl mx-auto bg-white mt-6 p-6 rounded shadow">
        <h2 className="text-xl font-bold text-[#FB8C00] mb-4">Welcome, {volunteer.name}</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <p><strong>Email:</strong> {volunteer.email}</p>
          <p><strong>Phone:</strong> {volunteer.contact}</p>
          <p><strong>Location:</strong> {volunteer.location}</p>
          <p><strong>Availability:</strong> {volunteer.availability}</p>
        </div>
      </section>

      {showRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
            <h3 className="text-2xl font-bold text-[#F57C00] mb-2">New Donation Request</h3>
            <p className="mb-2">🍱 Donor: {assignedDonation.donorName}</p>
            <p className="mb-2">📍 Pickup: {assignedDonation.address}</p>
            <p className="mb-2">🏥 Shelter: {assignedDonation.shelter}</p>
            <p className="mb-4">ETA: {assignedDonation.etaMinutes} min</p>
            <button
              onClick={handleAccept}
              className="bg-[#66BB6A] text-white px-4 py-2 rounded hover:bg-[#43A047]"
            >
              Accept
            </button>
          </div>
        </div>
      )}

      {accepted && !complete && (
        <section className="max-w-4xl mx-auto bg-white mt-6 p-6 rounded shadow space-y-3">
          <h3 className="text-xl font-bold text-[#F57C00] mb-2">Accepted Donation</h3>
          <p><strong>Donation ID:</strong> {volunteerDonation.donationId}</p>
          <p><strong>User ID:</strong> {volunteerDonation.userId}</p>
          <p><strong>Donor:</strong> {assignedDonation.donorName}</p>
          <p><strong>Pickup Address:</strong> {assignedDonation.address}</p>
          <p><strong>Food Type:</strong> {assignedDonation.foodType}</p>
          <p><strong>Quantity:</strong> {assignedDonation.quantity} people</p>
          <p><strong>Shelter:</strong> {assignedDonation.shelter}</p>
          <p><strong>ETA:</strong> {assignedDonation.etaMinutes} min</p>
        </section>
      )}

      {showProgress && countdown> 0 && !complete && (
        <div className="max-w-4xl mx-auto bg-white mt-6 p-6 rounded shadow">
          <h3 className="text-lg font-semibold text-[#FB8C00] mb-2">On the Way</h3>
          <p>Time Left: <strong>{formatTime(countdown)}</strong></p>
          <div className="w-full bg-gray-300 rounded-full h-4 mt-2">
            <div
              className="bg-[#F57C00] h-4 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <button className="m-2 text-white" onClick={() => setComplete(true)}>Delivered</button>
        </div>
      )}

      {accepted && (countdown <= 0 || complete) && (
        <div className="max-w-4xl mx-auto bg-green-100 text-green-800 p-4 mt-6 rounded shadow text-center font-medium">
          🎉 Delivery Completed Successfully!
        </div>
      )}
    </div>
  );
}
