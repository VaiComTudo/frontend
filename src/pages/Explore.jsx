import { useState } from "react";
import axios from "axios";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import { useUser } from "../context/UserContext";

function Explore() {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    pickUpLocation: "",
    dropOffLocation: "",
    vehicleType: "",
    vehicleCondition: "GOOD",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("No user logged in");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const listingData = {
        owner: {
          id: user.id,
        },
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        state: "AVAILABLE",
        vehicle: {
          type: formData.vehicleType,
          condition: formData.vehicleCondition,
        },
        pickUpLocation: formData.pickUpLocation,
        dropOffLocation: formData.dropOffLocation,
        availability: [],
        photos: [],
      };

      console.log(listingData)

      const response = await axios.post(
        `http://localhost:8080/api/v1/owners/${user.id}/listings`,
        listingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Listing created:", response.data);
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        pickUpLocation: "",
        dropOffLocation: "",
        vehicleType: "",
        vehicleCondition: "GOOD",
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Error creating listing:", err);
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
    setSuccess(false);
  };

  return (
    <>
      <NavBar />

      <main style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px" }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Add New Listing
        </button>

        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={handleCloseModal}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                maxWidth: "500px",
                width: "90%",
                maxHeight: "90vh",
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginTop: 0 }}>Create New Listing</h2>

              {success && (
                <div style={{ padding: "10px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "5px", marginBottom: "15px" }}>
                  Listing created successfully!
                </div>
              )}

              {error && (
                <div style={{ padding: "10px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "5px", marginBottom: "15px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Price (€) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Vehicle Type *
                  </label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Car, Bike, Scooter"
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Vehicle Condition *
                  </label>
                  <select
                    name="vehicleCondition"
                    value={formData.vehicleCondition}
                    onChange={handleInputChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  >
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="NEEDS_WORK">Needs Work</option>
                    <option value="POOR">Poor</option>
                  </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Pick-up Location *
                  </label>
                  <input
                    type="text"
                    name="pickUpLocation"
                    value={formData.pickUpLocation}
                    onChange={handleInputChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    Drop-off Location *
                  </label>
                  <input
                    type="text"
                    name="dropOffLocation"
                    value={formData.dropOffLocation}
                    onChange={handleInputChange}
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      padding: "10px 20px",
                      cursor: "pointer",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: "10px 20px",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      backgroundColor: isSubmitting ? "#6c757d" : "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                    }}
                  >
                    {isSubmitting ? "Creating..." : "Create Listing"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Explore;