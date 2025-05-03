import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Dropdown, Button, Spinner } from 'react-bootstrap';
import { getAllCountries, getCountryByName, getCountriesByRegion } from '../services/countryService';
import { Link } from 'react-router-dom';
import '../styles/CountryList.css';

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch countries. Please try again later.');
        console.error('Error fetching countries:', err);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Handle search input change
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      // If search is cleared, show all countries or filtered by region
      if (selectedRegion) {
        const regionFiltered = countries.filter(country => 
          country.region.toLowerCase() === selectedRegion.toLowerCase()
        );
        setFilteredCountries(regionFiltered);
      } else {
        setFilteredCountries(countries);
      }
      return;
    }

    try {
      // If search term is provided, search by name
      if (value.length > 1) {
        const results = await getCountryByName(value);

        // Apply region filter if selected
        if (selectedRegion) {
          const filtered = results.filter(country => 
            country.region.toLowerCase() === selectedRegion.toLowerCase()
          );
          setFilteredCountries(filtered);
        } else {
          setFilteredCountries(results);
        }
      }
    } catch (error) {
      console.error('Error searching countries:', error);
      // If search fails, show no results
      setFilteredCountries([]);
    }
  };

  // Handle region filter selection
  const handleRegionSelect = async (region) => {
    setSelectedRegion(region);

    try {
      setLoading(true);

      if (region === '') {
        // If 'All Regions' is selected
        if (searchTerm) {
          // If there's a search term, filter by that
          const results = await getCountryByName(searchTerm);
          setFilteredCountries(results);
        } else {
          // Otherwise show all countries
          setFilteredCountries(countries);
        }
      } else {
        // Filter by selected region
        const regionCountries = await getCountriesByRegion(region);

        // Apply search filter if there's a search term
        if (searchTerm) {
          const filtered = regionCountries.filter(country => 
            country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredCountries(filtered);
        } else {
          setFilteredCountries(regionCountries);
        }
      }
    } catch (error) {
      console.error('Error filtering by region:', error);
      setError('Failed to filter countries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setFilteredCountries(countries);
  };

  return (
    <Container className="country-list-container">
      <h1 className="text-center my-4">Explore Countries</h1>

      {/* Search and Filter Section */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search for a country..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-region">
              {selectedRegion || 'Filter by Region'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleRegionSelect('')}>All Regions</Dropdown.Item>
              <Dropdown.Item onClick={() => handleRegionSelect('Africa')}>Africa</Dropdown.Item>
              <Dropdown.Item onClick={() => handleRegionSelect('Americas')}>Americas</Dropdown.Item>
              <Dropdown.Item onClick={() => handleRegionSelect('Asia')}>Asia</Dropdown.Item>
              <Dropdown.Item onClick={() => handleRegionSelect('Europe')}>Europe</Dropdown.Item>
              <Dropdown.Item onClick={() => handleRegionSelect('Oceania')}>Oceania</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={2}>
          <Button variant="secondary" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Col>
      </Row>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Countries Grid */}
      {!loading && !error && (
        <>
          <p className="mb-3">Showing {filteredCountries.length} countries</p>
          <Row>
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <Col key={country.cca3} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card className="country-card h-100">
                    <Card.Img 
                      variant="top" 
                      src={country.flags.png} 
                      alt={`Flag of ${country.name.common}`}
                      className="country-flag"
                    />
                    <Card.Body>
                      <Card.Title>{country.name.common}</Card.Title>
                      <Card.Text>
                        <strong>Population:</strong> {country.population.toLocaleString()}<br />
                        <strong>Region:</strong> {country.region}<br />
                        <strong>Capital:</strong> {country.capital?.[0] || 'N/A'}
                      </Card.Text>
                      <Link to={`/country/${country.cca3}`} className="btn btn-primary">
                        View Details
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <p className="text-center">No countries found matching your criteria.</p>
              </Col>
            )}
          </Row>
        </>
      )}
    </Container>
  );
};

export default CountryList;
