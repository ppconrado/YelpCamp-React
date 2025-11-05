import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCampground, updateCampground } from '../api/campgrounds';
import { useFlash } from '../context/FlashContext';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import SubmitButton from './ui/SubmitButton';

const campgroundSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  location: z.string().min(3, 'Localização deve ter pelo menos 3 caracteres'),
  price: z.coerce.number().min(0, 'Preço deve ser maior ou igual a zero'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
});

const CampgroundForm = ({ initialData = {}, isEdit = false }) => {
  const [imageFile, setImageFile] = useState(null);
  const { showFlash } = useFlash();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(campgroundSchema),
    defaultValues: {
      title: initialData.title || '',
      location: initialData.location || '',
      price: initialData.price || 0,
      description: initialData.description || '',
    },
  });

  // Warn user about unsaved changes
  useUnsavedChanges(isDirty && !isSubmitting);

  useEffect(() => {
    if (isEdit && initialData) {
      reset({
        title: initialData.title || '',
        location: initialData.location || '',
        price: initialData.price || 0,
        description: initialData.description || '',
      });
    }
  }, [isEdit, initialData, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('campground[title]', data.title);
    formData.append('campground[location]', data.location);
    formData.append('campground[price]', data.price);
    formData.append('campground[description]', data.description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let response;
      if (isEdit) {
        response = await updateCampground(initialData._id, formData);
      } else {
        response = await createCampground(formData);
      }
      showFlash(response.message, 'success');
      navigate(`/campgrounds/${response.campground._id}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Erro ao salvar acampamento.';
      showFlash(errorMessage, 'error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="validated-form"
      encType="multipart/form-data"
      noValidate
    >
      <div className="form-floating mb-3">
        <input
          type="text"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          id="title"
          placeholder="Title"
          {...register('title')}
        />
        <label htmlFor="title">Title</label>
        {errors.title && (
          <div className="invalid-feedback">{errors.title.message}</div>
        )}
      </div>

      <div className="form-floating mb-3">
        <input
          type="text"
          className={`form-control ${errors.location ? 'is-invalid' : ''}`}
          id="location"
          placeholder="Location"
          {...register('location')}
        />
        <label htmlFor="location">Location</label>
        {errors.location && (
          <div className="invalid-feedback">{errors.location.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="price">
          Campground Price
        </label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
            id="price"
            placeholder="0.00"
            {...register('price')}
          />
          {errors.price && (
            <div className="invalid-feedback">{errors.price.message}</div>
          )}
        </div>
      </div>

      <div className="form-floating mb-3">
        <textarea
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          id="description"
          placeholder="Description"
          style={{ height: '120px' }}
          {...register('description')}
        ></textarea>
        <label htmlFor="description">Description</label>
        {errors.description && (
          <div className="invalid-feedback">{errors.description.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          Add Image
        </label>
        <input
          className="form-control"
          type="file"
          id="image"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      <SubmitButton loading={isSubmitting} className="btn btn-success">
        {isEdit ? 'Update Campground' : 'Add Campground'}
      </SubmitButton>
    </form>
  );
};

export default CampgroundForm;
