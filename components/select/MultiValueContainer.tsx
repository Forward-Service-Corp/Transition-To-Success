import type {
  ContainerProps,
  MultiValueGenericProps,
  MultiValueProps,
} from "react-select";
import { components } from "react-select";

const CountMultivalue = (props: MultiValueProps) => {
  if (props.index > 0) return null;

  return (
    <components.MultiValue {...props}>
      <span>This is custom text</span>
    </components.MultiValue>
  );
};
