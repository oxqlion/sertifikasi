'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { participantAPI } from '@/lib/api';

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await participantAPI.getAll();
      setParticipants(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load participants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this participant?')) {
      try {
        await participantAPI.delete(id);
        fetchParticipants();
      } catch (err) {
        alert('Failed to delete participant');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Participants</h1>
        <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        <Link href="/participants/new" className="btn-primary">
          Add New Participant
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {participants.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No participants found</p>          
          <Link href="/participants/new" className="btn-primary">
            Add Your First Participant
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {participants.map((participant) => (
            <div key={participant.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  {participant.name.charAt(0)}
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {participant.registrations?.length || 0} classes
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {participant.name}
              </h3>
              
              <div className="space-y-1 text-gray-600 mb-4">
                <p className="flex items-center">
                  <span className="mr-2">📧</span>
                  {participant.email}
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📱</span>
                  {participant.phone}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/participants/${participant.id}`)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDelete(participant.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}