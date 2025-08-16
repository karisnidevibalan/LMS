import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LectureComments({ lectureId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0); // Triggers re-fetch

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/lectures/${lectureId}/comments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setComments(res.data);
        setLoading(false);
      } catch  {
        setLoading(false);
        alert('Failed to fetch comments');
      }
    };
    if (lectureId) fetchComments();
  }, [lectureId, refresh]);

  const submit = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await axios.post(`/api/lectures/${lectureId}/comments`, { text }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setText('');
      setRefresh(r => r + 1); // Triggers re-fetch
    } catch  {
      alert('Failed to post comment');
    }
  };

  return (
    <div>
      <form onSubmit={submit} style={{ marginBottom: '1em' }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a comment"
          style={{ width: '60%', marginRight: '0.5em' }}
        />
        <button type="submit" disabled={!text.trim()}>Post</button>
      </form>
      {loading ? (
        <div>Loading comments...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {comments.map(c => (
            <li key={c._id} style={{ marginBottom: '0.5em' }}>
              <b>{c.user?.name || 'Anonymous'}:</b> {c.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LectureComments;
