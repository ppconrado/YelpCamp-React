import React from 'react';
import CampgroundForm from '../../components/CampgroundForm';
import CenteredCard from '../../components/ui/CenteredCard';

const CampgroundNew = () => {
  return (
    <CenteredCard
      title="New Campground"
      subtitle="Compartilhe um novo local para acampar"
    >
      <CampgroundForm />
    </CenteredCard>
  );
};

export default CampgroundNew;
