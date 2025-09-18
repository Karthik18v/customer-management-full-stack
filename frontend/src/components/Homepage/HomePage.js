import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // we'll create this file

export default function HomePage() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const apiUrl = "http://localhost:3000/customers";
        const response = await fetch(apiUrl);
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="homepage">
      <div className="container">
        <h1>Customer Management System</h1>
        <h2>Customer List</h2>

        {customers.length === 0 ? (
          <p className="empty">No customers found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer._id}>
                    <td>{customer.firstName}</td>
                    <td>{customer.lastName}</td>
                    <td>{customer.phone}</td>
                    <td>
                      <Link to={`/customers/${customer._id}`} className="btn">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
