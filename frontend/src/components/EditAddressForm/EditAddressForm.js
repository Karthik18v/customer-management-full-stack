import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditAddressForm.css"; // Import CSS

export default function EditAddressForm() {
  const { id, addressId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(`http://localhost:3000/customers/${id}`);
        const data = await response.json();
        const address = data.addresses.find((addr) => addr._id === addressId);
        if (address) {
          setFormData({
            street: address.street,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching address:", error);
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, [id, addressId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/customers/${id}/addresses/${addressId}/edit`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("Failed to update address");

      await response.json();
      navigate(`/customers/${id}`);
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading address details...</div>;
  }

  return (
    <div className="edit-address-page">
      <div className="edit-address-card">
        <h2>✏️ Edit Address</h2>

        <form onSubmit={handleSubmit}>
          {["street", "city", "state", "pincode"].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button type="submit" className="btn save-btn">
            💾 Save Changes
          </button>
        </form>

        <button
          onClick={() => navigate(`/customers/${id}`)}
          className="btn back-btn"
        >
          ⬅ Back to Customer Details
        </button>
      </div>
    </div>
  );
}
