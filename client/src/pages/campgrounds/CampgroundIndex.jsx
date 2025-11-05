import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCampgrounds } from '../../api/campgrounds';
import MapboxMap from '../../components/MapboxMap';
import { useFlash } from '../../context/FlashContext';

const CampgroundIndex = () => {
  const [campgrounds, setCampgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showFlash } = useFlash();

  useEffect(() => {
    const fetchCampgrounds = async () => {
      try {
        const data = await getCampgrounds();
        setCampgrounds(data);
      } catch {
        showFlash('Erro ao carregar acampamentos.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCampgrounds();
    // Set a subtle page background to match the white cards
    document.body.classList.remove('home-hero');
    document.body.classList.add('camp-list-bg');
    return () => {
      document.body.classList.remove('camp-list-bg');
    };
  }, [showFlash]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Criar GeoJSON para o mapa de cluster
  const geoJson = {
    type: 'FeatureCollection',
    features: campgrounds.map((campground) => ({
      type: 'Feature',
      geometry: campground.geometry,
      properties: {
        popUpMarkup: `<h5>${campground.title}</h5><p>${campground.location}</p>`,
        title: campground.title,
        id: campground._id,
      },
    })),
  };

  return (
    <div>
      <h1 className="mb-4">All Campgrounds</h1>
      <div className="map-card mb-4">
        <MapboxMap
          geoJson={geoJson}
          center={[-98.583333, 39.833333]}
          zoom={3}
          height={450}
        />
      </div>
      {campgrounds.map((campground) => (
        <div
          className="card mb-3 camp-card position-relative"
          key={campground._id}
        >
          <div className="row">
            <div className="col-md-4">
              {campground.images && campground.images.length > 0 && (
                <img
                  className="img-fluid camp-card-img"
                  alt=""
                  src={campground.images[0].url}
                />
              )}
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{campground.title}</h5>
                <p className="card-text">
                  {campground.description.substring(0, 100)}...
                </p>
                <p className="card-text">
                  <small className="text-muted">{campground.location}</small>
                </p>
                <Link
                  to={`/campgrounds/${campground._id}`}
                  className="stretched-link"
                  aria-label={`Ver ${campground.title}`}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampgroundIndex;
