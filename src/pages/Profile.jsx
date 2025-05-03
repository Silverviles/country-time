import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getUserFavorites, removeFromFavorites } from '../services/favoriteService';
import {Link, useNavigate} from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const userFavorites = await getUserFavorites(currentUser.uid);
        setFavorites(userFavorites);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Failed to load favorites. Please try again later.');
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  const handleRemoveFromFavorites = async (country) => {
    try {
      await removeFromFavorites(currentUser.uid, country);
      // Update the local state to reflect the change
      setFavorites(favorites.filter(fav => fav.cca3 !== country.cca3));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Failed to remove from favorites. Please try again later.');
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <Container className="profile-container my-5">
      <div className="d-flex align-items-center mb-4">
        <Button variant="outline-primary" onClick={handleGoBack} className="mb-4">
          &larr; Back
        </Button>
        <h1 className="text-center mb-0 flex-grow-1">User Profile</h1>
      </div>

      {currentUser && (
        <Card className="mb-4 profile-card">
          <Card.Body>
            <Card.Title>User Information</Card.Title>
            <Card.Text>
              <strong>Email:</strong> {currentUser.email}
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      <h2 className="mb-3">My Favorite Countries</h2>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      {!loading && !error && (
        <Row>
          {favorites.length > 0 ? (
            favorites.map((country) => (
              <Col key={country.cca3} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="h-100 favorite-card">
                  <Card.Img 
                    variant="top" 
                    src={country.flags.png} 
                    alt={`Flag of ${country.name.common}`}
                    className="favorite-flag"
                  />
                  <Card.Body>
                    <Card.Title>{country.name.common}</Card.Title>
                    <Card.Text>
                      <strong>Region:</strong> {country.region}<br />
                      <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
                    </Card.Text>
                    <div className="d-flex justify-content-between gap-2">
                      <Link to={`/country/${country.cca3}`} className="btn btn-primary">
                        View Details
                      </Link>
                      <Button 
                        variant="outline-danger" 
                        onClick={() => handleRemoveFromFavorites(country)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <Alert variant="info">
                You haven't added any countries to your favorites yet. 
                Browse countries and click the "Add to Favorites" button to add them here.
              </Alert>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Profile;
