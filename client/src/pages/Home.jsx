import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Apply original app's body-wide hero background only on Home route
  useEffect(() => {
    document.body.classList.add('home-hero');
    return () => {
      document.body.classList.remove('home-hero');
    };
  }, []);

  return (
    <div className="cover-container d-flex flex-column justify-content-center align-items-center text-center text-white">
      <div className="cover-inner">
        <h1 className="mb-4">JosePauloCamp</h1>
        <p className="lead">
          Bem-vindo ao JosePauloCamp! <br />
          Pule para o ar livre! <br />
          Compartilhe seus acampamentos favoritos com o mundo.
        </p>
        <p className="lead">
          <Link
            to="/campgrounds"
            className="btn btn-lg btn-light fw-bold border-white text-dark"
          >
            Visite os Acampamentos
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Home;
