/**
 * Form Component Types
 * Props interfaces for form-related components
 */

import type { BaseProps } from '@types';

// ===================================
// Form Field Types
// ===================================

/**
 * Input field types
 */
export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'number'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime-local';

/**
 * Field size variants
 */
export type FormFieldSize = 'small' | 'medium' | 'large';

// ===================================
// Form Field Props
// ===================================

/**
 * Base form field props
 */
export interface FormFieldBaseProps extends BaseProps {
  /** Field name attribute */
  name: string;
  /** Label text */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Required field */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Read-only state */
  readonly?: boolean;
  /** Error message */
  error?: string;
  /** Help text */
  helpText?: string;
  /** Field size */
  size?: FormFieldSize;
  /** Default value */
  value?: string;
}

/**
 * Text input field props
 */
export interface FormFieldProps extends FormFieldBaseProps {
  /** Input type */
  type?: FormFieldType;
  /** Min length */
  minLength?: number;
  /** Max length */
  maxLength?: number;
  /** Pattern for validation */
  pattern?: string;
  /** Autocomplete attribute */
  autocomplete?: string;
}

/**
 * Textarea field props
 */
export interface FormTextareaProps extends FormFieldBaseProps {
  /** Number of visible rows */
  rows?: number;
  /** Allow resize */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  /** Min length */
  minLength?: number;
  /** Max length */
  maxLength?: number;
}

/**
 * Select option
 */
export interface SelectOption {
  /** Option value */
  value: string;
  /** Option display label */
  label: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Select field props
 */
export interface FormSelectProps extends FormFieldBaseProps {
  /** Select options */
  options: SelectOption[];
  /** Multiple selection */
  multiple?: boolean;
}

/**
 * Checkbox field props
 */
export interface FormCheckboxProps extends Omit<FormFieldBaseProps, 'placeholder'> {
  /** Checked state */
  checked?: boolean;
  /** Checkbox value when checked */
  value?: string;
}

/**
 * Radio group props
 */
export interface FormRadioGroupProps extends Omit<FormFieldBaseProps, 'placeholder'> {
  /** Radio options */
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  /** Selected value */
  value?: string;
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
}
