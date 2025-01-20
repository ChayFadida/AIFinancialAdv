import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";

type SelectProps = {
  label: string;
  value: string | number;
  onChange: (event: any) => void;
  options: { id: string | number; label: string }[];
};

export const Select = ({ label, value, onChange, options }: SelectProps) => {
  const handleSelectChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id={label}>{label}</InputLabel>
      <MuiSelect
        labelId={label}
        id="demo-simple-select"
        value={value}
        label="Age"
        onChange={handleSelectChange}
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};
