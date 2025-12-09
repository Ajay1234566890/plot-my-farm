import BuyerBottomNav from '@/app/components/BuyerBottomNav';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react-native";
import { useTranslation } from 'react-i18next';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function MarketPriceDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { t } = useTranslation();

    const priceData = {
        commodity: params.commodity as string,
        market: params.market as string,
        state: params.state as string,
        district: params.district as string,
        minPrice: params.minPrice as string,
        maxPrice: params.maxPrice as string,
        modalPrice: params.modalPrice as string,
        unit: params.unit as string,
        date: params.date as string,
        image: params.image ? (typeof params.image === 'string' ? { uri: params.image } : params.image) : { uri: "https://via.placeholder.com/400" },
        trend: params.trend as string,
        priceChange: params.priceChange ? parseFloat(params.priceChange as string) : 0,
    };

    return (
        <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
            {/* Header */}
            <View
                className="px-6 pt-12 pb-6"
                style={{
                    backgroundColor: '#B27E4C',
                    borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40,
                }}
            >
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
                        onPress={() => router.back()}
                    >
                        <ArrowLeft size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">
                        {t('market.marketPriceDetails')}
                    </Text>
                    <View className="w-10" />
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {/* Image */}
                <View className="items-center mb-6">
                    <Image
                        source={priceData.image}
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                    />
                    <Text className="text-2xl font-bold text-gray-900 mt-4">
                        {priceData.commodity}
                    </Text>
                    <Text className="text-gray-500">
                        {priceData.market}, {priceData.state}
                    </Text>
                </View>

                {/* Price Card */}
                <View className="bg-white rounded-3xl p-6 shadow-sm mb-6">
                    <Text className="text-gray-500 text-center mb-2">{t('market.modalPrice')}</Text>
                    <Text className="text-4xl font-bold text-center" style={{ color: '#B27E4C' }}>
                        ₹{priceData.modalPrice}/{priceData.unit}
                    </Text>

                    {priceData.trend && (
                        <View className="flex-row items-center justify-center mt-2">
                            {priceData.trend === 'up' ? (
                                <TrendingUp size={20} color="#22c55e" />
                            ) : (
                                <TrendingDown size={20} color="#ef4444" />
                            )}
                            <Text className={`ml-1 font-medium ${priceData.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {priceData.priceChange}% {priceData.trend === 'up' ? t('buyer.up') : t('buyer.down')}
                            </Text>
                        </View>
                    )}

                    <View className="flex-row justify-between mt-6 pt-6 border-t border-gray-100">
                        <View className="items-center flex-1 border-r border-gray-100">
                            <Text className="text-gray-400 text-xs uppercase">{t('market.minPrice')}</Text>
                            <Text className="text-lg font-bold text-gray-800">₹{priceData.minPrice}</Text>
                        </View>
                        <View className="items-center flex-1">
                            <Text className="text-gray-400 text-xs uppercase">{t('market.maxPrice')}</Text>
                            <Text className="text-lg font-bold text-gray-800">₹{priceData.maxPrice}</Text>
                        </View>
                    </View>
                </View>

                {/* Details */}
                <View className="bg-white rounded-3xl p-6 shadow-sm mb-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">{t('common.details')}</Text>

                    <View className="flex-row justify-between py-3 border-b border-gray-100">
                        <Text className="text-gray-500">{t('common.date')}</Text>
                        <Text className="text-gray-900 font-medium">{priceData.date}</Text>
                    </View>

                    <View className="flex-row justify-between py-3 border-b border-gray-100">
                        <Text className="text-gray-500">{t('common.market')}</Text>
                        <Text className="text-gray-900 font-medium">{priceData.market}</Text>
                    </View>

                    <View className="flex-row justify-between py-3 border-b border-gray-100">
                        <Text className="text-gray-500">{t('common.district')}</Text>
                        <Text className="text-gray-900 font-medium">{priceData.district || '-'}</Text>
                    </View>

                    <View className="flex-row justify-between py-3">
                        <Text className="text-gray-500">{t('common.state')}</Text>
                        <Text className="text-gray-900 font-medium">{priceData.state}</Text>
                    </View>
                </View>

                {/* Action Button - Find Farmers */}
                <TouchableOpacity
                    className="bg-green-600 rounded-full py-4 items-center mb-8 shadow-lg"
                    onPress={() => router.push({
                        pathname: "/nearby-crops",
                        params: { searchQuery: priceData.commodity }
                    })}
                >
                    <Text className="text-white font-bold text-lg">
                        {t('market.findFarmersSelling')} {priceData.commodity}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <BuyerBottomNav activeTab="home" />
        </View>
    );
}
