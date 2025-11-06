import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCampgrounds } from '../../api/campgrounds';
import MapboxMap from '../../components/MapboxMap';
import { useFlash } from '../../context/FlashContext';

const CampgroundIndex = () => {
  const [campgrounds, setCampgrounds] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, totalPages: 1, hasNext: false, hasPrev: false });
  const [loading, setLoading] = useState(true);
  const { showFlash } = useFlash();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = 12;

  useEffect(() => {
    const fetchCampgrounds = async () => {
      try {
        const data = await getCampgrounds({ page: pageFromUrl, limit });
        setCampgrounds(data.items);
        setMeta({
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
          hasNext: data.hasNext,
          hasPrev: data.hasPrev,
        });
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
  }, [showFlash, pageFromUrl]);

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

  const goToPage = (p) => {
    const next = Math.max(1, Math.min(p, meta.totalPages));
    setSearchParams({ page: String(next) });
    setLoading(true);
  };

  return (
    <div>
      <h1 className="mb-4">All Campgrounds</h1>
      <div className="map-card mb-4">
        <MapboxMap
          geoJson={geoJson}
          center={[-47.8825, -15.7942]} // Brasília
          zoom={5}
          fitToBounds={false}
          projection="globe"
          spinOnLoad={true}
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

      {/* Pagination controls */}
      <nav className="d-flex justify-content-center mt-4" aria-label="Campgrounds pages">
        <ul className="pagination">
          <li className={`page-item ${!meta.hasPrev ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => goToPage(meta.page - 1)} aria-label="Anterior">&laquo;</button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">Página {meta.page} de {meta.totalPages}</span>
          </li>
          <li className={`page-item ${!meta.hasNext ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => goToPage(meta.page + 1)} aria-label="Próxima">&raquo;</button>
          </li>
        </ul>
      </nav>

      {/* Mobile sticky pager */}
      <div className="d-md-none position-sticky bottom-0 bg-light border-top py-2" style={{ zIndex: 1020 }}>
        <div className="container d-flex justify-content-between align-items-center">
          <button className="btn btn-outline-secondary btn-sm" disabled={!meta.hasPrev} onClick={() => goToPage(meta.page - 1)}>Anterior</button>
          <span className="small">{meta.page}/{meta.totalPages}</span>
          <button className="btn btn-outline-secondary btn-sm" disabled={!meta.hasNext} onClick={() => goToPage(meta.page + 1)}>Próxima</button>
        </div>
      </div>
    </div>
  );
};

export default CampgroundIndex;
