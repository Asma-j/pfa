import React from 'react'
import { Navbar, Nav,NavDropdown,Image} from 'react-bootstrap';
import recrutementlogo from '../auth/img/image6.png'; 
import profile from '../auth/img/images.png'; 

const NavBar = () => {
  const handleLogout = () => {
    // Mettez ici votre logique de déconnexion
  };
  return (
  
    <Navbar bg="light" expand="lg" className='m-2' >
        <Navbar.Brand  >
          <img
            src={recrutementlogo} 
            width="30"
            height="30"
            alt="EmploiAnalytique Logo"
            
          />
         <small> EmploiAnalytique</small>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Accueil</Nav.Link>
          </Nav>
          <Nav style={{ marginLeft: 'auto' }}>
  <Nav.Link href="#profile">
    <Image src={profile}  roundedCircle style={{ width: '30px', height: '30px', marginRight: '10px' }} />
    Profil
  </Nav.Link>
  <NavDropdown title="Déconnexion" id="basic-nav-dropdown">
    <NavDropdown.Item onClick={handleLogout}>Déconnexion</NavDropdown.Item>
  </NavDropdown>
</Nav>

        </Navbar.Collapse>
      </Navbar>
  )
}

export default NavBar;
