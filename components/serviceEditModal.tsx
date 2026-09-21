import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { WICountiesList } from "../lib/WI_Counties";
import { labelMap } from "../lib/serviceLabelsMap";
import type { LocationType, SingleServiceResponse } from "../types/service";
import { blankLocation } from "../lib/serverSideHelpers";
import Select, { type ActionMeta, type MultiValue } from "react-select";
import {
  optionToString,
  primaryLocationFirst,
  stringToOption,
  type OptionType,
} from "../lib/formatHelpers";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Trash } from "phosphor-react";

type ServiceEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  service?: SingleServiceResponse;
  onSave: (service: SingleServiceResponse) => void;
};

type ServiceEditFormData = Omit<
  SingleServiceResponse,
  "domains" | "counties" | "_id"
> & {
  domains: OptionType[];
  counties: OptionType[];
};

export default function ServiceEditModal({
  isOpen,
  onClose,
  service,
  onSave,
}: ServiceEditModalProps) {
  const domainOptions = stringToOption(Object.values(labelMap));
  const countyOptions = stringToOption(WICountiesList);
  const [formData, setFormData] = useState<ServiceEditFormData>(
    service
      ? {
          name: service.name,
          counties: stringToOption(service.counties),
          locations: primaryLocationFirst(service.locations),
          domains: stringToOption(service.domains),
          need_to_bring: service.need_to_bring || "",
          description: service.description || "",
          primary_location: service.primary_location || "",
        }
      : {
          name: "",
          counties: [],
          locations: [blankLocation()],
          domains: [],
          need_to_bring: "",
          description: "",
          primary_location: blankLocation(),
        },
  );
  const [saving, setSaving] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (
    newValue: MultiValue<OptionType>,
    field: "domains" | "counties",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleAddressChange = (
    index: number,
    field: "city" | "street" | "state" | "zip",
    value: string,
  ) => {
    const newFormData = { ...formData };
    newFormData.locations[index].address[field] = value;

    setFormData({ ...newFormData });
  };

  const handleLocationDataChange = <K extends keyof LocationType>(
    index: number,
    field: K,
    value: LocationType[K],
  ) => {
    const newFormData = { ...formData };
    newFormData.locations[index][field] = value;

    setFormData({ ...newFormData });
  };

  const onAddLocation = () => {
    const newLocation = blankLocation();
    newLocation.contactEmail = formData.locations[0].contactEmail || "";
    newLocation.contactPhone = formData.locations[0].contactPhone || "";
    newLocation.contactName = formData.locations[0].contactName || "";
    newLocation.hours = formData.locations[0].hours || "";
    newLocation.url = formData.locations[0].url || "";

    setFormData((prev) => ({
      ...prev,
      locations: [...prev.locations, newLocation],
    }));
  };

  const onRemoveLocation = (index: number) => {
    const locations = [...formData.locations].toSpliced(index, 1);
    setFormData((prev) => ({ ...prev, locations }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = service
        ? await fetch("/api/update-service", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              serviceId: service._id,
              ...formData,
              domains: optionToString(formData.domains),
              counties: optionToString(formData.counties),
            }),
          })
        : await fetch("/api/save-new-referral", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              domains: optionToString(formData.domains),
              counties: optionToString(formData.counties),
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
  const isFormValid = (service: ServiceEditFormData) => {
    return (
      service.counties.length > 0 &&
      service.name !== "" &&
      service.domains.length > 0 &&
      service.locations.every((loc) => loc.address.city)
    );
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-black dark:bg-opacity-90 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 max-h-[90vh] overflow-y-auto">
                <div>
                  <DialogTitle
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4"
                  >
                    {service ? "Edit" : "Add New"} Service
                  </DialogTitle>

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
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                        Domains (Select all that Apply):{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <Select
                        className={
                          "w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0" +
                          (formData.domains.length == 0
                            ? " border-red-600"
                            : "")
                        }
                        name="domains"
                        options={domainOptions}
                        isMulti
                        onChange={(
                          newValue: MultiValue<OptionType>,
                          _actionMeta: ActionMeta<OptionType>,
                        ) => {
                          handleSelectChange(newValue, "domains");
                        }}
                        defaultValue={
                          service ? stringToOption(service.domains) : []
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                        Counties Served (Select all that Apply):{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <Select
                        className={
                          "w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0" +
                          (formData.domains.length == 0
                            ? " border-red-600"
                            : "")
                        }
                        name="counties"
                        options={countyOptions}
                        isMulti
                        onChange={(
                          newValue: MultiValue<OptionType>,
                          _actionMeta: ActionMeta<OptionType>,
                        ) => {
                          handleSelectChange(newValue, "counties");
                        }}
                        defaultValue={
                          service ? stringToOption(service.counties) : []
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                        Service Description / Eligibility Requirements:
                      </label>
                      <textarea
                        className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                        name="requirements"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                        What the participant needs to bring to any meetings /
                        interviews:
                      </label>
                      <textarea
                        className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                        rows={4}
                        name="need_to_bring"
                        value={formData.need_to_bring}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formData.locations.map((loc, index) => {
                      return (
                        <div key={index}>
                          <div className="flex justify-between">
                            <span>
                              {index == 0
                                ? "Primary location"
                                : "Additional Location " + index}
                            </span>
                            {index !== 0 && (
                              <button
                                className="flex items-center button text-xs text-red-600 hover:bg-red-400 hover:text-white rounded-xl p-2"
                                onClick={() => onRemoveLocation(index)}
                                type="button"
                              >
                                <Trash /> <span> Remove</span>
                              </button>
                            )}
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 my-1 block">
                              Street Address:
                            </label>
                            <input
                              className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                              type="text"
                              name="street"
                              value={loc.address.street}
                              onChange={(e) =>
                                handleAddressChange(
                                  index,
                                  "street",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-2">
                              <label className="text-xs text-gray-500 dark:text-gray-400 my-1 block">
                                City:<span className="text-red-600">*</span>
                              </label>
                              <input
                                className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                                type="text"
                                name="city"
                                value={loc.address.city}
                                onChange={(e) =>
                                  handleAddressChange(
                                    index,
                                    "city",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400 my-1 block">
                                State:
                              </label>
                              <input
                                className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                                type="text"
                                name="state"
                                value={loc.address.state}
                                onChange={(e) =>
                                  handleAddressChange(
                                    index,
                                    "state",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400 my-1 block">
                                Zip:
                              </label>
                              <input
                                className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                                type="text"
                                name="zip"
                                value={loc.address.zip}
                                onChange={(e) =>
                                  handleAddressChange(
                                    index,
                                    "zip",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 my-1 block">
                              <span>URL:</span>
                            </label>
                            <input
                              className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                              type="text"
                              name="url"
                              value={loc.url}
                              onChange={(e) =>
                                handleLocationDataChange(
                                  index,
                                  "url",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 my-1 block">
                              Hours:
                            </label>
                            <input
                              className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                              type="text"
                              name="hours"
                              value={loc.hours}
                              onChange={(e) =>
                                handleLocationDataChange(
                                  index,
                                  "url",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400 my-1 block">
                                Contact Name:
                              </label>
                              <input
                                className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                                type="text"
                                name="contactName"
                                value={loc.contactName}
                                onChange={(e) =>
                                  handleLocationDataChange(
                                    index,
                                    "contactName",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400 my-1 block">
                                Phone:
                              </label>
                              <input
                                className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                                type="text"
                                name="phone"
                                value={loc.contactPhone}
                                onChange={(e) =>
                                  handleLocationDataChange(
                                    index,
                                    "contactPhone",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400 my-1 block">
                                Email:
                              </label>
                              <input
                                className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                                type="text"
                                name="contactEmail"
                                value={loc.contactEmail}
                                onChange={(e) =>
                                  handleLocationDataChange(
                                    index,
                                    "contactEmail",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 my-1 block">
                              Location-Specific notes (directions, check-in
                              procedures, etc):
                            </label>
                            <textarea
                              className="w-full text-xs border-gray-300 rounded dark:bg-black dark:text-white dark:border-0"
                              name="requirements"
                              value={loc.notes}
                              onChange={(e) =>
                                handleLocationDataChange(
                                  index,
                                  "notes",
                                  e.target.value,
                                )
                              }
                              rows={4}
                            />
                          </div>
                          <hr className="my-3 w-48 mx-auto h-0.5 bg-slate-300 border-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="my-2">
                  <button
                    className="py-2 px-4 text-xs bg-green-400 hover:bg-green-600 text-gray-800 rounded-lg"
                    onClick={onAddLocation}
                    disabled={saving}
                    type="button"
                  >
                    Add Additonal Location
                  </button>
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
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
