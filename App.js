import { useState } from 'react';
import './App.css';

/*farmer*/
import Homepage from './components/FARMER/homepage/homepage';
import Loginpage from './components/FARMER/login/login';
import Register from './components/FARMER/register/register';

//distributor
import DistributorHomepage from './components/DISTRIBUTOR/homepage/homepage';
import DistributorLoginpage from './components/DISTRIBUTOR/login/login';
import DistributorRegister from './components/DISTRIBUTOR/register/register';

//retailor
import RetailorHomepage from './components/RETAILOR/homepage/homepage';
import RetailorLoginpage from './components/RETAILOR/login/login';
import RetailorRegister from './components/RETAILOR/register/register';

//consumer
import ConsumerHomepage from './components/CONSUMER/homepage/homepage';
import ConsumerLoginpage from './components/CONSUMER/login/login';
import ConsumerRegister from './components/CONSUMER/register/register';
import ProductJourneyPage from "./components/CONSUMER/homepage/ProductJourneyPage";
import WelcomePage from './components/WelcomePage/WelcomePage';
import TermsAndConditions from './components/WelcomePage/TermsAndConditions';



import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem("user")) || null;
  });

  const setLoginUser = (loggedInUser) => {
    setUser(loggedInUser);
    sessionStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path="/" element={<WelcomePage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          {/* farmer */}
          <Route
            path="/FARMER/homepage"
            element={sessionStorage.getItem("user") ? <Homepage user={user} setLoginUser={setLoginUser} /> : <Loginpage setLoginUser={setLoginUser} />
            }
          />
          <Route path="/FARMER/login" element={<Loginpage setLoginUser={setLoginUser} />} />
          <Route path="/FARMER/register" element={<Register />} />

          {/* Distributor Routes ... in D/Home-user={user} for passing name initial to dist.hompg*/}
          <Route path="/DISTRIBUTOR/homepage" element={user && user._id ? <DistributorHomepage user={user} setLoginUser={setLoginUser} /> : <DistributorLoginpage setLoginUser={setLoginUser} />} />
          <Route path="/DISTRIBUTOR/login" element={<DistributorLoginpage setLoginUser={setLoginUser} />} />
          <Route path="/DISTRIBUTOR/register" element={<DistributorRegister />} />

          {/* RETAILOR Routes */}
          <Route path="/RETAILOR/homepage" element={user && user._id ? <RetailorHomepage user={user} setLoginUser={setLoginUser} /> : <RetailorLoginpage setLoginUser={setLoginUser} />} />
          <Route path="/RETAILOR/login" element={<RetailorLoginpage setLoginUser={setLoginUser} />} />
          <Route path="/RETAILOR/register" element={<RetailorRegister />} />

          {/* CONSUMER Routes */}
          <Route path="/CONSUMER/homepage" element={user && user._id ? <ConsumerHomepage user={user} setLoginUser={setLoginUser} /> : <ConsumerLoginpage setLoginUser={setLoginUser} />} />
          <Route path="/CONSUMER/login" element={<ConsumerLoginpage setLoginUser={setLoginUser} />} />
          <Route path="/CONSUMER/register" element={<ConsumerRegister />} />
          <Route path="/CONSUMER/product-journey/:productId" element={<ProductJourneyPage />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;