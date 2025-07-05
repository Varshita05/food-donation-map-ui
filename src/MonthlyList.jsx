import React from 'react'

const MonthlyList = () => {
  const industryDonors = {
  "id1": { name: "ABC Canteen", type: "canteen" },
  "id2": { name: "XYZ Corp", type: "corporate" },
  "id3": { name: "NIT College", type: "college" },
  };

// Dummy donation records
const donationRecords = [
  { industryDonorId: "id1", date: "2025-06-01", Quantity: 120, notes: "Monthly lunch" },
  { industryDonorId: "id2", date: "2025-06-05", Quantity: 200 },
  { industryDonorId: "id3", date: "2025-06-10", Quantity: 80, notes: "Seminar" },
  { industryDonorId: "id1", date: "2025-06-15", Quantity: 150 },
  { industryDonorId: "id2", date: "2025-06-20", Quantity: 100, notes: "Team event" },
];

  return (
    <div className="mt-10 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📅 Monthly Report</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Organization</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Notes</th>
              </tr>
            </thead>
            <tbody>
              {donationRecords.map((rec, i) => {
                const donor = industryDonors[rec.industryDonorId] || {};
                return (
                  <tr key={i} className="border-t text-gray-600">
                    <td className="px-4 py-2 border">{new Date(rec.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{donor.name || "Unknown"}</td>
                    <td className="px-4 py-2 border capitalize">{donor.type || "other"}</td>
                    <td className="px-4 py-2 border">{rec.Quantity}</td>
                    <td className="px-4 py-2 border">{rec.notes || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default MonthlyList
