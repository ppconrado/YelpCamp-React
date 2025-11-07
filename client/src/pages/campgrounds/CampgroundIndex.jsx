import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCampgrounds } from '../../api/campgrounds';
import MapboxMap from '../../components/MapboxMap';
import CardSkeleton from '../../components/ui/CardSkeleton';
import { useFlash } from '../../context/FlashContext';
import { timeAgo, deriveTimestampFromId } from '../../utils/timeAgo';

const CampgroundIndex = () => {
  const [campgrounds, setCampgrounds] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const { showFlash } = useFlash();
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollContainerRef = useRef(null);
  const [now, setNow] = useState(Date.now());

  const pageFromUrl = Math.max(
    1,
    parseInt(searchParams.get('page') || '1', 10)
  );
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
    // Enable inner scrolling with static footer/header on this page
    document.body.classList.add('camp-scroll');

    return () => {
      document.body.classList.remove('camp-list-bg');
      document.body.classList.remove('camp-scroll');
    };
  }, [showFlash, pageFromUrl]);

  // Live update timestamps every minute
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  // Scroll to top after content is loaded
  useEffect(() => {
    if (!loading && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [loading, pageFromUrl]);

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

  if (loading) {
    return (
      <>
        <div className="camp-scroll-inner" ref={scrollContainerRef}>
          <h1 className="mb-4">All Campgrounds</h1>
          <div className="map-card mb-4">
            <div
              style={{
                height: '450px',
                backgroundColor: '#e0e0e0',
                animation: 'skeleton-pulse 1.5s ease-in-out infinite',
              }}
            />
          </div>
          {[...Array(6)].map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
        {/* Mobile pager fixo - fora do scroll */}
        <div className="d-md-none mobile-pager-fixed">
          <div className="container d-flex justify-content-between align-items-center">
            <button className="btn btn-outline-secondary btn-sm" disabled>
              Anterior
            </button>
            <span className="small">...</span>
            <button className="btn btn-outline-secondary btn-sm" disabled>
              Próxima
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="camp-scroll-inner" ref={scrollContainerRef}>
        <h1 className="mb-4">All Campgrounds</h1>
        <div className="map-card mb-4">
          <MapboxMap
            geoJson={geoJson}
            center={[-98.583333, 39.833333]} // US center (previous default)
            zoom={3}
            // Allow auto fit to markers to restore the original globe movement
            fitToBounds={true}
            // Evitar que o mapa capture o gesto de scroll em telas pequenas
            disableInteractionOnMobile={true}
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
                  <p className="card-text">
                    {(() => {
                      const ts = deriveTimestampFromId(
                        campground._id,
                        campground.createdAt
                      );
                      return ts ? (
                        <small
                          className="text-muted"
                          title={new Date(ts).toLocaleString()}
                        >
                          {timeAgo(ts, now)}
                        </small>
                      ) : null;
                    })()}
                  </p>
                  <Link
                    to={`/campgrounds/${campground._id}?from=${pageFromUrl}`}
                    className="stretched-link"
                    aria-label={`Ver ${campground.title}`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination controls - desktop */}
        <nav
          className="d-flex justify-content-center mt-4"
          aria-label="Campgrounds pages"
        >
          <ul className="pagination">
            <li className={`page-item ${!meta.hasPrev ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => goToPage(meta.page - 1)}
                aria-label="Anterior"
              >
                &laquo;
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                Página {meta.page} de {meta.totalPages}
              </span>
            </li>
            <li className={`page-item ${!meta.hasNext ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => goToPage(meta.page + 1)}
                aria-label="Próxima"
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile pager fixo - fora do scroll, acima do footer */}
      <div className="d-md-none mobile-pager-fixed">
        <div className="container d-flex justify-content-between align-items-center">
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={!meta.hasPrev}
            onClick={() => goToPage(meta.page - 1)}
          >
            Anterior
          </button>
          <span className="small">
            {meta.page}/{meta.totalPages}
          </span>
          <button
            className="btn btn-outline-secondary btn-sm"
            disabled={!meta.hasNext}
            onClick={() => goToPage(meta.page + 1)}
          >
            Próxima
          </button>
        </div>
      </div>
    </>
  );
};

export default CampgroundIndex;
