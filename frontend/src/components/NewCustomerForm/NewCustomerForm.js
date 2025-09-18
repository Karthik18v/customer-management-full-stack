import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewCustomerForm.css"; // Import CSS

export default function NewCustomerForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    addresses: [{ street: "", city: "", state: "", pincode: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["street", "city", "state", "pincode"].includes(name)) {
      setFormData({
        ...formData,
        addresses: [{ ...formData.addresses[0], [name]: value }],
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3000/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/"); // Redirect after success
        } else {
          alert("Failed to add customer");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="new-customer-page">
      <div className="new-customer-card">
        <h2>Add New Customer</h2>

        <form onSubmit={handleSubmit}>
          {[
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Phone", name: "phone", type: "tel" },
            { label: "Email", name: "email", type: "email" },
            { label: "Street", name: "street", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "State", name: "state", type: "text" },
            { label: "Pincode", name: "pincode", type: "text" },
          ].map((field) => (
            <div className="form-group" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={
                  ["street", "city", "state", "pincode"].includes(field.name)
                    ? formData.addresses[0][field.name]
                    : formData[field.name]
                }
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button type="submit" className="btn submit-btn">
            ➕ Add Customer
          </button>
        </form>
      </div>
    </div>
  );
}
