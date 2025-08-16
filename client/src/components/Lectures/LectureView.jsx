import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ListView = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Replace with your backend API endpoint
    axios.get("/api/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Failed to load courses:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 drop-shadow">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition duration-300"
            >
              <h2 className="text-xl font-semibold text-purple-800">{course.title}</h2>
              <p className="text-gray-600 mt-2">{course.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Instructor: {course.instructorName}</span>
                <button className="bg-purple-600 text-white px-3 py-1 rounded-xl text-sm hover:bg-purple-700">
                  View
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 text-lg">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default ListView;
