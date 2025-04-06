import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Higher-order component that adds accessibility features to a component
 * - Improves keyboard navigation
 * - Adds ARIA attributes
 * - Ensures proper focus management
 * - Provides proper semantic roles
 *
 * @param {Component} WrappedComponent - The component to enhance with accessibility
 * @param {Object} options - Configuration options
 * @returns {Component} - Enhanced component with accessibility features
 */
const withAccessibility = (WrappedComponent, options = {}) => {
  const {
    role = null,
    focusable = false,
    ariaLabel = null,
    ariaLabelledBy = null,
    ariaDescribedBy = null,
    tabIndex = null,
  } = options;

  // Use forwardRef to allow parent components to pass refs through
  const AccessibleComponent = forwardRef((props, ref) => {
    const {
      id,
      role: propRole,
      tabIndex: propTabIndex,
      'aria-label': propAriaLabel,
      'aria-labelledby': propAriaLabelledBy,
      'aria-describedby': propAriaDescribedBy,
      onKeyDown,
      ...otherProps
    } = props;

    // Handle keyboard events for better keyboard accessibility
    const handleKeyDown = event => {
      // Call the original onKeyDown if it exists
      if (onKeyDown) {
        onKeyDown(event);
      }

      // Enhanced keyboard handling (Space and Enter for buttons etc.)
      if (
        (propRole === 'button' || role === 'button') &&
        (event.key === 'Enter' || event.key === ' ')
      ) {
        event.preventDefault();
        // If the component has an onClick handler, trigger it
        if (props.onClick) {
          props.onClick(event);
        }
      }
    };

    // Merge ARIA attributes, prioritizing props over options
    const accessibilityProps = {
      role: propRole || role,
      tabIndex: propTabIndex !== undefined ? propTabIndex : focusable ? 0 : tabIndex,
      'aria-label': propAriaLabel || ariaLabel,
      'aria-labelledby': propAriaLabelledBy || ariaLabelledBy,
      'aria-describedby': propAriaDescribedBy || ariaDescribedBy,
      onKeyDown: handleKeyDown,
    };

    // Remove undefined values to avoid React warnings
    Object.keys(accessibilityProps).forEach(key => {
      if (accessibilityProps[key] === undefined || accessibilityProps[key] === null) {
        delete accessibilityProps[key];
      }
    });

    return <WrappedComponent ref={ref} id={id} {...accessibilityProps} {...otherProps} />;
  });

  // Set display name for easier debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  AccessibleComponent.displayName = `WithAccessibility(${displayName})`;
  
  // Define PropTypes for the HOC
  AccessibleComponent.propTypes = {
    id: PropTypes.string,
    role: PropTypes.string,
    tabIndex: PropTypes.number,
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    onKeyDown: PropTypes.func,
    onClick: PropTypes.func
  };

  return AccessibleComponent;
};

export default withAccessibility;

/**
 * Usage examples:
 *
 * // Create an accessible button
 * const AccessibleButton = withAccessibility(Button, {
 *   role: 'button',
 *   focusable: true,
 *   ariaLabel: 'Submit form'
 * });
 *
 * // Create an accessible navigation
 * const AccessibleNav = withAccessibility('nav', {
 *   role: 'navigation',
 *   ariaLabel: 'Main Navigation'
 * });
 *
 * // Create an accessible tabbed interface
 * const AccessibleTabs = withAccessibility(Tabs, {
 *   role: 'tablist'
 * });
 */
