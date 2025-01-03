import React, {useEffect, useState} from 'react';
import { createPost } from '../../services/postService';
import { getIcons } from '../../services/iconService';

const CreatePost = ({ onNewPost }) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [availableIcons, setAvailableIcons] = useState([]);

  useEffect(() => {
    fetchIcons();
  }, []);

  const fetchIcons = async () => {
    try {
      const icons = await getIcons();
      setAvailableIcons(icons);
    } catch (error) {
      console.error('Error fetching icons:', error);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const handleIconSelect = (icon) => {
    setSelectedIcons([...selectedIcons, icon]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPost = await createPost(content, attachments, selectedIcons);
      onNewPost(newPost);
      setContent('');
      setAttachments([]);
      setSelectedIcons([]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post">
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Bạn đang nghĩ gì?"
      />
      <input type="file" multiple onChange={handleFileChange} />
      <div className="icon-selector">
        {availableIcons.map(icon => (
          <button key={icon.id} type="button" onClick={() => handleIconSelect(icon)}>
            {icon.icon_name}
          </button>
        ))}
      </div>
      <button type="submit">Đăng bài</button>
    </form>
  );
};

export default CreatePost;