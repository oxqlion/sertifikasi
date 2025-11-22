'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { instructorAPI } from '@/lib/api';

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await instructorAPI.getAll();
      setInstructors(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load instructors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this instructor?')) {
      try {
        await instructorAPI.delete(id);
        fetchInstructors();
      } catch (err) {
        alert('Failed to delete instructor');
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
        <h1 className="text-4xl font-bold text-gray-800">Instructors</h1>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/instructors/new" className="btn-primary">
          Add New Instructor
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {instructors.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No instructors found</p>
          <Link href="/instructors/new" className="btn-primary">
            Add Your First Instructor
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  {instructor.name.charAt(0)}
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {instructor.classes?.length || 0} classes
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {instructor.name}
              </h3>
              
              {instructor.specialty && (
                <p className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block mb-3">
                  {instructor.specialty}
                </p>
              )}
              
              <div className="space-y-1 text-gray-600 mb-4">
                <p className="flex items-center">
                  <span className="mr-2">📧</span>
                  {instructor.email}
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📱</span>
                  {instructor.phone}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/instructors/${instructor.id}`)}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDelete(instructor.id)}
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