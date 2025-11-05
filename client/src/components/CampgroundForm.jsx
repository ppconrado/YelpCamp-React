import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCampground, updateCampground } from '../api/campgrounds';
import { useFlash } from '../context/FlashContext';

const CampgroundForm = ({ initialData = {}, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    location: initialData.location || '',
    price: initialData.price || 0,
    description: initialData.description || '',
    image: null, // Para o upload de arquivo
  });
  const [loading, setLoading] = useState(false);
  const { showFlash } = useFlash();
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        title: initialData.title || '',
        location: initialData.location || '',
        price: initialData.price || 0,
        description: initialData.description || '',
        image: null,
      });
    }
  }, [isEdit, initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('campground[title]', formData.title);
    data.append('campground[location]', formData.location);
    data.append('campground[price]', formData.price);
    data.append('campground[description]', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      let response;
      if (isEdit) {
        response = await updateCampground(initialData._id, data);
      } else {
        response = await createCampground(data);
      }
      showFlash(response.message, 'success');
      navigate(`/campgrounds/${response.campground._id}`);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao salvar acampamento.';
      showFlash(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="validated-form" encType="multipart/form-data" noValidate>
      <div className="mb-3">
        <label className="form-label" htmlFor="title">Title</label>
        <input
          className="form-control"
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="location">Location</label>
        <input
          className="form-control"
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="price">Campground Price</label>
        <div className="input-group">
          <span className="input-group-text" id="price-label">$</span>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            placeholder="0.00"
            aria-label="price"
            aria-describedby="price-label"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">Add Image</label>
        <input
          className="form-control"
          type="file"
          id="image"
          name="image"
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] }))}
        />
      </div>
      <div className="mb-3">
        <button className="btn btn-success" disabled={loading}>
          {loading ? 'Saving...' : (isEdit ? 'Update Campground' : 'Add Campground')}
        </button>
      </div>
    </form>
  );
};

export default CampgroundForm;
