import React from "react";
import { components, type ValueContainerProps } from "react-select";

type CountSelectProps = {
  itemName?: string;
};

const createCountValueContainer = (itemName?: string) => {
  return function CountValueContainer(
    props: ValueContainerProps<{ value: string; label: string }>,
  ) {
    const selectedValues = props.getValue();
    const classes = "absolute left-3 pointer-events-none text-xs mr-8";

    return <components.ValueContainer {...props} />;
  };
};

export default createCountValueContainer;
