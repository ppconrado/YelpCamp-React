import http from './http';
const API_URL = '/campgrounds';

export const getCampgrounds = async () => {
  const response = await http.get(API_URL);
  return response.data;
};

export const getCampground = async (id) => {
  const response = await http.get(`${API_URL}/${id}`);
  return response.data;
};

export const createCampground = async (campgroundData) => {
  // Nota: Para lidar com upload de arquivos (imagens), o backend espera FormData.
  // O frontend React precisará montar o FormData corretamente.
  const response = await http.post(API_URL, campgroundData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCampground = async (id, campgroundData) => {
  const response = await http.put(`${API_URL}/${id}`, campgroundData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCampground = async (id) => {
  const response = await http.delete(`${API_URL}/${id}`);
  return response.data;
};

export const deleteCampgroundImage = async (id, filename) => {
  const response = await http.put(`${API_URL}/${id}`, {
    deleteImages: [filename],
  });
  return response.data;
};
