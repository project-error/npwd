import { forwardRef } from 'react';
import { NPWDInput } from './Input';

interface ProfileFieldProps {
  label: string;
  value: string;
  handleChange?: (val: string) => void;
  allowChange?: boolean;
  multiline?: boolean;
  maxLength?: number;
}

const ProfileField = forwardRef<HTMLInputElement, ProfileFieldProps>(
  ({ label, value, handleChange, allowChange }, ref) => {
    const _handleChange = (e) => handleChange(e.target.value);

    return (
      <div className="mt-[8px] w-full">
        <label className="text-sm font-medium text-neutral-400">{label}</label>
        <NPWDInput
          className="border border-neutral-700 focus:ring-2 focus:ring-sky-500"
          value={value}
          onChange={_handleChange}
          disabled={!allowChange}
        />
      </div>
    );
  },
);

ProfileField.defaultProps = {
  allowChange: true,
  maxLength: 200,
  multiline: false,
};

export default ProfileField;
