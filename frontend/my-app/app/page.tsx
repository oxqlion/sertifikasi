import Link from 'next/link';

export default function Home() {
  const modules = [
    {
      title: 'Participants',
      description: 'Manage student information, enrollments, and track their progress',
      icon: '👥',
      link: '/participants',
      color: 'bg-blue-500',
    },
    {
      title: 'Instructors',
      description: 'Manage instructor profiles, specialties, and class assignments',
      icon: '👨‍🏫',
      link: '/instructors',
      color: 'bg-green-500',
    },
    {
      title: 'Classes',
      description: 'Create and manage classes, schedules, and course content',
      icon: '📚',
      link: '/classes',
      color: 'bg-purple-500',
    },
    {
      title: 'Registrations',
      description: 'Handle class enrollments and manage participant-class relationships',
      icon: '📝',
      link: '/registrations',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to SkillHub
        </h1>
        <p className="text-xl text-gray-600">
          Your complete class management solution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module) => (
          <Link
            key={module.title}
            href={module.link}
            className="card group hover:scale-105 transform transition-all duration-200"
          >
            <div className={`${module.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
              {module.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {module.title}
            </h2>
            <p className="text-gray-600">
              {module.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}