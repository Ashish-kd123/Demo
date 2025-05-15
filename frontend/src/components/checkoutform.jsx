import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "../api/axio";

const CheckoutForm = ({ planId }) => {
   
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  if (!stripe || !elements) {
    setMessage("Stripe or Elements are not loaded.");
    setLoading(false);
    return;
  }

  const cardElement = elements.getElement(CardElement);
  const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
    type: "card",
    card: cardElement,
    billing_details: {
      name: "Test User",
    },
  });

  if (pmError) {
    setMessage(pmError.message);
    setLoading(false);
    return;
  }

  try {
    const res = await axios.post("/subscription/create", {
      plan_id: planId,
      payment_method_id: paymentMethod.id,
    });

    const { client_secret } = res.data.data;

    if (!client_secret) {
      setMessage("Client secret is missing.");
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(client_secret);

    if (result.error) {
      setMessage(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      setMessage("Subscription successful!");
      navigate("/subscription-details");
    }
  } catch (error) {
    console.error("Payment error:", error);
    setMessage("Something went wrong. Try again.");
  }

  setLoading(false);
};


  return (
   <div className="max-w-md mx-auto mt-12 bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Pay Here</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border p-4 rounded-md shadow-sm">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? "Processing…" : "Subscribe"}
        </button>

        {message && (
          <p className="text-center text-sm text-red-600 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
};



export default CheckoutForm;
