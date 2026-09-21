import { Fragment, useEffect, useState } from "react";
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
import Select, {
  type ActionMeta,
  type MultiValue,
  type SingleValue,
} from "react-select";
import {
  optionToString,
  stringToOption,
  type OptionType,
} from "../lib/formatHelpers";
import { ArrowRight, Trash } from "phosphor-react";
import AsyncSelect from "react-select/async";
import ServiceSummary from "./serviceSummary";
import { useRouter } from "next/router";

type DupeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  service: SingleServiceResponse;
  onSave: (service: SingleServiceResponse) => void;
};

export type ActionType = "add" | "merge" | "delete" | "promote" | null;

export type ActionOption = {
  label: string;
  value: ActionType;
};

type DupeFormData = {
  actionToTake: ActionType;
};

export default function MarkDuplicateModal({
  isOpen,
  onClose,
  service,
  onSave,
}: DupeModalProps) {
  const router = useRouter();
  const domainOptions = stringToOption(Object.values(labelMap));
  const countyOptions = stringToOption(WICountiesList);
  const [action, setAction] = useState<ActionType>("add");
  const [saving, setSaving] = useState(false);
  const [parentService, setParentService] =
    useState<SingleServiceResponse | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [updateData, setUpdateData] = useState<Partial<SingleServiceResponse>>(
    {},
  );

  const actionOptions: ActionOption[] = [
    { label: "Add as Location", value: "add" },
    { label: "Mark Duplicate for Deletion", value: "delete" },
    { label: "Make Parent Service", value: "promote" },
    { label: "Merge Services", value: "merge" },
  ];

  const loadServices = async (inputValue: string) => {
    try {
      const fetchSearch = await fetch("/api/search-directory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword: inputValue,
        }),
      }).then((res) => res.json());
      return fetchSearch.records || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleActionChange = (
    newValue: SingleValue<ActionOption>,
    actionMeta: ActionMeta<ActionOption>,
  ) => {
    if (actionMeta.action == "select-option") {
      setAction(newValue?.value || null);
      return;
    }
    if (actionMeta.action == "clear") {
      setAction(null);
    }
  };

  const handleServiceChange = (
    newValue: SingleValue<SingleServiceResponse>,
    actionMeta: ActionMeta<SingleServiceResponse>,
  ) => {
    if (actionMeta.action == "select-option") {
      setParentService(newValue);
      return;
    }
    if (actionMeta.action == "clear") {
      setParentService(null);
    }
  };

  const handleSave = async () => {
    if (!parentService) return;

    setSaving(true);
    let result: SingleServiceResponse | null = null;

    if (action == "add") {
      result = {
        ...parentService,
        locations: [
          ...parentService.locations,
          ...service.locations.map((loc) => ({
            ...loc,
            primary_location: false,
          })),
        ],
        counties: [
          ...new Set([...parentService.counties, ...service.counties]),
        ],
        domains: [...new Set([...parentService.domains, ...service.domains])],
      };
    }

    if (action == "promote") {
      result = {
        ...service,
        locations: [
          ...service.locations,
          { ...parentService.primary_location, primary_location: false },
        ],
        counties: [
          ...new Set([...parentService.counties, ...service.counties]),
        ],
        domains: [...new Set([...parentService.domains, ...service.domains])],
      };
    }

    if (action == "merge") {
      result = {
        ...parentService,
        description: parentService.description + "; " + service.description,
        need_to_bring:
          parentService.need_to_bring + ": " + service.need_to_bring,
        counties: [
          ...new Set([...parentService.counties, ...service.counties]),
        ],
        domains: [...new Set([...parentService.domains, ...service.domains])],
      };
    }
    if (!result) return;
    try {
      console.log("Updating Parent Service");
      const response = await fetch("/api/update-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...result,
          serviceId: parentService._id,
        }),
      });

      if (response.ok) {
        console.log("Updated Service");
        console.log("Deleting Service");
        await handleDelete();
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

  const handleDelete = async () => {
    console.log(service._id);
    try {
      const response = await fetch("/api/delete-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: service._id,
        }),
      });

      if (response.ok) {
        // Redirect to directory page after successful deletion
        router.push(
          parentService ? `/referral/${parentService?._id}` : "/directory",
        );
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete service");
      }
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Failed to delete service");
    }
  };

  useEffect(() => {
    const bodyFix = () => {
      setPortalTarget(document.body);
    };
    bodyFix();
  }, []);

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
                    Mark As Duplicate Service
                  </DialogTitle>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                        What service is this a duplicate of?:{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <AsyncSelect
                        defaultOptions={false}
                        isClearable
                        loadOptions={loadServices}
                        onChange={handleServiceChange}
                        getOptionLabel={(e: SingleServiceResponse) => e.name}
                        getOptionValue={(e: SingleServiceResponse) => e._id}
                        menuPortalTarget={portalTarget}
                        menuPosition="fixed"
                        styles={{
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                    {parentService && (
                      <>
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                            What should we do with the duplicate?:{" "}
                            <span className="text-red-600">*</span>
                          </label>{" "}
                          <Select<ActionOption>
                            name="action"
                            options={actionOptions}
                            onChange={handleActionChange}
                            placeholder="Select Action..."
                            defaultValue={{
                              label: "Add as Location",
                              value: "add",
                            }}
                          />
                        </div>
                        <div className="">
                          <strong>Preview:</strong>
                          <br />
                          {action !== "delete" && (
                            <span className="text-xs">
                              (You Will be able to edit the resulting service
                              once this is complete to tidy it up):
                            </span>
                          )}
                          <ServiceSummary
                            service={service}
                            parentService={parentService}
                            action={action}
                          />
                        </div>
                      </>
                    )}
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
                    onClick={
                      action == "delete"
                        ? () => {
                            if (
                              !confirm(
                                `Are you sure you want to delete "${service.name}"? This action cannot be undone.`,
                              )
                            ) {
                              return;
                            }
                            handleDelete();
                          }
                        : handleSave
                    }
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : action == "delete"
                        ? "Delete Service"
                        : "Submit Changes"}
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
