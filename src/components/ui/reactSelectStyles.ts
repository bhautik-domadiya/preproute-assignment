import type { StylesConfig } from "react-select";
import type { SelectOption } from "@/constants/testForm.constants";

const primaryMuted = "color-mix(in srgb, var(--primary) 10%, transparent)";
const primaryMutedHover = "color-mix(in srgb, var(--primary) 20%, transparent)";

export const figmaSelectStyles: StylesConfig<SelectOption, boolean> = {
  control: (base, state) => ({
    ...base,
    minHeight: 48,
    height: 48,
    borderRadius: 8,
    borderColor: state.isFocused ? "var(--primary)" : "var(--input)",
    borderWidth: 1,
    boxShadow: state.isFocused
      ? "0 0 0 2px color-mix(in srgb, var(--ring) 20%, transparent)"
      : "none",
    backgroundColor: "var(--card)",
    cursor: "pointer",
    "&:hover": {
      borderColor: state.isFocused ? "var(--primary)" : "var(--muted-foreground)",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 16px",
    fontSize: 16,
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    fontSize: 16,
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--muted-foreground)",
    fontSize: 16,
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--foreground)",
    fontSize: 16,
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: primaryMuted,
    borderRadius: 6,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "var(--primary)",
    fontSize: 14,
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "var(--primary)",
    "&:hover": {
      backgroundColor: primaryMutedHover,
      color: "var(--primary)",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "var(--muted-foreground)",
    paddingRight: 12,
    "&:hover": {
      color: "var(--foreground)",
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 8,
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-md)",
    overflow: "hidden",
  }),
  option: (base, state) => ({
    ...base,
    fontSize: 14,
    backgroundColor: state.isSelected
      ? "var(--primary)"
      : state.isFocused
        ? primaryMuted
        : "var(--card)",
    color: state.isSelected ? "var(--primary-foreground)" : "var(--foreground)",
    cursor: "pointer",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};
