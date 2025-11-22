'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { instructorAPI } from '@/lib/api';

export default function InstructorDetailPage({ params }) {
  const router = useRouter();
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstructor();
  }, [params.id]);

  const fetchInstructor = async () => {
    try {
      setLoading(true);
      const response = await instructorAPI.getById(id);
      setInstructor(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        specialty: response.data.specialty || '',
      });
      setError(null);
    } catch (err) {
      setError('Failed to load instructor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await instructorAPI.update(id, formData);
      setIsEditing(false);
      fetchInstructor();
    } catch (err) {
      alert('Failed to update instructor');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this instructor?')) {
      try {
        await instructorAPI.delete(id);
        router.push('/instructors');
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

  if (error || !instructor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Instructor not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Instructor Details</h1>
          <button onClick={() => router.back()} className="btn-secondary">
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="card">
                <h2 className="text-2xl font-semibold mb-6">Edit Information</h2>
                
                <div className="mb-4">
                  <label htmlFor="name" className="label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="label">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="specialty" className="label">Specialty</label>
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="card">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mr-6">
                    {instructor.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{instructor.name}</h2>
                    {instructor.specialty && (
                      <p className="text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block mt-2">
                        {instructor.specialty}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-semibold">{instructor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-lg font-semibold">{instructor.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Instructor ID</p>
                    <p className="text-lg font-semibold">{instructor.id}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setIsEditing(true)} className="btn-primary">
                    Edit Information
                  </button>
                  <button onClick={handleDelete} className="btn-danger">
                    Delete Instructor
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Teaching Classes</h3>
              {instructor.classes && instructor.classes.length > 0 ? (
                <div className="space-y-3">
                  {instructor.classes.map((classItem) => (
                    <div key={classItem.id} className="border border-gray-200 rounded-lg p-3">
                      <p className="font-semibold text-gray-800">{classItem.name}</p>
                      {classItem.description && (
                        <p className="text-sm text-gray-600 mt-1">{classItem.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Not teaching any classes</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}