const fs = require('fs');
const path = require('path');

// Tamil translations dictionary
const tamilTranslations = {
  // Common
  "Loading...": "ஏற்றுகிறது...",
  "Error": "பிழை",
  "Success": "வெற்றி",
  "Cancel": "ரத்து செய்",
  "Confirm": "உறுதிப்படுத்து",
  "Save": "சேமி",
  "Delete": "நீக்கு",
  "Edit": "திருத்து",
  "Add": "சேர்",
  "Search": "தேடு",
  "Filter": "வடிகட்டு",
  "Back": "பின்",
  "Next": "அடுத்து",
  "Submit": "சமர்ப்பி",
  "Close": "மூடு",
  "OK": "சரி",
  "Yes": "ஆம்",
  "No": "இல்லை",
  "Select": "தேர்ந்தெடு",
  "Upload": "பதிவேற்று",
  "Download": "பதிவிறக்கு",
  "Share": "பகிர்",
  "Refresh": "புதுப்பி",
  "Retry": "மீண்டும் முயற்சி",
  "View All": "அனைத்தையும் காண்",
  "See More": "மேலும் காண்",
  "See Less": "குறைவாக காண்",
  "No data available": "தரவு இல்லை",
  "Coming Soon": "விரைவில் வரும்",
  "Optional": "விருப்பமானது",
  "Required": "தேவையானது",
  
  // Units
  "kg": "கிலோ",
  "quintal": "குவிண்டால்",
  "ton": "டன்",
  "km": "கி.மீ",
  "m": "மீ",
  "per kg": "கிலோவுக்கு",
  "per quintal": "குவிண்டாலுக்கு",
  
  // Auth
  "Select Your Role": "உங்கள் பங்கை தேர்ந்தெடுக்கவும்",
  "Choose how you want to use Plot My Farm": "Plot My Farm ஐ எவ்வாறு பயன்படுத்த விரும்புகிறீர்கள் என்பதை தேர்வு செய்யவும்",
  "Farmer": "விவசாயி",
  "Buyer": "வாங்குபவர்",
  "Sell your crops and manage your farm": "உங்கள் பயிர்களை விற்று உங்கள் பண்ணையை நிர்வகிக்கவும்",
  "Buy fresh produce directly from farmers": "விவசாயிகளிடமிருந்து நேரடியாக புதிய பயிர்களை வாங்கவும்",
  "Continue": "தொடர்",
  "Login": "உள்நுழை",
  "Register": "பதிவு செய்",
  "Logout": "வெளியேறு",
  "Are you sure you want to logout?": "நீங்கள் வெளியேற விரும்புகிறீர்களா?",
  "Phone Number": "தொலைபேசி எண்",
  "Enter your phone number": "உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்",
  "Password": "கடவுச்சொல்",
  "Enter your password": "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
  "Forgot Password?": "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
  "Don't have an account?": "கணக்கு இல்லையா?",
  "Already have an account?": "ஏற்கனவே கணக்கு உள்ளதா?",
  "Sign Up": "பதிவு செய்",
  "Sign In": "உள்நுழை",
  "Name": "பெயர்",
  "Enter your name": "உங்கள் பெயரை உள்ளிடவும்",
  "Email": "மின்னஞ்சல்",
  "Enter your email": "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
  "Location": "இடம்",
  "Enter your location": "உங்கள் இடத்தை உள்ளிடவும்",
  "Farm Size": "பண்ணை அளவு",
  "Enter farm size": "பண்ணை அளவை உள்ளிடவும்",
  "Business Name": "வணிக பெயர்",
  "Enter business name": "வணிக பெயரை உள்ளிடவும்",
  "Business Type": "வணிக வகை",
  "Select business type": "வணிக வகையை தேர்ந்தெடுக்கவும்",
  "Setup Your Profile": "உங்கள் சுயவிவரத்தை அமைக்கவும்",
  "Complete your profile to get started": "தொடங்க உங்கள் சுயவிவரத்தை முடிக்கவும்",
  "Select Language": "மொழியை தேர்ந்தெடுக்கவும்",
  "Choose your preferred language": "உங்கள் விருப்ப மொழியை தேர்வு செய்யவும்",
  
  // Navigation
  "Home": "முகப்பு",
  "Market": "சந்தை",
  "Orders": "ஆர்டர்கள்",
  "Profile": "சுயவிவரம்",
  "Settings": "அமைப்புகள்",
  "Notifications": "அறிவிப்புகள்",
  "Messages": "செய்திகள்",
  "My Farm": "என் பண்ணை",
  "My Crops": "என் பயிர்கள்",
  "My Offers": "என் சலுகைகள்",
  "Cart": "கூடை",
  "Favorites": "பிடித்தவை",
  "Transport": "போக்குவரத்து",
  "Weather": "வானிலை",
  "Nearby": "அருகில்",
  
  // Farmer Home
  "Welcome": "வரவேற்கிறோம்",
  "Dashboard": "டாஷ்போர்டு",
  "Quick Actions": "விரைவு செயல்கள்",
  "Add New Crop": "புதிய பயிர் சேர்",
  "Get instant market quotes": "உடனடி சந்தை மேற்கோள்களைப் பெறுங்கள்",
  "View Offers": "சலுகைகளை காண்",
  "Check buyer offers": "வாங்குபவர் சலுகைகளை சரிபார்க்கவும்",
  "Market Prices": "சந்தை விலைகள்",
  "Today's rates": "இன்றைய விலைகள்",
  "Book transport": "போக்குவரத்தை முன்பதிவு செய்",
  "Nearby Buyers": "அருகிலுள்ள வாங்குபவர்கள்",
  "Nearby Farmers": "அருகிலுள்ள விவசாயிகள்",
  "Temperature": "வெப்பநிலை",
  "Humidity": "ஈரப்பதம்",
  "Rainfall": "மழை",
  "Wind Speed": "காற்றின் வேகம்",
  "Forecast": "முன்னறிவிப்பு",
  "Recent Activity": "சமீபத்திய செயல்பாடு",
  "Total Crops": "மொத்த பயிர்கள்",
  "Active Offers": "செயலில் உள்ள சலுகைகள்",
  "Completed Orders": "முடிக்கப்பட்ட ஆர்டர்கள்",
  "Revenue": "வருவாய்",
};

// Kannada translations dictionary
const kannadaTranslations = {
  // Common
  "Loading...": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
  "Error": "ದೋಷ",
  "Success": "ಯಶಸ್ಸು",
  "Cancel": "ರದ್ದುಮಾಡಿ",
  "Confirm": "ದೃಢೀಕರಿಸಿ",
  "Save": "ಉಳಿಸಿ",
  "Delete": "ಅಳಿಸಿ",
  "Edit": "ಸಂಪಾದಿಸಿ",
  "Add": "ಸೇರಿಸಿ",
  "Search": "ಹುಡುಕಿ",
  "Filter": "ಫಿಲ್ಟರ್",
  "Back": "ಹಿಂದೆ",
  "Next": "ಮುಂದೆ",
  "Submit": "ಸಲ್ಲಿಸಿ",
  "Close": "ಮುಚ್ಚಿ",
  "OK": "ಸರಿ",
  "Yes": "ಹೌದು",
  "No": "ಇಲ್ಲ",
  "Select": "ಆಯ್ಕೆಮಾಡಿ",
  "Upload": "ಅಪ್‌ಲೋಡ್",
  "Download": "ಡೌನ್‌ಲೋಡ್",
  "Share": "ಹಂಚಿಕೊಳ್ಳಿ",
  "Refresh": "ರಿಫ್ರೆಶ್",
  "Retry": "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
  "View All": "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ",
  "See More": "ಇನ್ನಷ್ಟು ನೋಡಿ",
  "See Less": "ಕಡಿಮೆ ನೋಡಿ",
  "No data available": "ಯಾವುದೇ ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ",
  "Coming Soon": "ಶೀಘ್ರದಲ್ಲಿ ಬರಲಿದೆ",
  "Optional": "ಐಚ್ಛಿಕ",
  "Required": "ಅಗತ್ಯವಿದೆ",
};

// Function to translate text
function translateText(text, targetLang) {
  const dict = targetLang === 'ta' ? tamilTranslations : kannadaTranslations;
  return dict[text] || text;
}

// Function to recursively translate JSON object
function translateJSON(obj, targetLang) {
  if (typeof obj === 'string') {
    return translateText(obj, targetLang);
  } else if (Array.isArray(obj)) {
    return obj.map(item => translateJSON(item, targetLang));
  } else if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key in obj) {
      result[key] = translateJSON(obj[key], targetLang);
    }
    return result;
  }
  return obj;
}

// Read English translations
const enPath = path.join(__dirname, '../i18n/translations/en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Generate Tamil translations
const taData = translateJSON(enData, 'ta');
const taPath = path.join(__dirname, '../i18n/translations/ta.json');
fs.writeFileSync(taPath, JSON.stringify(taData, null, 2));
console.log('✅ Tamil translations generated');

// Generate Kannada translations
const knData = translateJSON(enData, 'kn');
const knPath = path.join(__dirname, '../i18n/translations/kn.json');
fs.writeFileSync(knPath, JSON.stringify(knData, null, 2));
console.log('✅ Kannada translations generated');

