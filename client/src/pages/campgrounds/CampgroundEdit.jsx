import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CampgroundForm from '../../components/CampgroundForm';
import { getCampground } from '../../api/campgrounds';
import { useFlash } from '../../context/FlashContext';
import CenteredCard from '../../components/ui/CenteredCard';

const CampgroundEdit = () => {
  const [campground, setCampground] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { showFlash } = useFlash();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampground = async () => {
      try {
        const data = await getCampground(id);
        setCampground(data);
      } catch {
        showFlash(
          'Não foi possível encontrar este acampamento para edição!',
          'error'
        );
        navigate('/campgrounds');
      } finally {
        setLoading(false);
      }
    };
    fetchCampground();
  }, [id, showFlash, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!campground) {
    return null;
  }

  return (
    <CenteredCard
      title="Edit Campground"
      subtitle="Atualize as informações do camping"
    >
      <CampgroundForm initialData={campground} isEdit={true} />
    </CenteredCard>
  );
};

export default CampgroundEdit;
