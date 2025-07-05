import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DonationPage() {
  axios.defaults.baseURL = "http://localhost:5000";
  const [formData, setFormData] = useState({
    donorName: "",
    description: "",
    quantity: "",
    contactPhone: "",
  });

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [assignedVolunteer, setAssignedVolunteer] = useState(null);
  const [assignedShelter, setAssignedShelter] = useState(null);
  const [checkMessage, setCheckMessage] = useState(false);
  const [countdown, setCountdown] = useState(45 * 60);
  const [showTrackPopup, setShowTrackPopup] = useState(false);
  const etaMinutes = 45;

  const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const progressPercent = etaMinutes > 0 ? 100 - (countdown / (etaMinutes * 60)) * 100 : 0;

useEffect(() => {
  if (!showTrackPopup || countdown <= 0) return;
  const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
  return () => clearInterval(timer);
}, [showTrackPopup, countdown]);

  const fallbackVolunteer = {
    name: "Arjun Rao",
    location: "17.4483,78.3915",
    contact: "+91-9876543210",
    email: "arjun.rao@ngo.org",
  };

  const fallbackShelter = {
    name: "Shelter A",
    location: "17.4460,78.3921",
    capacity: 100,
  };

  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const assignVolunteerAndShelter = async (donation) => {
    try {
      const [volunteersRes, sheltersRes] = await Promise.all([
        axios.get("/api/admin/volunteers"), //volunteer API
        axios.get("/api/hunger-spots"), //shelter API
      ]);

      const volunteers = volunteersRes.data || [fallbackVolunteer];
      const shelters = sheltersRes.data || [fallbackShelter];

      const [donLat, donLng] = donation.location.split(',').map(Number);

      const closestVolunteer = volunteers.map((v) => {
        const [vLat, vLng] = v.location.split(',').map(Number);
        return {
          ...v,
          distance: getDistanceInKm(donLat, donLng, vLat, vLng),
        };
      }).sort((a, b) => a.distance - b.distance)[0];

      const suitableShelter = shelters
        .filter((s) => s.capacity >= parseInt(donation.quantity))
        .map((s) => {
          const [sLat, sLng] = s.location.split(',').map(Number);
          return {
            ...s,
            distance: getDistanceInKm(donLat, donLng, sLat, sLng),
          };
        })
        .sort((a, b) => a.distance - b.distance)[0];

      setAssignedVolunteer(closestVolunteer || fallbackVolunteer);
      setAssignedShelter(suitableShelter || fallbackShelter);


      return {
        volunteerId: (closestVolunteer || fallbackVolunteer)._id || null,
        shelterName: (suitableShelter || fallbackShelter).name,
      };
    } catch (err) {
      console.warn("Fallbacks used due to error:", err);
      setAssignedVolunteer(fallbackVolunteer);
      setAssignedShelter(fallbackShelter);
      return {
        volunteerId: null,
        shelterName: fallbackShelter.name,
      };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(formData.quantity < 50) {setShowTrackPopup(false); setCheckMessage(true);}else{
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const fullLocation = `${lat},${lng}`;
        setLocation({ lat, lng });

        const donationData = {
          ...formData,
          location: fullLocation,
          status: "pending",
        };

        const { volunteerId, shelterName } = await assignVolunteerAndShelter({
          ...donationData,
        });

        const payload = {
          ...donationData,
          latitude: lat,
          longitude: lng,
          volunteerId,
          shelter: shelterName,
          expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // +2hr
          proofImageUrl: null,
        };

        setShowTrackPopup(true)
        setLocation(lat, lng );

        try {
          const response = await axios.post("/api/donations", payload);
          if (response.status === 201 || response.status === 200) {
            setShowPopup(true);
            setFormData({
              donorName: "",
              description: "",
              quantity: "",
              contactPhone: "",
            });
            setLocation({ lat: null, lng: null });
          } else {
            throw new Error("Submission failed");
          }
        } catch (err) {
          console.error("❌ Submission error:", err);
         // alert("Failed to submit donation.");
        }
      },
      (err) => {
        console.error(err);
        alert("⚠️ Location permission denied.");
      }
    );
}
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#4E342E] font-sans p-6">
      <header className="bg-[#F57C00] text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">Food Donation</h1>
      </header>

      <div className="max-w-3xl mx-auto bg-white mt-8 p-6 rounded shadow">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <h2 className="text-xl font-bold text-[#FB8C00] text-center">Donor Information</h2>
          <input name="donorName" value={formData.donorName} onChange={handleChange} placeholder="Your Name" className="border p-2 rounded w-full" required />
          <input name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="Phone Number" className="border p-2 rounded w-full" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Food Description" className="border p-2 rounded w-full" rows={3} required />
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity (people served)" className="border p-2 rounded w-full" required />
          {location.lat && (
            <div className="text-sm text-gray-600">
              📍 Location captured: {location.lat}, {location.lng}
            </div>
          )}
          <button type="submit" className="mt-4 bg-[#FB8C00] text-white px-6 py-2 rounded hover:bg-[#FFB300]">Submit Donation</button>
        </form>
      </div>

      {showTrackPopup && assignedVolunteer && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-xl text-center max-w-md w-full">
      <h3 className="text-xl font-bold text-green-700 mb-2">🚗 Volunteer On the Way</h3>
      <p className="mb-1"><strong>Volunteer:</strong> {assignedVolunteer.name}</p>
      <p className="mb-1"><strong>Contact:</strong> {assignedVolunteer.contact}</p>
      <p className="mb-2"><strong>ETA:</strong> {formatTime(countdown)}</p>


      {/* In-App Google Maps Preview */}
      <div className="my-4 rounded overflow-hidden">
        <iframe
          title="Volunteer Location"
          width="100%"
          height="200"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=mapnik&marker=${location.lat},${location.lng}`}
        ></iframe>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 mt-2 mb-4">
        <div
          className="bg-[#FB8C00] h-4 rounded-full transition-all duration-1000"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <button
        onClick={() => setShowTrackPopup(false)}
        className="bg-[#F57C00] text-white px-4 py-2 rounded hover:bg-[#FFB300]"
      >
        Close
      </button>
    </div>
  </div>
)}
{
  checkMessage && (
    <div className="max-w-4xl mx-auto bg-red-100 text-white-800 p-4 mt-6 rounded shadow text-center font-medium">
      Minimum quantity of donation is 50 people<br/>Please visit the nearest hunger spot if you can deliver.
    </div>
  )
}
    </div>
  );
}
