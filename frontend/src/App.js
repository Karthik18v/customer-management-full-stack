import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Homepage/HomePage";
import CustomerDetails from "./components/CustomerDetails/CustomerDetails";
import AddNewAddressForm from "./components/AddNewAddressForm/AddNewAddressForm";
import EditAddressForm from "./components/EditAddressForm/EditAddressForm";
import NewCustomerForm from "./components/NewCustomerForm/NewCustomerForm";
import "./App.css"; // Global styles

export default function App() {
  return (
    <Router>
      <nav
        className="navbar"
      >
        <a href="/" className="navbar-link">
          Customer Management
        </a>
        <a href="/newcustomer" className="navbar-link">
          Add New Customer
        </a>
      </nav>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />

          <Route
            path="/customers/:id/addresses/new"
            element={<AddNewAddressForm />}
          />
          <Route
            path="/customers/:id/addresses/:addressId/edit"
            element={<EditAddressForm />}
          />
          <Route path="/newcustomer" element={<NewCustomerForm />} />
        </Routes>
      </div>
    </Router>
  );
}
