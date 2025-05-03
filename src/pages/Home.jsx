import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import CountryList from '../components/CountryList';
import '../styles/Home.css';

const Home = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="home-page">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">Countries Explorer</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              {currentUser ? (
                <>
                  <Navbar.Text className="me-3">
                    Signed in as: <strong>{currentUser.email}</strong>
                  </Navbar.Text>
                  <Nav.Item className="me-3">
                    <Link to="/profile" className="nav-link text-light">
                      My Profile
                    </Link>
                  </Nav.Item>
                  <Button variant="outline-light" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Item className="me-3">
                    <Link to="/login" className="nav-link text-light">
                      Login
                    </Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <CountryList />
      </Container>
    </div>
  );
};

export default Home;
