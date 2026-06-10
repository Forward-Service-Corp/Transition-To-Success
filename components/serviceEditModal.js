import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { WICountiesList } from "../lib/WI_Counties";
import { labelMap } from "../lib/serviceLabelsMap";

export default function ServiceEditModal({ isOpen, onClose, service, onSave }) {
  const serviceLabels = Object.keys(labelMap);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "WI",
    street: "",
    zip: "",
    county: "",
    service: "",
    url: "http://",
    requirements: "",
    contactName: "",
    hours: "",
    phone: "",
    contactEmail: "",
    contactPhone: "",
    needs: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        city: service.city || "",
        state: service.state || "WI",
        street: service.street || "",
        zip: service.zip || "",
        county: service.county || "",
        service: service.service || "",
        url: service.url || "",
        requirements: service.requirements || "",
        contactName: service.contactName || "",
        hours: service.hours || "",
        phone: service.phone || "",
        contactEmail: service.contactEmail || "",
        contactPhone: service.contactPhone || "",
        needs: service.needs || "",
      });
    }
  }, [service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/update-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: service._id,
          ...formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (onSave) {
          onSave(data.service);
        }
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update service");
      }
    } catch (err) {
      console.error("Error updating service:", err);
      alert("Failed to update service");
    } finally {
      setSaving(false);
    }
  };
  const isFormValid = (referral) => {
    return (
      referral.county !== "" && referral.name !== "" && referral.service !== ""
    );
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-black dark:bg-opacity-90 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 max-h-[90vh] overflow-y-auto">
                <div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4"
                  >
                    Edit Service
                  </Dialog.Title>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                        Name: <span className="text-red-600">*</span>
                      </label>
                      <input
                        className={
                          "w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0" +
                          (formData.name == "" ? " border-red-600" : "")
                        }
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                          City:
                        </label>
                        <input
                          className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                          State:
                        </label>
                        <input
                          className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                        Street Address:
                      </label>
                      <input
                        className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                          Zip:
                        </label>
                        <input
                          className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                          County: <span className="text-red-600">*</span>
                        </label>
                        <select
                          className={
                            "w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0" +
                            (formData.county == "" ? " border-red-600" : "")
                          }
                          name="county"
                          value={formData.county}
                          onChange={handleInputChange}
                        >
                          <option value="">Please select a county...</option>
                          {WICountiesList.map((county) => (
                            <option key={county} value={county}>
                              {county}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                        Domain: <span className="text-red-600">*</span>
                      </label>
                      <select
                        className={
                          "w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0" +
                          (formData.service == "" ? " border-red-600" : "")
                        }
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                      >
                        <option value="">Please select a domain...</option>
                        {serviceLabels.map((service) => (
                          <option key={service} value={service}>
                            {labelMap[service]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                        URL:
                      </label>
                      <input
                        className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                        type="text"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                        Description / Requirements:
                      </label>
                      <input
                        className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                        type="text"
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                        Contact Name:
                      </label>
                      <input
                        className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                          Hours:
                        </label>
                        <input
                          className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                          type="text"
                          name="hours"
                          value={formData.hours}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                          Phone:
                        </label>
                        <input
                          className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                          Contact Email:
                        </label>
                        <input
                          className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                          type="text"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                          Contact Phone:
                        </label>
                        <input
                          className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                          type="text"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                        Needs to bring (separate by comma):
                      </label>
                      <input
                        className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                        type="text"
                        name="needs"
                        value={formData.needs}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    className="py-2 px-4 text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                    onClick={onClose}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="py-2 px-4 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                    onClick={handleSave}
                    disabled={saving || !isFormValid(formData)}
                  >
                    {saving
                      ? "Saving..."
                      : isFormValid(formData)
                        ? "Save Changes"
                        : "Fix Required Fields"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
