import React from 'react';

function AdminDashboard() {
  const orgs = [
    { name: 'Red Cross', type: 'Health', location: 'USA' },
    { name: 'UNICEF', type: 'Children', location: 'Global' },
  ];

  return (
    <div className="flex">
      <main className="p-6 w-full">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orgs.map((org, idx) => (
            <div key={idx} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold">{org.name}</h2>
              <p>Type: {org.type}</p>
              <p>Location: {org.location}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
