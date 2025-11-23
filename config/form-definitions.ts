// Form Definitions - Define all form fields for each screen
// This config maps screens to their form fields for voice automation

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'phone' 
  | 'date' 
  | 'dropdown' 
  | 'image'
  | 'textarea';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[]; // For dropdown fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  voicePrompt: string; // What the AI should ask
  voiceExamples?: string[]; // Example responses
}

export interface FormDefinition {
  screenName: string;
  screenTitle: string;
  fields: FormField[];
  submitAction: string; // What happens when form is complete
}

// Add Crop Form
export const addCropForm: FormDefinition = {
  screenName: 'add-crop',
  screenTitle: 'Add Crop',
  fields: [
    {
      name: 'cropName',
      label: 'Crop Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Tomatoes',
      voicePrompt: 'What crop would you like to add?',
      voiceExamples: ['Tomatoes', 'Rice', 'Wheat', 'Potatoes'],
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      required: true,
      placeholder: 'e.g., 100',
      voicePrompt: 'How much quantity do you have?',
      voiceExamples: ['100', '50 kilograms', '200'],
    },
    {
      name: 'unit',
      label: 'Unit',
      type: 'dropdown',
      required: true,
      options: ['kg', 'quintal', 'ton', 'bag'],
      voicePrompt: 'What is the unit? You can say kilograms, quintals, tons, or bags.',
      voiceExamples: ['kilograms', 'quintals', 'tons', 'bags'],
    },
    {
      name: 'price',
      label: 'Price per Unit',
      type: 'number',
      required: true,
      placeholder: 'e.g., 50',
      voicePrompt: 'What is the price per unit in rupees?',
      voiceExamples: ['50 rupees', '100', '75 rupees per kilogram'],
    },
    {
      name: 'harvestDate',
      label: 'Harvest Date',
      type: 'date',
      required: false,
      voicePrompt: 'When was it harvested? You can say today, yesterday, or a specific date.',
      voiceExamples: ['today', 'yesterday', 'last week', '15th January'],
    },
    {
      name: 'cropImage',
      label: 'Crop Image',
      type: 'image',
      required: false,
      voicePrompt: 'Would you like to add a photo of your crop? Say yes or no.',
      voiceExamples: ['yes', 'no', 'skip'],
    },
  ],
  submitAction: 'Save crop listing',
};

// Add Offer Form
export const addOfferForm: FormDefinition = {
  screenName: 'add-offer',
  screenTitle: 'Add Offer',
  fields: [
    {
      name: 'cropName',
      label: 'Crop Name',
      type: 'text',
      required: true,
      voicePrompt: 'Which crop is this offer for?',
      voiceExamples: ['Tomatoes', 'Rice', 'Wheat'],
    },
    {
      name: 'offerPrice',
      label: 'Offer Price',
      type: 'number',
      required: true,
      voicePrompt: 'What is your offer price per unit?',
      voiceExamples: ['45 rupees', '100', '80 rupees per kilogram'],
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      required: true,
      voicePrompt: 'How much quantity are you offering?',
      voiceExamples: ['100 kilograms', '50', '200'],
    },
    {
      name: 'validUntil',
      label: 'Valid Until',
      type: 'date',
      required: false,
      voicePrompt: 'Until when is this offer valid?',
      voiceExamples: ['tomorrow', 'next week', '31st December'],
    },
  ],
  submitAction: 'Submit offer',
};

// Farmer Registration Form
export const farmerRegistrationForm: FormDefinition = {
  screenName: 'farmer-registration',
  screenTitle: 'Farmer Registration',
  fields: [
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
      voicePrompt: 'What is your full name?',
      voiceExamples: ['Rajesh Kumar', 'Priya Sharma'],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      voicePrompt: 'What is your email address?',
      voiceExamples: ['rajesh@gmail.com', 'priya.sharma@email.com'],
    },
    {
      name: 'mobileNumber',
      label: 'Mobile Number',
      type: 'phone',
      required: true,
      voicePrompt: 'What is your mobile number?',
      voiceExamples: ['9876543210', '98765 43210'],
    },
    {
      name: 'farmName',
      label: 'Farm Name',
      type: 'text',
      required: true,
      voicePrompt: 'What is the name of your farm?',
      voiceExamples: ['Green Valley Farm', 'Sunrise Farms'],
    },
    {
      name: 'farmSize',
      label: 'Farm Size (acres)',
      type: 'number',
      required: true,
      voicePrompt: 'What is the size of your farm in acres?',
      voiceExamples: ['5 acres', '10', '2.5 acres'],
    },
  ],
  submitAction: 'Complete registration',
};

// Buyer Profile Setup Form
export const buyerProfileSetupForm: FormDefinition = {
  screenName: 'buyer-profile-setup',
  screenTitle: 'Buyer Profile Setup',
  fields: [
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
      voicePrompt: 'What is your full name?',
      voiceExamples: ['Amit Patel', 'Sunita Reddy'],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      voicePrompt: 'What is your email address?',
      voiceExamples: ['amit@gmail.com', 'sunita.reddy@email.com'],
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      required: true,
      voicePrompt: 'What is your address?',
      voiceExamples: ['123 Main Street, Mumbai', 'Plot 45, Sector 12, Delhi'],
    },
    {
      name: 'pincode',
      label: 'Pincode',
      type: 'text',
      required: true,
      voicePrompt: 'What is your pincode?',
      voiceExamples: ['400001', '110001'],
    },
    {
      name: 'businessName',
      label: 'Business Name',
      type: 'text',
      required: true,
      voicePrompt: 'What is your business name?',
      voiceExamples: ['Fresh Produce Co', 'Organic Foods Ltd'],
    },
    {
      name: 'buyerType',
      label: 'Buyer Type',
      type: 'dropdown',
      required: true,
      options: ['Retailer', 'Wholesaler', 'Restaurant', 'Food Processor'],
      voicePrompt: 'What type of buyer are you? You can say retailer, wholesaler, restaurant, or food processor.',
      voiceExamples: ['retailer', 'wholesaler', 'restaurant', 'food processor'],
    },
  ],
  submitAction: 'Complete profile setup',
};

export const formDefinitions: Record<string, FormDefinition> = {
  'add-crop': addCropForm,
  'add-offer': addOfferForm,
  'farmer-registration': farmerRegistrationForm,
  'buyer-profile-setup': buyerProfileSetupForm,
};

