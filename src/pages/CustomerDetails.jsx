import { useEffect, useState } from "react";
import {
    getCustomerDetails,
    updateCustomerDetails,
} from "../services/customerService";

function CustomerDetails() {

    const [formData, setFormData] = useState({
        phoneNumber: "",
        address: {
            houseNo: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
        },
        deliveryPreference: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadCustomerDetails();
    }, []);

    const loadCustomerDetails = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getCustomerDetails();

            if (data && Object.keys(data).length > 0) {

                setFormData({
                    phoneNumber: data.phoneNumber || "",

                    address: {
                        houseNo: data.address?.houseNo || "",
                        street: data.address?.street || "",
                        city: data.address?.city || "",
                        state: data.address?.state || "",
                        pincode: data.address?.pincode || "",
                        country: data.address?.country || "",
                    },

                    deliveryPreference:
                        data.deliveryPreference || "",
                });
            }

        } catch (err) {

            console.error(
                "Customer details error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load customer details."
            );

        } finally {

            setLoading(false);
        }
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,

            address: {
                ...previous.address,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {

            const updatedData =
                await updateCustomerDetails(formData);

            setFormData({
                phoneNumber:
                    updatedData.phoneNumber || "",

                address: {
                    houseNo:
                        updatedData.address?.houseNo || "",
                    street:
                        updatedData.address?.street || "",
                    city:
                        updatedData.address?.city || "",
                    state:
                        updatedData.address?.state || "",
                    pincode:
                        updatedData.address?.pincode || "",
                    country:
                        updatedData.address?.country || "",
                },

                deliveryPreference:
                    updatedData.deliveryPreference || "",
            });

            setSuccess(
                "Customer details updated successfully!"
            );

        } catch (err) {

            console.error(
                "Update customer details error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to update customer details."
            );

        } finally {

            setSaving(false);
        }
    };

    if (loading) {

        return (
            <div className="customer-loading">

                <div className="customer-spinner"></div>

                <p>
                    Loading your details...
                </p>

            </div>
        );
    }

    return (
        <div className="customer-page">

            <div className="customer-header">

                <div>
                    <h1>👤 My Details</h1>

                    <p>
                        Manage your contact and delivery information
                    </p>
                </div>

            </div>

            {error && (
                <div className="customer-alert customer-alert-error">
                    ⚠️ {error}
                </div>
            )}

            {success && (
                <div className="customer-alert customer-alert-success">
                    ✅ {success}
                </div>
            )}

            <form
                className="customer-form"
                onSubmit={handleSubmit}
            >

                {/* Contact Information */}

                <section className="customer-section">

                    <div className="customer-section-title">

                        <span className="customer-section-icon">
                            📱
                        </span>

                        <div>
                            <h2>Contact Information</h2>

                            <p>
                                Your contact details for orders and delivery
                            </p>
                        </div>

                    </div>

                    <div className="customer-form-group">

                        <label htmlFor="phoneNumber">
                            Phone Number
                        </label>

                        <input
                            id="phoneNumber"
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter 10-digit phone number"
                            maxLength="10"
                            required
                        />

                    </div>

                </section>


                {/* Address */}

                <section className="customer-section">

                    <div className="customer-section-title">

                        <span className="customer-section-icon">
                            🏠
                        </span>

                        <div>
                            <h2>Delivery Address</h2>

                            <p>
                                Where should your books be delivered?
                            </p>
                        </div>

                    </div>


                    <div className="customer-form-grid">

                        <div className="customer-form-group">

                            <label htmlFor="houseNo">
                                House / Flat No.
                            </label>

                            <input
                                id="houseNo"
                                type="text"
                                name="houseNo"
                                value={
                                    formData.address.houseNo
                                }
                                onChange={handleAddressChange}
                                placeholder="e.g. A-101"
                                required
                            />

                        </div>


                        <div className="customer-form-group">

                            <label htmlFor="street">
                                Street
                            </label>

                            <input
                                id="street"
                                type="text"
                                name="street"
                                value={
                                    formData.address.street
                                }
                                onChange={handleAddressChange}
                                placeholder="Street / Area"
                                required
                            />

                        </div>


                        <div className="customer-form-group">

                            <label htmlFor="city">
                                City
                            </label>

                            <input
                                id="city"
                                type="text"
                                name="city"
                                value={
                                    formData.address.city
                                }
                                onChange={handleAddressChange}
                                placeholder="City"
                                required
                            />

                        </div>


                        <div className="customer-form-group">

                            <label htmlFor="state">
                                State
                            </label>

                            <input
                                id="state"
                                type="text"
                                name="state"
                                value={
                                    formData.address.state
                                }
                                onChange={handleAddressChange}
                                placeholder="State"
                                required
                            />

                        </div>


                        <div className="customer-form-group">

                            <label htmlFor="pincode">
                                Pincode
                            </label>

                            <input
                                id="pincode"
                                type="text"
                                name="pincode"
                                value={
                                    formData.address.pincode
                                }
                                onChange={handleAddressChange}
                                placeholder="6-digit pincode"
                                maxLength="6"
                                required
                            />

                        </div>


                        <div className="customer-form-group">

                            <label htmlFor="country">
                                Country
                            </label>

                            <input
                                id="country"
                                type="text"
                                name="country"
                                value={
                                    formData.address.country
                                }
                                onChange={handleAddressChange}
                                placeholder="Country"
                                required
                            />

                        </div>

                    </div>

                </section>


                {/* Delivery Preference */}

                <section className="customer-section">

                    <div className="customer-section-title">

                        <span className="customer-section-icon">
                            🚚
                        </span>

                        <div>
                            <h2>Delivery Preference</h2>

                            <p>
                                Choose how you prefer your books to be delivered
                            </p>
                        </div>

                    </div>


                    <div className="customer-delivery-options">

                        <label className="delivery-option">

                            <input
                                type="radio"
                                name="deliveryPreference"
                                value="Home Delivery"
                                checked={
                                    formData.deliveryPreference ===
                                    "Home Delivery"
                                }
                                onChange={handleChange}
                            />

                            <div>

                                <strong>
                                    🏠 Home Delivery
                                </strong>

                                <span>
                                    Deliver the order to my address
                                </span>

                            </div>

                        </label>


                        <label className="delivery-option">

                            <input
                                type="radio"
                                name="deliveryPreference"
                                value="Standard Delivery"
                                checked={
                                    formData.deliveryPreference ===
                                    "Standard Delivery"
                                }
                                onChange={handleChange}
                            />

                            <div>

                                <strong>
                                    📦 Standard Delivery
                                </strong>

                                <span>
                                    Regular delivery service
                                </span>

                            </div>

                        </label>

                    </div>

                </section>


                {/* Save */}

                <div className="customer-form-actions">

                    <button
                        type="submit"
                        className="customer-save-button"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : "💾 Save Details"}

                    </button>

                </div>

            </form>

        </div>
    );
}

export default CustomerDetails;