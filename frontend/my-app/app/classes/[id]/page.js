'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { classAPI, instructorAPI, registrationAPI } from '@/lib/api';

export default function ClassDetailPage({ params }) {
  const router = useRouter();
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructorId: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClass();
    fetchInstructors();
  }, [params.id]);

  const fetchClass = async () => {
    try {
      setLoading(true);
      const response = await classAPI.getById(id);
      setClassData(response.data);
      setFormData({
        name: response.data.name,
        description: response.data.description || '',
        instructorId: response.data.instructorId || '',
      });
      setError(null);
    } catch (err) {
      setError('Failed to load class');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await instructorAPI.getAll();
      setInstructors(response.data);
    } catch (err) {
      console.error('Failed to load instructors:', err);
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
      await classAPI.update(id, formData);
      setIsEditing(false);
      fetchClass();
    } catch (err) {
      alert('Failed to update class');
      console.error(err);
    }
  };

  const handleRemoveParticipant = async (id) => {
    try {
      await registrationAPI.cancelParticipantRegistration(id);
      fetchClass();
    } catch (err) {
      alert('Failed to remove participant');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this class?')) {
      try {
        await classAPI.delete(id);
        router.push('/classes');
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

  if (error || !classData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Class not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Class Details</h1>
          <button onClick={() => router.back()} className="btn-secondary">
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="card">
                <h2 className="text-2xl font-semibold mb-6">Edit Class Information</h2>

                <div className="mb-4">
                  <label htmlFor="name" className="label">Class Name</label>
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
                  <label htmlFor="description" className="label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="input-field"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="instructorId" className="label">Instructor</label>
                  <select
                    id="instructorId"
                    name="instructorId"
                    value={formData.instructorId}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select an instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name} {instructor.specialty && `- ${instructor.specialty}`}
                      </option>
                    ))}
                  </select>
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
                  <div className="bg-purple-100 text-purple-600 w-20 h-20 rounded-full flex items-center justify-center text-3xl mr-6">
                    📚
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{classData.name}</h2>
                    <p className="text-gray-600">Class ID: {classData.id}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-lg text-gray-800">
                      {classData.description || 'No description provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Instructor</p>
                    <p className="text-lg font-semibold">
                      {classData.instructor?.name || 'Not assigned'}
                    </p>
                    {classData.instructor?.specialty && (
                      <p className="text-sm text-gray-600">{classData.instructor.specialty}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setIsEditing(true)} className="btn-primary">
                    Edit Class
                  </button>
                  <button onClick={handleDelete} className="btn-danger">
                    Delete Class
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Enrolled Participants</h3>
              <p className="text-3xl font-bold text-purple-600 mb-4">
                {classData.participantRegistrations?.length || 0}
              </p>
              {classData.participantRegistrations && classData.participantRegistrations.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {classData.participantRegistrations.map((reg) => (
                    <div key={reg.id} className="border border-gray-200 rounded-lg p-2">
                      <p className="font-semibold text-gray-800">{reg.participant.name}</p>
                      <p className="text-sm text-gray-600">{reg.participant.email}</p>

                      <button
                        onClick={() => handleRemoveParticipant(reg.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No participants enrolled yet</p>
              )}
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Additional Instructors</h3>
              {classData.instructorRegistrations && classData.instructorRegistrations.length > 0 ? (
                <div className="space-y-2">
                  {classData.instructorRegistrations.map((reg) => (
                    <div key={reg.id} className="border border-gray-200 rounded-lg p-2">
                      <p className="font-semibold text-gray-800">{reg.instructor.name}</p>
                      {reg.instructor.specialty && (
                        <p className="text-sm text-gray-600">{reg.instructor.specialty}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No additional instructors</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}