import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
} from '@mui/material';
import validation from '../../utils/validation';
import withAccessibility from './withAccessibility';

/**
 * An accessible form component with built-in validation
 * Features:
 * - Automatic field validation based on schema
 * - Error messages
 * - Accessible form elements with ARIA attributes
 * - Focus management
 * - Comprehensive keyboard navigation
 */
const AccessibleForm = ({
  id,
  schema,
  initialValues = {},
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel = null,
  loading = false,
  successMessage = null,
  errorMessage = null,
  resetAfterSuccess = false,
  layout = 'vertical', // 'vertical' or 'horizontal'
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const firstInputRef = useRef(null);
  const formRef = useRef(null);

  // Focus on the first field with error after submission attempt
  useEffect(() => {
    if (formSubmitted && Object.keys(errors).length > 0) {
      const firstErrorField = document.getElementById(`${id}-${Object.keys(errors)[0]}`);
      if (firstErrorField) {
        firstErrorField.focus();
      }
    }
  }, [formSubmitted, errors, id]);

  // Reset form after successful submission if required
  useEffect(() => {
    if (formSuccess && resetAfterSuccess) {
      setFormData(initialValues);
      setTouched({});
    }
  }, [formSuccess, resetAfterSuccess, initialValues]);

  // Set focus on first input when the form initially renders
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  // Handle field change
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Mark field as touched when it loses focus
  const handleBlur = e => {
    const { name } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate field on blur
    validateField(name, formData[name]);
  };

  // Validate a single field
  const validateField = (name, value) => {
    const fieldSchema = schema.fields[name];
    if (!fieldSchema) return true;

    const fieldRule = {
      required: fieldSchema.required,
      minLength: fieldSchema.minLength,
      maxLength: fieldSchema.maxLength,
      pattern: fieldSchema.pattern,
      validator: fieldSchema.validator,
    };

    const isValid = validation.validateField(value, fieldRule);

    if (!isValid) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldSchema.errorMessage || 'Invalid value',
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    return isValid;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(schema.fields).forEach(fieldName => {
      const field = schema.fields[fieldName];
      const value = formData[fieldName];
      const fieldRule = {
        required: field.required,
        minLength: field.minLength,
        maxLength: field.maxLength,
        pattern: field.pattern,
        validator: field.validator,
      };

      if (!validation.validateField(value, fieldRule)) {
        newErrors[fieldName] = field.errorMessage || 'Invalid value';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    setFormSubmitted(true);

    // Mark all fields as touched
    const allTouched = Object.keys(schema.fields).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const isValid = validateForm();

    if (isValid) {
      try {
        // Sanitize form data before submission
        const sanitizedData = validation.sanitizeObject(formData);
        await onSubmit(sanitizedData);
        setFormSuccess(true);

        if (resetAfterSuccess) {
          setFormData(initialValues);
          setTouched({});
        }
      } catch (error) {
        console.error('Form submission error:', error);
        setFormSuccess(false);
      }
    } else {
      setFormSuccess(false);
    }
  };

  // Render form fields based on schema
  const renderFields = () => {
    return Object.keys(schema.fields).map((name, index) => {
      const field = schema.fields[name];
      const isFirstField = index === 0;
      const fieldError = touched[name] && errors[name];
      const value = formData[name] ?? '';

      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'tel':
        case 'url':
        case 'number':
          return (
            <TextField
              key={name}
              id={`${id}-${name}`}
              name={name}
              label={field.label}
              type={field.type}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              required={field.required}
              fullWidth
              error={!!fieldError}
              helperText={fieldError || field.helperText}
              inputProps={{
                'aria-describedby': fieldError ? `${name}-error-text` : undefined,
                'aria-required': field.required,
                ref: isFirstField ? firstInputRef : null,
              }}
              sx={{ mb: 2 }}
              inputRef={isFirstField ? firstInputRef : null}
              disabled={loading}
            />
          );
        case 'select':
          return (
            <FormControl
              key={name}
              fullWidth
              error={!!fieldError}
              required={field.required}
              sx={{ mb: 2 }}
            >
              <InputLabel id={`${id}-${name}-label`}>{field.label}</InputLabel>
              <Select
                labelId={`${id}-${name}-label`}
                id={`${id}-${name}`}
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                label={field.label}
                inputProps={{
                  'aria-describedby': fieldError ? `${name}-error-text` : undefined,
                  'aria-required': field.required,
                  ref: isFirstField ? firstInputRef : null,
                }}
                disabled={loading}
              >
                {field.options.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {fieldError && (
                <FormHelperText id={`${name}-error-text`} error>
                  {fieldError}
                </FormHelperText>
              )}
              {field.helperText && !fieldError && (
                <FormHelperText>{field.helperText}</FormHelperText>
              )}
            </FormControl>
          );
        case 'textarea':
          return (
            <TextField
              key={name}
              id={`${id}-${name}`}
              name={name}
              label={field.label}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              required={field.required}
              fullWidth
              multiline
              rows={field.rows || 4}
              error={!!fieldError}
              helperText={fieldError || field.helperText}
              inputProps={{
                'aria-describedby': fieldError ? `${name}-error-text` : undefined,
                'aria-required': field.required,
                ref: isFirstField ? firstInputRef : null,
              }}
              sx={{ mb: 2 }}
              disabled={loading}
            />
          );
        case 'checkbox':
          return (
            <FormControlLabel
              key={name}
              control={
                <Checkbox
                  id={`${id}-${name}`}
                  name={name}
                  checked={!!value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  inputRef={isFirstField ? firstInputRef : null}
                  disabled={loading}
                  inputProps={{
                    'aria-describedby': fieldError ? `${name}-error-text` : undefined,
                    'aria-required': field.required,
                  }}
                />
              }
              label={field.label}
              sx={{ mb: 2, display: 'block' }}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <Box
      component="form"
      id={id}
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      aria-labelledby={`${id}-title`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {schema.title && (
        <Typography variant="h6" component="h2" id={`${id}-title`} gutterBottom>
          {schema.title}
        </Typography>
      )}

      {formSubmitted && successMessage && formSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {formSubmitted && errorMessage && !formSuccess && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: layout === 'horizontal' ? 'row' : 'column',
          flexWrap: layout === 'horizontal' ? 'wrap' : 'nowrap',
          gap: layout === 'horizontal' ? 2 : 0,
        }}
      >
        {renderFields()}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mt: 2,
        }}
      >
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
            variant="outlined"
            tabIndex={0}
          >
            {cancelText}
          </Button>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Processing...' : submitText}
        </Button>
      </Box>
    </Box>
  );
};

AccessibleForm.propTypes = {
  id: PropTypes.string.isRequired,
  schema: PropTypes.shape({
    title: PropTypes.string,
    fields: PropTypes.object.isRequired,
  }).isRequired,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  resetAfterSuccess: PropTypes.bool,
  layout: PropTypes.oneOf(['vertical', 'horizontal']),
};

// Enhance with accessibility features
export default withAccessibility(AccessibleForm, {
  role: 'form',
  ariaLabel: 'Form',
});

/**
 * Example usage:
 *
 * const formSchema = {
 *   title: 'Contact Form',
 *   fields: {
 *     name: {
 *       type: 'text',
 *       label: 'Full Name',
 *       required: true,
 *       minLength: 2,
 *       errorMessage: 'Please enter your name'
 *     },
 *     email: {
 *       type: 'email',
 *       label: 'Email Address',
 *       required: true,
 *       pattern: validation.patterns.email,
 *       errorMessage: 'Please enter a valid email address'
 *     },
 *     message: {
 *       type: 'textarea',
 *       label: 'Message',
 *       required: true,
 *       rows: 4,
 *       minLength: 10,
 *       errorMessage: 'Please enter a message (min 10 characters)'
 *     }
 *   }
 * };
 *
 * <AccessibleForm
 *   id="contact-form"
 *   schema={formSchema}
 *   onSubmit={handleSubmit}
 *   successMessage="Thank you for your message!"
 * />
 */
