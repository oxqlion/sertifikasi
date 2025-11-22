'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { classAPI, instructorAPI } from '@/lib/api';

export default function NewClassPage() {
  const router = useRouter();
  const [instructors, setInstructors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructorId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await classAPI.create(formData);
      router.push('/classes');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create class');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Add New Class</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <div className="mb-6">
            <label htmlFor="name" className="label">
              Class Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="e.g., Advanced JavaScript Programming"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input-field"
              placeholder="Brief description of the class..."
            />
          </div>

          <div className="mb-6">
            <label htmlFor="instructorId" className="label">
              Assign Instructor *
            </label>
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
            {instructors.length === 0 && (
              <p className="text-sm text-gray-600 mt-2">
                No instructors available. Please add an instructor first.
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || instructors.length === 0}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Class'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}