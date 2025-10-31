/**
 * Form validation utilities
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate phone number (Indian format)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Validate OTP (6 digits)
 */
export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

/**
 * Validate email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password (minimum 8 characters, at least one uppercase, one lowercase, one number)
 */
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate name (minimum 2 characters, only letters and spaces)
 */
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(name);
};

/**
 * Validate farm size (positive number)
 */
export const validateFarmSize = (size: string): boolean => {
  const num = parseFloat(size);
  return !isNaN(num) && num > 0;
};

/**
 * Validate quantity (positive number)
 */
export const validateQuantity = (quantity: string): boolean => {
  const num = parseFloat(quantity);
  return !isNaN(num) && num > 0;
};

/**
 * Validate price (positive number with up to 2 decimal places)
 */
export const validatePrice = (price: string): boolean => {
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  const num = parseFloat(price);
  return priceRegex.test(price) && num > 0;
};

/**
 * Validate login form
 */
export const validateLoginForm = (phone: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!phone) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else if (!validatePhone(phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate OTP form
 */
export const validateOTPForm = (otp: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!otp) {
    errors.push({ field: 'otp', message: 'OTP is required' });
  } else if (!validateOTP(otp)) {
    errors.push({ field: 'otp', message: 'OTP must be 6 digits' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate farmer registration form
 */
export const validateFarmerRegistration = (
  name: string,
  email: string,
  farmName: string,
  farmSize: string
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!name) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (!validateName(name)) {
    errors.push({ field: 'name', message: 'Please enter a valid name' });
  }

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email' });
  }

  if (!farmName) {
    errors.push({ field: 'farmName', message: 'Farm name is required' });
  }

  if (!farmSize) {
    errors.push({ field: 'farmSize', message: 'Farm size is required' });
  } else if (!validateFarmSize(farmSize)) {
    errors.push({ field: 'farmSize', message: 'Please enter a valid farm size' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate add crop form
 */
export const validateAddCropForm = (
  cropType: string,
  quantity: string,
  price: string
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!cropType) {
    errors.push({ field: 'cropType', message: 'Crop type is required' });
  }

  if (!quantity) {
    errors.push({ field: 'quantity', message: 'Quantity is required' });
  } else if (!validateQuantity(quantity)) {
    errors.push({ field: 'quantity', message: 'Please enter a valid quantity' });
  }

  if (!price) {
    errors.push({ field: 'price', message: 'Price is required' });
  } else if (!validatePrice(price)) {
    errors.push({ field: 'price', message: 'Please enter a valid price' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate checkout form
 */
export const validateCheckoutForm = (
  address: string,
  city: string,
  zipCode: string,
  paymentMethod: string
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!address) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  if (!city) {
    errors.push({ field: 'city', message: 'City is required' });
  }

  if (!zipCode) {
    errors.push({ field: 'zipCode', message: 'Zip code is required' });
  } else if (!/^\d{6}$/.test(zipCode)) {
    errors.push({ field: 'zipCode', message: 'Please enter a valid zip code' });
  }

  if (!paymentMethod) {
    errors.push({ field: 'paymentMethod', message: 'Payment method is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get error message for a field
 */
export const getFieldError = (errors: ValidationError[], field: string): string | null => {
  const error = errors.find((e) => e.field === field);
  return error ? error.message : null;
};

