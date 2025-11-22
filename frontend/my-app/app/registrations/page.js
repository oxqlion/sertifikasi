'use client';

import { useState, useEffect } from 'react';
import { participantAPI, instructorAPI, classAPI, registrationAPI } from '@/lib/api';
import Link from 'next/link';

export default function RegistrationsPage() {
    const [activeTab, setActiveTab] = useState('participant');
    const [participants, setParticipants] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [classes, setClasses] = useState([]);
    const [participantForm, setParticipantForm] = useState({
        participantId: '',
        classId: '',
    });
    const [instructorForm, setInstructorForm] = useState({
        instructorId: '',
        classId: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [participantsRes, instructorsRes, classesRes] = await Promise.all([
                participantAPI.getAll(),
                instructorAPI.getAll(),
                classAPI.getAll(),
            ]);
            setParticipants(participantsRes.data);
            setInstructors(instructorsRes.data);
            setClasses(classesRes.data);
        } catch (err) {
            console.error('Failed to load data:', err);
        }
    };

    const handleParticipantSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await registrationAPI.registerParticipant(participantForm);
            setMessage({ type: 'success', text: 'Participant registered successfully!' });
            setParticipantForm({ participantId: '', classId: '' });
            fetchData();
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to register participant',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInstructorSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await registrationAPI.registerInstructor(instructorForm);
            setMessage({ type: 'success', text: 'Instructor assigned successfully!' });
            setInstructorForm({ instructorId: '', classId: '' });
            fetchData();
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.error || 'Failed to assign instructor',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Registration Management</h1>
            <Link href="/" className="btn-primary">
                Back to Home
            </Link>

            <div className="mb-6 border-b border-gray-300">
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            setActiveTab('participant');
                            setMessage({ type: '', text: '' });
                        }}
                        className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'participant'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Participant Registration
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('instructor');
                            setMessage({ type: '', text: '' });
                        }}
                        className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'instructor'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Instructor Assignment
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('view');
                            setMessage({ type: '', text: '' });
                        }}
                        className={`px-6 py-3 font-semibold border-b-2 transition-colors ${activeTab === 'view'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        View Registrations
                    </button>
                </div>
            </div>

            {message.text && (
                <div
                    className={`mb-6 px-4 py-3 rounded ${message.type === 'success'
                            ? 'bg-green-100 border border-green-400 text-green-700'
                            : 'bg-red-100 border border-red-400 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {activeTab === 'participant' && (
                <div className="max-w-2xl mx-auto">
                    <div className="card">
                        <h2 className="text-2xl font-semibold mb-6">Register Participant to Class</h2>
                        <form onSubmit={handleParticipantSubmit}>
                            <div className="mb-6">
                                <label htmlFor="participantId" className="label">
                                    Select Participant *
                                </label>
                                <select
                                    id="participantId"
                                    value={participantForm.participantId}
                                    onChange={(e) =>
                                        setParticipantForm({ ...participantForm, participantId: e.target.value })
                                    }
                                    required
                                    className="input-field"
                                >
                                    <option value="">Choose a participant</option>
                                    {participants.map((participant) => (
                                        <option key={participant.id} value={participant.id}>
                                            {participant.name} - {participant.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="classId" className="label">
                                    Select Class *
                                </label>
                                <select
                                    id="classId"
                                    value={participantForm.classId}
                                    onChange={(e) =>
                                        setParticipantForm({ ...participantForm, classId: e.target.value })
                                    }
                                    required
                                    className="input-field"
                                >
                                    <option value="">Choose a class</option>
                                    {classes.map((classItem) => (
                                        <option key={classItem.id} value={classItem.id}>
                                            {classItem.name} - {classItem.instructor?.name || 'No instructor'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full"
                            >
                                {loading ? 'Registering...' : 'Register Participant'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'instructor' && (
                <div className="max-w-2xl mx-auto">
                    <div className="card">
                        <h2 className="text-2xl font-semibold mb-6">Assign Instructor to Class</h2>
                        <form onSubmit={handleInstructorSubmit}>
                            <div className="mb-6">
                                <label htmlFor="instructorId" className="label">
                                    Select Instructor *
                                </label>
                                <select
                                    id="instructorId"
                                    value={instructorForm.instructorId}
                                    onChange={(e) =>
                                        setInstructorForm({ ...instructorForm, instructorId: e.target.value })
                                    }
                                    required
                                    className="input-field"
                                >
                                    <option value="">Choose an instructor</option>
                                    {instructors.map((instructor) => (
                                        <option key={instructor.id} value={instructor.id}>
                                            {instructor.name} {instructor.specialty && `- ${instructor.specialty}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="classIdInstructor" className="label">
                                    Select Class *
                                </label>
                                <select
                                    id="classIdInstructor"
                                    value={instructorForm.classId}
                                    onChange={(e) =>
                                        setInstructorForm({ ...instructorForm, classId: e.target.value })
                                    }
                                    required
                                    className="input-field"
                                >
                                    <option value="">Choose a class</option>
                                    {classes.map((classItem) => (
                                        <option key={classItem.id} value={classItem.id}>
                                            {classItem.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full"
                            >
                                {loading ? 'Assigning...' : 'Assign Instructor'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'view' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="text-2xl font-semibold mb-6">Classes Overview</h2>
                        <div className="space-y-4">
                            {classes.map((classItem) => (
                                <div key={classItem.id} className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2">{classItem.name}</h3>
                                    <div className="text-sm space-y-1">
                                        <p className="text-gray-600">
                                            Primary Instructor: {classItem.instructor?.name || 'Not assigned'}
                                        </p>
                                        <p className="text-gray-600">
                                            Students enrolled: {classItem.participantRegistrations?.length || 0}
                                        </p>
                                        <p className="text-gray-600">
                                            Additional instructors: {classItem.instructorRegistrations?.length || 0}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="card">
                            <h2 className="text-2xl font-semibold mb-6">Participants Overview</h2>
                            <div className="space-y-3">
                                {participants.slice(0, 5).map((participant) => (
                                    <div key={participant.id} className="border border-gray-200 rounded-lg p-3">
                                        <p className="font-semibold text-gray-800">{participant.name}</p>
                                        <p className="text-sm text-gray-600">
                                            Enrolled in {participant.registrations?.length || 0} classes
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="text-2xl font-semibold mb-6">Instructors Overview</h2>
                            <div className="space-y-3">
                                {instructors.slice(0, 5).map((instructor) => (
                                    <div key={instructor.id} className="border border-gray-200 rounded-lg p-3">
                                        <p className="font-semibold text-gray-800">{instructor.name}</p>
                                        <p className="text-sm text-gray-600">
                                            Teaching {instructor.classes?.length || 0} classes
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}