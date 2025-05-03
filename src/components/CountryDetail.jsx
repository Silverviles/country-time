import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, ListGroup, Alert } from 'react-bootstrap';
import { getCountryByCode } from '../services/countryService';
import { useAuth } from '../context/AuthContext';
import { addToFavorites, removeFromFavorites, isCountryInFavorites } from '../services/favoriteService';
import '../styles/CountryDetail.css';

const CountryDetail = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteError, setFavoriteError] = useState(null);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(code);
        setCountry(data[0]); // API returns an array with one country
        setLoading(false);
      } catch (err) {
        console.error('Error fetching country details:', err);
        setError('Failed to load country details. Please try again later.');
        setLoading(false);
      }
    };

    if (code) {
      fetchCountryDetails();
    }
  }, [code]);

  // Check if country is in favorites when component loads or when country/user changes
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!currentUser || !country) return;

      try {
        setFavoriteLoading(true);
        const result = await isCountryInFavorites(currentUser.uid, country.cca3);
        setIsFavorite(result);
        setFavoriteLoading(false);
      } catch (err) {
        console.error('Error checking favorite status:', err);
        setFavoriteError('Failed to check favorite status.');
        setFavoriteLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [currentUser, country]);

  const toggleFavorite = async () => {
    if (!currentUser || !country) return;

    try {
      setFavoriteLoading(true);
      setFavoriteError(null);

      if (isFavorite) {
        await removeFromFavorites(currentUser.uid, country);
        setIsFavorite(false);
      } else {
        await addToFavorites(currentUser.uid, country);
        setIsFavorite(true);
      }

      setFavoriteLoading(false);
    } catch (err) {
      console.error('Error toggling favorite status:', err);
      setFavoriteError('Failed to update favorites. Please try again later.');
      setFavoriteLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Helper function to format languages object into a string
  const formatLanguages = (languages) => {
    if (!languages) return 'N/A';
    return Object.values(languages).join(', ');
  };

  // Helper function to format currencies object into a string
  const formatCurrencies = (currencies) => {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
      .map(currency => `${currency.name} (${currency.symbol || 'N/A'})`)
      .join(', ');
  };

  return (
    <Container className="country-detail-container my-5">
      <Button variant="outline-primary" onClick={handleGoBack} className="mb-4">
        &larr; Back
      </Button>

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {favoriteError && (
        <Alert variant="danger" className="mb-3">
          {favoriteError}
        </Alert>
      )}

      {!loading && !error && country && (
        <Card className="country-detail-card">
          <Row>
            <Col md={5}>
              <Card.Img 
                src={country.flags.svg || country.flags.png} 
                alt={`Flag of ${country.name.common}`}
                className="country-detail-flag"
              />
            </Col>
            <Col md={7}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <Card.Title as="h2">{country.name.common}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {country.name.official}
                    </Card.Subtitle>
                  </div>
                  {currentUser && (
                    <Button
                      variant={isFavorite ? "danger" : "outline-primary"}
                      onClick={toggleFavorite}
                      disabled={favoriteLoading}
                      className="favorite-button"
                    >
                      {favoriteLoading ? (
                        <Spinner animation="border" size="sm" />
                      ) : isFavorite ? (
                        "Remove from Favorites"
                      ) : (
                        "Add to Favorites"
                      )}
                    </Button>
                  )}
                </div>

                <Row className="mb-4">
                  <Col md={6}>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Population:</strong> {country.population.toLocaleString()}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Region:</strong> {country.region}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Subregion:</strong> {country.subregion || 'N/A'}
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={6}>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Languages:</strong> {formatLanguages(country.languages)}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Currencies:</strong> {formatCurrencies(country.currencies)}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Top Level Domain:</strong> {country.tld?.[0] || 'N/A'}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Area:</strong> {country.area.toLocaleString()} km²
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>

                {country.borders && country.borders.length > 0 && (
                  <div>
                    <h5>Border Countries:</h5>
                    <div className="border-countries">
                      {country.borders.map(border => (
                        <Button 
                          key={border} 
                          variant="outline-secondary" 
                          size="sm"
                          className="me-2 mb-2"
                          onClick={() => navigate(`/country/${border}`)}
                        >
                          {border}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Col>
          </Row>
        </Card>
      )}
    </Container>
  );
};

export default CountryDetail;
