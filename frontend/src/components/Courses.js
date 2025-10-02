import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../utils/Web3Context';

export default function Courses() {
  const { eduChain, account } = useWeb3();
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    contentURI: '',
    difficulty: 1
  });

  useEffect(() => {
    if (eduChain) {
      loadCourses();
    }
  }, [eduChain]);

  const loadCourses = async () => {
    try {
      // For demo purposes, we'll load first 10 courses
      const coursesData = [];
      for (let i = 1; i <= 10; i++) {
        try {
          const course = await eduChain.getCourse(i);
          if (course.title !== '') {
            coursesData.push({ id: i, ...course });
          }
        } catch (error) {
          break;
        }
      }
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const tx = await eduChain.createCourse(
        newCourse.title,
        newCourse.description,
        newCourse.contentURI,
        newCourse.difficulty
      );
      await tx.wait();
      loadCourses();
      setNewCourse({ title: '', description: '', contentURI: '', difficulty: 1 });
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Educational Courses</h2>
      
      {/* Create Course Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Create New Course</h3>
        <form onSubmit={handleCreateCourse}>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Course Title"
              value={newCourse.title}
              onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Course Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Content URI"
              value={newCourse.contentURI}
              onChange={(e) => setNewCourse({...newCourse, contentURI: e.target.value})}
              className="border p-2 rounded"
            />
            <input
              type="number"
              min="1"
              max="5"
              value={newCourse.difficulty}
              onChange={(e) => setNewCourse({...newCourse, difficulty: parseInt(e.target.value)})}
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-2">{course.description}</p>
            <p className="mb-2">Difficulty: {course.difficulty.toString()}</p>
            <p className="text-sm text-gray-500">
              Instructor: {course.instructor.substring(0, 6)}...{course.instructor.substring(38)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 