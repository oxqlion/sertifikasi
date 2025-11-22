'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { classAPI } from '@/lib/api';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classAPI.getAll();
      setClasses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this class?')) {
      try {
        await classAPI.delete(id);
        fetchClasses();
      } catch (err) {
        alert('Failed to delete class');
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
        <h1 className="text-4xl font-bold text-gray-800">Classes</h1>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/classes/new" className="btn-primary">
          Add New Class
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {classes.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No classes found</p>
          <Link href="/classes/new" className="btn-primary">
            Add Your First Class
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div key={classItem.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-xl">
                  📚
                </div>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  {classItem.participantRegistrations?.length || 0} students
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {classItem.name}
              </h3>
              
              {classItem.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {classItem.description}
                </p>
              )}
              
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Instructor</p>
                <p className="font-semibold text-gray-800">
                  {classItem.instructor?.name || 'Not assigned'}
                </p>
                {classItem.instructor?.specialty && (
                  <p className="text-xs text-gray-500">{classItem.instructor.specialty}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/classes/${classItem.id}`)}
                  className="flex-1 bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDelete(classItem.id)}
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