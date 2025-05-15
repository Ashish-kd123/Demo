import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignupForm from './components/Signup';
import LoginForm from './components/loginform';
import SubscriptionPage from './components/Subscriptionpage';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SubscriptionDetails from './components/SubscriptionDetails';

const stripePromise = loadStripe("pk_test_51RLikwKv9VCxS7mFHN92WAswa8PrMSOYPHpNcQ01jYhjjSLYIiVC3npfSsoWNVrchpwknIIsKHB4EvpItkRK82gh00jPAQjD2R");

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/subscription-details" element={<SubscriptionDetails />} />

        <Route
          path="/subscribe"
          element={
            <Elements stripe={stripePromise}>
              <SubscriptionPage />
            </Elements>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
