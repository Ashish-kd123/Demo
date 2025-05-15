import React, { useState, useEffect } from "react";
import axios from "../api/axio";
import CheckoutForm from "./checkoutform";

const SubscriptionPage = () => {
  const [Plans, setPlans] = useState([]); 
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("/subscription/plan");
         console.log("API Response:", res.data);
        if (Array.isArray(res.data.data)) {
          setPlans(res.data.data);
        } else {
          setError("Error: Plans data is not an array.");
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        setError("Error fetching plans.");
      } finally {
        setLoading(false); 
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
  };

  if (loading) {
    return <div>Loading plans...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6">
      {!selectedPlanId ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Plans.map((Plans) => (
            <div key={Plans.id} className="border p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{Plans.name}</h3>
              <p className="mb-4">{Plans.description}</p>
              <p className="mb-4 font-bold">${Plans.price}/month</p>
              <button
                onClick={() => handleSelectPlan(Plans.id)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Select {Plans.name}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <CheckoutForm planId={selectedPlanId} />
      )}
    </div>
  );
};

export default SubscriptionPage;
