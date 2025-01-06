import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostService from "../../services/PostService";

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const postData = {
        content: content,
        // Add any other necessary fields here, e.g., userId, privacy settings, etc.
      };

      const response = await PostService.createPost(postData, files);
      console.log('Post created successfully:', response.data);
      navigate('/'); // Redirect to home page or post list
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="content">Post Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            required
            rows="4"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="files">Upload Files:</label>
          <input
            type="file"
            id="files"
            onChange={handleFileChange}
            multiple
            className="form-control-file"
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;