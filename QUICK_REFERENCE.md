# Quick Reference Guide

## 🚀 Getting Started

### Import Authentication
```typescript
import { useAuth } from '@/contexts/auth-context';

const { user, login, register, selectRole, logout } = useAuth();
```

### Import Navigation Utilities
```typescript
import { useSafeNavigation } from '@/utils/navigation-utils';

const { safeNavigate, safeReplace, safeGoBack } = useSafeNavigation();
```

### Import Validation
```typescript
import { 
  validatePhone, 
  validateOTP, 
  validateEmail,
  validateFarmerRegistration 
} from '@/utils/validation';

const validation = validatePhone(phone);
if (!validation.isValid) {
  console.log(validation.errors);
}
```

### Import Bottom Navigation
```typescript
import BottomNavigation from '@/components/bottom-navigation';

<BottomNavigation variant="farmer" activeColor="#16a34a" />
```

---

## 📱 Common Patterns

### Authentication Check
```typescript
useEffect(() => {
  if (!user) {
    router.replace('/login');
  }
}, [user]);
```

### Safe Navigation
```typescript
// Navigate with parameters
safeNavigate('/crop-details', { cropId: '123' });

// Get parameters
const { cropId } = useLocalSearchParams();

// Navigate back
safeGoBack();
```

### Form Submission
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');

const handleSubmit = async () => {
  setError('');
  setIsLoading(true);
  try {
    // Validate
    const validation = validateForm(data);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }
    
    // Submit
    // await api.submit(data);
    
    // Navigate
    safeNavigate('/success');
  } catch (err) {
    setError('Failed to submit');
  } finally {
    setIsLoading(false);
  }
};
```

### Loading State
```typescript
{isLoading ? (
  <ActivityIndicator size="large" color="#16a34a" />
) : (
  <TouchableOpacity onPress={handleSubmit}>
    <Text>Submit</Text>
  </TouchableOpacity>
)}
```

### Error Display
```typescript
{error && (
  <View className="bg-red-100 p-3 rounded-lg mb-4">
    <Text className="text-red-700">{error}</Text>
  </View>
)}
```

---

## 🎨 Styling Classes

### Colors
- Primary: `bg-green-600` / `text-green-600`
- Secondary: `bg-gray-100` / `text-gray-600`
- Error: `bg-red-100` / `text-red-600`
- Success: `bg-green-50` / `text-green-600`

### Spacing
- Small: `p-2` / `m-2`
- Medium: `p-4` / `m-4`
- Large: `p-6` / `m-6`

### Borders
- Rounded: `rounded-lg` / `rounded-xl`
- Border: `border` / `border-2`
- Border Color: `border-gray-200` / `border-green-600`

### Text
- Heading: `text-2xl font-bold`
- Subheading: `text-lg font-semibold`
- Body: `text-base`
- Small: `text-sm`

---

## 📋 Validation Functions

### Phone Validation
```typescript
const result = validatePhone('9876543210');
// { isValid: true, errors: [] }
```

### OTP Validation
```typescript
const result = validateOTP('123456');
// { isValid: true, errors: [] }
```

### Email Validation
```typescript
const result = validateEmail('user@example.com');
// { isValid: true, errors: [] }
```

### Farmer Registration
```typescript
const result = validateFarmerRegistration({
  fullName: 'John Doe',
  email: 'john@example.com',
  mobileNumber: '9876543210',
  farmName: 'Green Farm',
  farmSize: 10
});
// { isValid: true, errors: {} }
```

---

## 🔐 Authentication Flow

### Login
```typescript
const { login } = useAuth();
await login(phone, otp);
// User is now authenticated
```

### Register
```typescript
const { register } = useAuth();
await register({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  role: 'farmer'
});
```

### Select Role
```typescript
const { selectRole } = useAuth();
await selectRole('farmer');
// User role is set
```

### Logout
```typescript
const { logout } = useAuth();
await logout();
// User is logged out
```

---

## 📊 User Object

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'buyer';
  profileImage?: string;
  farmName?: string;
  farmSize?: number;
  location?: string;
}
```

---

## 🧭 Navigation Routes

### Authentication
- `/login` - Login screen
- `/select-role` - Role selection
- `/farmer-registration` - Farmer registration
- `/buyer-profile-setup` - Buyer profile setup

### Farmer
- `/farmer-home` - Farmer dashboard
- `/my-farms` - Farm management
- `/add-crop` - Add crop listing
- `/farmer-offers` - View offers

### Buyer
- `/buyer-home` - Buyer dashboard
- `/nearby-crops` - Browse crops
- `/cart` - Shopping cart
- `/checkout` - Checkout

### Common
- `/profile` - User profile
- `/settings` - Settings
- `/messages` - Messages
- `/chat-screen` - Chat

---

## 🐛 Debugging

### Check User State
```typescript
const { user } = useAuth();
console.log('Current user:', user);
```

### Check Navigation
```typescript
const router = useRouter();
console.log('Current route:', router.pathname);
```

### Check Validation
```typescript
const validation = validatePhone(phone);
console.log('Validation result:', validation);
```

### Check Errors
```typescript
try {
  // Code
} catch (error) {
  console.error('Error:', error);
}
```

---

## 📚 File Locations

### Infrastructure
- `contexts/auth-context.tsx` - Authentication
- `utils/navigation-utils.ts` - Navigation
- `utils/validation.ts` - Validation
- `components/bottom-navigation.tsx` - Bottom nav

### Screens
- `app/login.tsx` - Login
- `app/select-role.tsx` - Role selection
- `app/farmer-registration.tsx` - Farmer registration
- `app/buyer-profile-setup.tsx` - Buyer setup
- `app/farmer-home.tsx` - Farmer home
- `app/buyer-home.tsx` - Buyer home

### Documentation
- `NAVIGATION_ENHANCEMENTS_SUMMARY.md` - Full summary
- `IMPLEMENTATION_GUIDE.md` - Implementation guide
- `PROGRESS_REPORT.md` - Progress report
- `QUICK_REFERENCE.md` - This file

---

## ⚡ Quick Tips

1. **Always use useAuth()** for user data
2. **Always use useSafeNavigation()** for navigation
3. **Always validate forms** before submission
4. **Always show loading states** during async operations
5. **Always handle errors** gracefully
6. **Always use bottom navigation** on main screens
7. **Always clear errors** when user starts typing
8. **Always disable buttons** during loading

---

## 🔗 Useful Links

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)
- [Lucide Icons](https://lucide.dev/)

---

## 📞 Support

For issues or questions:
1. Check the IMPLEMENTATION_GUIDE.md
2. Review existing screen implementations
3. Check validation utilities
4. Review error messages

---

**Last Updated**: 2025-10-18
**Version**: 1.0

