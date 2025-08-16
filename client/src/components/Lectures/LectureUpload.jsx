// components/Lectures/LectureUpload.js
import { useState } from 'react';
import axios from 'axios';

function LectureUpload() {
  const [fields, setFields] = useState({ title: '', description: '', content: '', visuals: '' });

  const handleChange = e =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('/api/lectures/upload', fields, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    // Handle success/error
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" onChange={handleChange} />
      <textarea name="description" onChange={handleChange} />
      <textarea name="content" onChange={handleChange} />
      <input name="visuals" onChange={handleChange} placeholder="Image URLs (comma-separated)" />
      <button type="submit">Upload Lecture</button>
    </form>
  );
}
export default LectureUpload;
