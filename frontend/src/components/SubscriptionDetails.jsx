import React, { useEffect, useState } from "react";
import axios from "../api/axio";
import { useNavigate } from "react-router-dom";

const SubscriptionDetails = () => {
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [newPlanId, setNewPlanId] = useState("");
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subRes = await axios.get("/subscription/user");
        const plansRes = await axios.get("/subscription/plan");

        if (subRes.data.data) {
          setSubscription(subRes.data.data);
        } else {
          setError("No subscription data found.");
        }

        if (plansRes.data.data) {
          setPlans(plansRes.data.data);
        } else {
          setError("No plans found.");
        }
      } catch (err) {
        console.error("Error fetching subscription data:", err);
        setError("Failed to load subscription data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPlanName = (planId) => {
    const plan = plans.find((p) => p.id === planId);
    return plan ? plan.name : planId;
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await axios.delete(`/subscription/cancel/${subscription.id}`);
      alert("Subscription cancelled.");
      navigate("/subscribe");
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Error cancelling subscription.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!newPlanId) return alert("Please select a plan");

    setLoading(true);
    try {
      await axios.put(`/subscription/update/usersubscription/${subscription.id}`, {
  new_plan_id: newPlanId,
});
      alert("Plan updated!");
      window.location.reload();
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating subscription.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading subscription...</p>;

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Subscription</h2>

      <div className="space-y-2">
        <p><strong>Plan:</strong> {getPlanName(subscription.plan_id)}</p>
        <p><strong>Status:</strong> {subscription.status}</p>
        <p><strong>Start Date:</strong> {new Date(subscription.started_at).toLocaleDateString()}</p>
      </div>

      <button
        onClick={handleCancel}
        disabled={loading}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Cancel Subscription
      </button>

      <div className="mt-6">
        <label className="block mb-2 font-semibold">Update to another plan:</label>
        <select
          value={newPlanId}
          onChange={(e) => setNewPlanId(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Plan</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} - ${plan.price}
            </option>
          ))}
        </select>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Update Plan
        </button>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
