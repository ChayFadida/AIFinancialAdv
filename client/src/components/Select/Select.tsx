import {
  Box,
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
  width?: number;
};

export const Select = ({ label, value, onChange, options, width }: SelectProps) => {
  const handleSelectChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <Box width={`${width}px`}>
      <FormControl fullWidth>
        <InputLabel id={label}>{label}</InputLabel>
        <MuiSelect
          labelId={label}
          value={value}
          label="Age"
          onChange={handleSelectChange}
          MenuProps={{
            PaperProps: {
              sx: {
                maxWidth: width
              }
            }
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    </Box>
  );
};
