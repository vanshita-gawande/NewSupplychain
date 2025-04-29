import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab } from "react-bootstrap";
import { motion } from "framer-motion";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./WelcomePage.css";
import { Card, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { AiOutlineCopyrightCircle } from "react-icons/ai";
import { FiMenu, FiX } from "react-icons/fi";

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const WelcomePage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rating, setRating] = useState(0); // New rating state
  const handleSelectOption = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleProceed = () => {
    if (selectedRole) {
      navigate(`/${selectedRole}/login`);
    }
  };

  useEffect(() => {
    document.body.classList.add("welcome-page");
    return () => {
      document.body.classList.remove("welcome-page");
    };
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false); // Close menu after clicking a link
    }
  };

  return (
    <div className="app">
      <div className="main-content">
        {/* Navbar */}
        <header>
          <Navbar expand="lg" className="navbarr">
            <Container fluid>
              {/* Brand Logo */}
              <Navbar.Brand href="/" className="brand">
                <span className="logo-text">ECO<span className="logo-highlight">TRACE</span></span>
                <p className="tagline">ORGANIC & BLOCKCHAIN TRANSPARENCY</p>
              </Navbar.Brand>

              {/* ✅ Hamburger Menu (Toggles on Click) */}
              <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
              </div>

              {/* ✅ Nav Links - Show when menuOpen is true */}
              <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                <Nav className="ms-auto">
                  <button className="nav-link" onClick={() => scrollToSection("home")}>HOME</button>
                  <button className="nav-link" onClick={() => scrollToSection("about")}>ABOUT</button>
                  <button className="nav-link" onClick={() => scrollToSection("services")}>SERVICES</button>
                  <button className="nav-link" onClick={() => scrollToSection("footer1")}>CONTACT</button>
                </Nav>
              </div>
            </Container>
          </Navbar>
        </header>
        {/* Main Section */}
        <section id="home">
          <div className="background-image-container">
            <h1 className="title">WELCOME TO OUR PLATFORM</h1>
            <div className="select-container">
              <select id="selectOption" onChange={handleSelectOption} className="form-select">
                <option value="">Select Role</option>
                <option value="FARMER">Farmer</option>
                <option value="distributor">Distributor</option>
                <option value="retailor">Retailor</option>
                <option value="consumer">Consumer</option>
              </select>
              <button onClick={handleProceed} className="welcomebtn">Go</button>
            </div>
          </div>
        </section>


        {/* about us section */}
        <section id="about">
          <h2 className="about-heading custom-font">
            <span className="black">ABOUT</span> <span className="green">US</span>
          </h2>

          <Tabs defaultActiveKey="mission" id="about-tabs" className="mb-3 about-tabs">

            {/* ✅ Mission Tab */}
            <Tab eventKey="mission" title="Mission">
              <motion.div initial="hidden" animate="visible" exit="hidden" variants={tabVariants}>
                <h3>Our Mission</h3>
                <p className="welcomepara">
                  We are committed to creating a lasting impact through innovative solutions that drive meaningful change.
                  Our goal is to revolutionize the organic agriculture sector by integrating technology for transparency,
                  sustainability, and efficiency. By empowering farmers, businesses, and consumers, we pave the way for a healthier planet.
                </p>
                <ul className="custom-list">
                  <li><i className="fa fa-check green-icon"></i> Enhancing organic farming practices</li>
                  <li><i className="fa fa-check green-icon"></i> Providing complete supply chain transparency</li>
                  <li><i className="fa fa-check green-icon"></i> Empowering consumers to make informed choices</li>
                </ul>
              </motion.div>
            </Tab>

            {/* ✅ Vision Tab */}
            <Tab eventKey="vision" title="Vision">
              <motion.div initial="hidden" animate="visible" exit="hidden" variants={tabVariants}>
                <h3>Our Vision</h3>
                <p className="welcomepara">
                  To be the leading platform in the organic agriculture industry, ensuring ethical sourcing, sustainable farming,
                  and full transparency using blockchain technology. We envision a world where every product tells its story from farm to table.
                </p>
                <blockquote>
                  "Sustainability is not a trend; it's a responsibility. We aim to make organic farming the standard, not the exception."
                </blockquote>
              </motion.div>
            </Tab>

            {/* ✅ Why Organic Tab */}
            <Tab eventKey="organic" title="Why Organic?">
              <motion.div initial="hidden" animate="visible" exit="hidden" variants={tabVariants}>
                <h3>Why Use Organic Products?</h3>
                <p className="welcomepara">
                  Organic products are free from harmful chemicals and promote better health and environmental sustainability.
                  Choosing organic means supporting farmers who use eco-friendly methods and ensuring food safety.
                </p>
                <h4 id="benefits">Key Benefits:</h4>
                <ul className="custom-list">
                  <li><i className="fa fa-check green-icon"></i> Healthier and free from pesticides</li>
                  <li><i className="fa fa-check green-icon"></i>  sustainable agriculture and protects nature.</li>
                  <li><i className="fa fa-check green-icon"></i> Supports ethical and sustainable farming</li>
                </ul>
              </motion.div>
            </Tab>

            {/* ✅ Core Values Tab */}
            <Tab eventKey="values" title="Core Values">
              <motion.div initial="hidden" animate="visible" exit="hidden" variants={tabVariants}>
                <h3>Our Core Values</h3>
                <p className="welcomepara">At EcoTrace, our values drive everything we do. We are committed to:</p>
                <ul className="custom-list">
                  <li><i className="fa fa-check green-icon"></i> <strong>Sustainability:</strong> Promoting eco-friendly agricultural practices.</li>
                  <li><i className="fa fa-check green-icon"></i> <strong>Transparency:</strong> Leveraging blockchain for complete traceability.</li>
                  <li><i className="fa fa-check green-icon"></i> <strong>Innovation:</strong> Continuously improving through technology.</li>
                  <li><i className="fa fa-check green-icon"></i> <strong>Community:</strong> Supporting farmers, businesses, and consumers.</li>
                </ul>
              </motion.div>
            </Tab>
          </Tabs>
        </section>
        {/* videoo */}
        <section id="value-proposition" className="value-proposition-section white-background">
          <Container>
            <h2 className="value-proposition-heading custom-font">
              <span className="black">Our</span> <span className="green">Unique</span> <span className="black">Advantage</span>
            </h2>
            <p className="value-proposition-description">
              EcoTrace enables seamless and transparent transactions in organic agriculture. Our blockchain-powered platform ensures trust, traceability, and efficiency across the entire supply chain.
            </p>

            {/* Video Section */}
            <div className="video-wrapper">
              <video autoPlay muted loop playsInline>
                <source src="/Farmervideo.mp4" type="video/mp4" />
              </video>
            </div>
          </Container>
        </section>
        {/*  */}
        {/* our services */}
        <section id="services" className="use-cases-section">
          <Container>
            <h2 className="use-cases-heading">Real-Life Applications</h2>
            <p className="use-cases-description">
              See how EcoTrace is transforming the organic agriculture industry through blockchain-based transparency.
            </p>
            <Row className="justify-content-center">
              <Col md={3}>
                <Card className="use-case-card">
                  <Card.Body className="text-center">
                    <div className="icon-container">🔍</div>
                    <Card.Title>Traceability in Organic Farming</Card.Title>
                    <Card.Text>
                      Farmers and suppliers can track every stage of organic produce, ensuring compliance with certification standards and reducing fraud in the supply chain.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="use-case-card">
                  <Card.Body className="text-center">
                    <div className="icon-container">📦</div>
                    <Card.Title>Smart Logistics & Distribution</Card.Title>
                    <Card.Text>
                      Distributors leverage blockchain to track shipments, detect bottlenecks, and ensure faster, transparent delivery of organic goods from farms to retailers.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="use-case-card">
                  <Card.Body className="text-center">
                    <div className="icon-container">🌱</div>
                    <Card.Title>Sustainable Farming Practices</Card.Title>
                    <Card.Text>
                      EcoTrace provides data-driven insights to help farmers adopt eco-friendly methods, reduce chemical usage, and enhance soil health.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="use-case-card">
                  <Card.Body className="text-center">
                    <div className="icon-container">📊</div>
                    <Card.Title>Data Analytics for Market Trends</Card.Title>
                    <Card.Text>
                      Retailers and farmers can analyze demand patterns, pricing trends, and seasonal variations to optimize production and sales strategies.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
        {/* Footer */}
        <section id="footer1">
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-top">
                <div className="footer-section">
                  <h3>Eco Trace</h3>
                  <p>Revolutionizing Organic Agriculture with Blockchain Transparency.</p>
                </div>
                <div className="footer-section">
                  <h3>Support</h3>
                  <p><a href="#" onClick={() => setShowContactForm(true)}>Contact Us</a></p>
                  <p><a href="#" onClick={() => setShowFeedbackForm(true)}>Feedback</a></p>
                </div>
                <div className="footer-section">
                  <h3>Legal</h3>
                  <p><a href="#" onClick={() => setShowPrivacy(true)}>Privacy Policy</a></p>
                  <p><a href="#" onClick={() => setShowImage(true)}>Terms & Conditions</a></p>
                </div>
                <div className="footer-section">
                  <h3>Follow Us</h3>
                  <div className="footer-social">
                    <a href="https://facebook.com"><FaFacebookF /></a>
                    <a href="https://twitter.com"><FaTwitter /></a>
                    <a href="https://instagram.com"><FaInstagram /></a>
                    <a href="https://linkedin.com"><FaLinkedinIn /></a>
                    <a href="https://github.com"><FaGithub /></a>
                  </div>
                </div>
              </div>
              <div className="footer-bottom">
                <AiOutlineCopyrightCircle />
                <span> 2025 Eco Trace. All Rights Reserved.</span>
              </div>
            </div>

            {/* Terms & Conditions Popup */}
            {showImage && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <button className="close-btn" onClick={() => setShowImage(false)}>✖</button>
                  <img src="/terms.jpg" alt="Terms" className="popup-image" />
                </div>
              </div>
            )}

            {/* Privacy Policy Popup */}
            {showPrivacy && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <button className="close-btn" onClick={() => setShowPrivacy(false)}>✖</button>
                  <img src="/privacyy.jpg" alt="Privacy Policy" className="popup-image" />
                </div>
              </div>
            )}

            {/* Contact Form Popup */}
            {showContactForm && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <button className="close-btn" onClick={() => setShowContactForm(false)}>✖</button>
                  <h4 id="heading">Contact Us</h4>
                  <form action="https://formsubmit.co/vanshitapatil01@gmail.com" method="POST">
                    <input type="hidden" name="_cc" value="kateyisha28@gmail.com" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_auto-response" value="Thank you! Your message has been submitted successfully." />

                    <input type="text" name="name" placeholder="Your Name" required className="form-input" />
                    <input type="email" name="email" placeholder="Your Email" required className="form-input" />
                    <textarea name="message" placeholder="Your Message" required className="form-textarea"></textarea>

                    <button type="submitt" className="form-button">Send</button>
                  </form>
                </div>
              </div>
            )}

            {/* Feedback Form Popup */}
            {showFeedbackForm && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <button className="close-btn" onClick={() => setShowFeedbackForm(false)}>✖</button>
                  <h4 id="heading">Give Us Your Feedback</h4>
                  <form action="https://formsubmit.co/vanshitapatil01@gmail.com" method="POST">
                    <input type="hidden" name="_cc" value="kateyisha28@gmail.com" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_auto-response" value="Thank you for your feedback!" />
                    <input type="hidden" name="_subject" value="New Feedback Received" />
                    <input type="text" name="name" placeholder="Your Name" required className="form-input" />
                    <input type="email" name="email" placeholder="Your Email" required className="form-input" />

                    {/* Feedback Type Dropdown */}
                    <select name="feedbackType" required className="form-input">
                      <option value="">Select Feedback Type</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Suggestion">Feature Suggestion</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>

                    {/* Star Rating System */}
                    <div className="rating-container">
                      <label>Rate Us:</label>
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => setRating(star)}
                            className={`star ${star <= rating ? "active" : ""}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <input type="hidden" name="rating" value={rating} />
                    </div>

                    <textarea name="feedback" placeholder="Your Feedback" required className="form-textarea"></textarea>
                    <button type="submit" className="form-button">Submit Feedback</button>
                  </form>
                </div>
              </div>
            )}
          </footer>
        </section>
      </div>
    </div>
  );
};

export default WelcomePage;
