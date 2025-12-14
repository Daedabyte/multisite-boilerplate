/**
 * Form Validation Behavior
 *
 * Data-attribute driven client-side form validation.
 * - Built-in validation rules
 * - Custom validation patterns
 * - Accessible error messages
 * - Live validation on blur/input
 *
 * @example
 * ```html
 * <form data-validate>
 *   <div data-field>
 *     <label for="email">Email</label>
 *     <input
 *       type="email"
 *       id="email"
 *       name="email"
 *       data-validate-required
 *       data-validate-email
 *       data-validate-message-required="Email is required"
 *       data-validate-message-email="Please enter a valid email"
 *     />
 *     <span data-field-error aria-live="polite"></span>
 *   </div>
 *   <button type="submit">Submit</button>
 * </form>
 * ```
 */

import { $, $$ } from '../core/dom';

export interface ValidationRule {
    validate: (value: string, element: HTMLInputElement) => boolean;
    message: string;
}

export interface FormValidationOptions {
    validateOnBlur?: boolean;
    validateOnInput?: boolean;
    scrollToError?: boolean;
    onValid?: (form: HTMLFormElement) => void;
    onInvalid?: (form: HTMLFormElement, errors: Map<HTMLInputElement, string>) => void;
}

interface FormInstance {
    element: HTMLFormElement;
    options: FormValidationOptions;
    fields: HTMLInputElement[];
}

const instances = new Map<HTMLFormElement, FormInstance>();

// Built-in validation rules
const builtInRules: Record<string, (message?: string) => ValidationRule> = {
    required: (message = 'This field is required') => ({
        validate: (value) => value.trim().length > 0,
        message,
    }),
    email: (message = 'Please enter a valid email address') => ({
        validate: (value) =>
            !value ||
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message,
    }),
    url: (message = 'Please enter a valid URL') => ({
        validate: (value) => {
            if (!value) return true;
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        },
        message,
    }),
    phone: (message = 'Please enter a valid phone number') => ({
        validate: (value) =>
            !value ||
            /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 10,
        message,
    }),
    minLength: (message = 'Value is too short') => ({
        validate: (value, element) => {
            const min = parseInt(element.dataset.validateMinlength || '0', 10);
            return !value || value.length >= min;
        },
        message,
    }),
    maxLength: (message = 'Value is too long') => ({
        validate: (value, element) => {
            const max = parseInt(element.dataset.validateMaxlength || '999999', 10);
            return !value || value.length <= max;
        },
        message,
    }),
    min: (message = 'Value is too small') => ({
        validate: (value, element) => {
            const min = parseFloat(element.dataset.validateMin || '-Infinity');
            const numValue = parseFloat(value);
            return !value || isNaN(numValue) || numValue >= min;
        },
        message,
    }),
    max: (message = 'Value is too large') => ({
        validate: (value, element) => {
            const max = parseFloat(element.dataset.validateMax || 'Infinity');
            const numValue = parseFloat(value);
            return !value || isNaN(numValue) || numValue <= max;
        },
        message,
    }),
    pattern: (message = 'Please match the requested format') => ({
        validate: (value, element) => {
            const pattern = element.dataset.validatePattern;
            if (!pattern || !value) return true;
            try {
                return new RegExp(pattern).test(value);
            } catch {
                return true;
            }
        },
        message,
    }),
    match: (message = 'Fields do not match') => ({
        validate: (value, element) => {
            const matchField = element.dataset.validateMatch;
            if (!matchField) return true;
            const otherField = document.querySelector<HTMLInputElement>(
                `[name="${matchField}"]`
            );
            return !otherField || value === otherField.value;
        },
        message,
    }),
};

/**
 * Gets validation rules for a field
 */
function getFieldRules(field: HTMLInputElement): ValidationRule[] {
    const rules: ValidationRule[] = [];

    Object.keys(builtInRules).forEach((ruleName) => {
        const attrName = `data-validate-${ruleName.toLowerCase()}`;
        if (field.hasAttribute(attrName)) {
            const customMessage = field.dataset[
                `validateMessage${ruleName.charAt(0).toUpperCase() + ruleName.slice(1)}`
            ];
            rules.push(builtInRules[ruleName](customMessage));
        }
    });

    return rules;
}

/**
 * Validates a single field
 */
export function validateField(field: HTMLInputElement): {
    valid: boolean;
    message: string | null;
} {
    const rules = getFieldRules(field);
    const value = field.value;

    for (const rule of rules) {
        if (!rule.validate(value, field)) {
            return { valid: false, message: rule.message };
        }
    }

    return { valid: true, message: null };
}

/**
 * Shows error message for a field
 */
export function showError(field: HTMLInputElement, message: string): void {
    const container = field.closest('[data-field]');
    if (!container) return;

    const errorElement = $<HTMLElement>('[data-field-error]', container);

    field.setAttribute('aria-invalid', 'true');
    container.setAttribute('data-field-invalid', '');

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.id = errorElement.id || `error-${field.name || field.id}`;
        field.setAttribute('aria-describedby', errorElement.id);
    }
}

/**
 * Clears error message for a field
 */
export function clearError(field: HTMLInputElement): void {
    const container = field.closest('[data-field]');
    if (!container) return;

    const errorElement = $<HTMLElement>('[data-field-error]', container);

    field.removeAttribute('aria-invalid');
    container.removeAttribute('data-field-invalid');

    if (errorElement) {
        errorElement.textContent = '';
    }
}

/**
 * Validates all fields in a form
 */
export function validateForm(form: HTMLFormElement): {
    valid: boolean;
    errors: Map<HTMLInputElement, string>;
} {
    const instance = instances.get(form);
    if (!instance) {
        return { valid: true, errors: new Map() };
    }

    const errors = new Map<HTMLInputElement, string>();
    let isValid = true;

    instance.fields.forEach((field) => {
        const result = validateField(field);

        if (!result.valid && result.message) {
            isValid = false;
            errors.set(field, result.message);
            showError(field, result.message);
        } else {
            clearError(field);
        }
    });

    return { valid: isValid, errors };
}

/**
 * Creates a form validation instance programmatically
 */
export function createFormValidation(
    form: HTMLFormElement,
    options: FormValidationOptions = {}
): {
    validate: () => { valid: boolean; errors: Map<HTMLInputElement, string> };
    reset: () => void;
} {
    const fields = $$<HTMLInputElement>(
        'input[data-validate-required], input[data-validate-email], input[data-validate-url], input[data-validate-phone], input[data-validate-minlength], input[data-validate-maxlength], input[data-validate-min], input[data-validate-max], input[data-validate-pattern], input[data-validate-match], textarea[data-validate-required], select[data-validate-required]',
        form
    );

    const instance: FormInstance = {
        element: form,
        options: {
            validateOnBlur: options.validateOnBlur ?? true,
            validateOnInput: options.validateOnInput ?? false,
            scrollToError: options.scrollToError ?? true,
            ...options,
        },
        fields,
    };

    instances.set(form, instance);

    // Setup event listeners
    setupFormValidation(form, fields, instance.options);

    return {
        validate: () => validateForm(form),
        reset: () => {
            fields.forEach((field) => clearError(field));
        },
    };
}

/**
 * Setup event listeners
 */
function setupFormValidation(
    form: HTMLFormElement,
    fields: HTMLInputElement[],
    options: FormValidationOptions
): void {
    // Prevent native validation
    form.setAttribute('novalidate', '');

    // Setup field listeners
    fields.forEach((field) => {
        if (options.validateOnBlur) {
            field.addEventListener('blur', () => {
                const result = validateField(field);
                if (!result.valid && result.message) {
                    showError(field, result.message);
                } else {
                    clearError(field);
                }
            });
        }

        if (options.validateOnInput) {
            field.addEventListener('input', () => {
                const result = validateField(field);
                if (!result.valid && result.message) {
                    showError(field, result.message);
                } else {
                    clearError(field);
                }
            });
        }
    });

    // Handle form submit
    form.addEventListener('submit', (e) => {
        const { valid, errors } = validateForm(form);

        if (!valid) {
            e.preventDefault();

            // Scroll to first error
            if (options.scrollToError) {
                const firstError = Array.from(errors.keys())[0];
                firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError?.focus();
            }

            options.onInvalid?.(form, errors);
        } else {
            options.onValid?.(form);
        }
    });
}

/**
 * Destroys a form validation instance
 */
export function destroy(form: HTMLFormElement): void {
    instances.delete(form);
}

/**
 * Initialize all forms from data attributes
 */
export function init(): void {
    const forms = $$<HTMLFormElement>('form[data-validate]');

    forms.forEach((form) => {
        if (instances.has(form)) return;

        const validateOnInput =
            form.getAttribute('data-validate-on-input') === 'true';

        createFormValidation(form, { validateOnInput });
    });
}
