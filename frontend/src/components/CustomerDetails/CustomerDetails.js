import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./CustomerDetails.css";

export default function CustomerDetails() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const fetchCustomerDetails = async () => {
    try {
      const apiUrl = `http://localhost:3000/customers/${id}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  useEffect(() => {
    if (id) fetchCustomerDetails();
  }, [id]);

  const handleDeleteAddress = async (addressId) => {
    const confirmDelete = window.confirm("Delete this address?");
    if (!confirmDelete) return;

    try {
      await fetch(
        `http://localhost:3000/customers/${id}/addresses/${addressId}`,
        {
          method: "DELETE",
        }
      );

      setUserData((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((addr) => addr._id !== addressId),
      }));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleEditAddress = (addressId) => {
    navigate(`/customers/${id}/addresses/${addressId}/edit`);
  };

  const handleAddNewAddress = () => {
    navigate(`/customers/${id}/addresses/new`);
  };

  if (!userData) {
    return (
      <div className="page">
        <p className="loading">Loading customer details...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="title">Customer Details</h2>

      <button className="btn success" onClick={handleAddNewAddress}>
        + Add Address
      </button>

      <div className="card">
        <h3 className="section-title">Personal Info</h3>
        <p>
          <strong>First Name:</strong> {userData.firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {userData.lastName}
        </p>
        <p>
          <strong>Phone:</strong> {userData.phone}
        </p>

        <h3 className="section-title">Addresses</h3>
        {userData.addresses.length === 0 ? (
          <p className="empty">No addresses found.</p>
        ) : (
          userData.addresses.map((address) => (
            <div key={address._id} className="address-card">
              <div>
                <p>
                  <strong>Street:</strong> {address.street}
                </p>
                <p>
                  <strong>City:</strong> {address.city}
                </p>
                <p>
                  <strong>State:</strong> {address.state}
                </p>
                <p>
                  <strong>PinCode:</strong> {address.pincode}
                </p>
              </div>
              <div className="address-actions">
                <button
                  className="btn warning"
                  onClick={() => handleEditAddress(address._id)}
                >
                  Edit
                </button>
                <button
                  className="btn danger"
                  onClick={() => handleDeleteAddress(address._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        <Link to="/" className="btn primary back-btn">
          ← Back to Customers
        </Link>
      </div>
    </div>
  );
}
