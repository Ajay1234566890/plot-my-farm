# Internationalization (i18n) Implementation

## Overview
This app supports 5 languages with comprehensive internationalization using `react-i18next`.

## Supported Languages

| Language | Code | Native Name | Translation Status |
|----------|------|-------------|-------------------|
| English  | `en` | English     | ✅ Complete (444 keys) |
| Telugu   | `te` | తెలుగు      | ✅ Complete (444 keys) |
| Hindi    | `hi` | हिंदी       | ✅ Complete (444 keys) |
| Tamil    | `ta` | தமிழ்       | ⚠️ Partial (English placeholders) |
| Kannada  | `kn` | ಕನ್ನಡ       | ⚠️ Partial (English placeholders) |

## Translation Structure

Translations are organized by feature/screen in JSON files:

```
i18n/
├── config.ts                 # i18n configuration
└── translations/
    ├── en.json              # English (complete)
    ├── te.json              # Telugu (complete)
    ├── hi.json              # Hindi (complete)
    ├── ta.json              # Tamil (needs translation)
    └── kn.json              # Kannada (needs translation)
```

## Translation Keys Organization

### Main Sections (21 total):
1. **common** - Common UI elements (buttons, labels, etc.)
2. **units** - Measurement units (kg, quintal, km, etc.)
3. **auth** - Authentication screens
4. **navigation** - Navigation labels
5. **farmerHome** - Farmer dashboard
6. **buyerHome** - Buyer dashboard
7. **crops** - Crop management
8. **market** - Market prices
9. **orders** - Order management
10. **cart** - Shopping cart
11. **offers** - Offer management
12. **profile** - User profile
13. **settings** - App settings
14. **notifications** - Notifications
15. **messages** - Messaging
16. **transport** - Transport booking
17. **weather** - Weather information
18. **nearby** - Nearby features
19. **farm** - Farm management
20. **errors** - Error messages
21. **success** - Success messages

## Usage in Components

### Import and use translations:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <Text>{t('common.loading')}</Text>
  );
}
```

### With interpolation:

```typescript
<Text>{t('cart.itemsInCart', { count: 5 })}</Text>
// Output: "5 items in cart"
```

## Language Selection

### User can select language in two places:

1. **Role Selection Screen** (`app/select-role.tsx`)
   - First-time language selection
   - Shows all 5 languages with native names

2. **Settings Screen** (`app/settings.tsx`)
   - Change language anytime
   - Language change takes effect immediately

## Language Persistence

- Language preference is stored in AsyncStorage
- Persists across app sessions
- Automatically loaded on app start
- Synced with user profile in Supabase

## Implementation Details

### Auth Context Integration
- Language state managed in `contexts/auth-context.tsx`
- `selectLanguage(language)` function to change language
- Automatically updates i18next and AsyncStorage
- Syncs with Supabase user profile

### i18n Configuration
- Custom language detector for AsyncStorage
- Fallback to English if translation missing
- React Native compatible (useSuspense: false)
- Automatic language caching

## Completing Tamil and Kannada Translations

### Current Status:
- Tamil (`ta.json`) and Kannada (`kn.json`) currently use English as placeholders
- All 444 translation keys are present in the files
- Need professional translation for accuracy

### To Complete Translations:

1. **Hire Professional Translators**
   - Native Tamil and Kannada speakers
   - Familiar with agricultural terminology
   - Understanding of app context

2. **Translation Process**
   - Open `i18n/translations/ta.json` or `kn.json`
   - Replace English values with Tamil/Kannada translations
   - Maintain the same JSON structure
   - Test translations in the app

3. **Key Considerations**
   - Preserve interpolation syntax: `{{variable}}`
   - Keep technical terms consistent
   - Consider cultural context
   - Test on actual devices with native speakers

## Testing Translations

1. Change language in app settings
2. Navigate through all screens
3. Verify all text is translated
4. Check for layout issues with longer text
5. Test interpolation with dynamic values

## Adding New Translation Keys

When adding new features:

1. Add English key to `i18n/translations/en.json`
2. Add corresponding keys to all other language files
3. Use the key in your component: `t('section.newKey')`
4. Test in all languages

## Notes

- All hardcoded strings should be replaced with translation keys
- Use descriptive key names (e.g., `auth.loginButton` not `btn1`)
- Group related keys under same section
- Keep translations concise for mobile UI
- Test with longest translation to ensure UI fits

## Support

For translation issues or questions, contact the development team.

