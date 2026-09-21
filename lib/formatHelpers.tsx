import React from "react";
import type { LocationType } from "../types/service";

export function prettyAddress(location: LocationType): string {
  const { street, city, state, zip } = location.address;

  return (
    (street ? street + ", " : "") +
    (city ? city + (state || zip ? ", " : "") : "") +
    (state ? state + (zip ? " " : "") : "") +
    (zip || "")
  );
}

export function nl_to_br(text: string) {
  return (
    <>
      {text.split(/\\n|\n/).map((chunk, index) => (
        <React.Fragment key={index}>
          <span>{chunk}</span>
          <br />
        </React.Fragment>
      ))}
    </>
  );
}

export type OptionType = {
  value: string;
  label: string;
};

export function stringToOption(list: string[]): OptionType[] {
  return list.map((item) => ({ value: item, label: item }));
}

export function optionToString(list: OptionType[]): string[] {
  return list.map((item) => item.value);
}

export function primaryLocationFirst(list: LocationType[]): LocationType[] {
  return list.toSorted((a, b) => {
    if (a.primary_location) {
      return -1;
    }
    return 1;
  });
}
