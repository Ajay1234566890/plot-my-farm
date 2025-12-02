import { useCalls } from '@/hooks/useCalls';
import { Video } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

interface CallButtonProps {
    userId: string;
    userName: string;
    userAvatar?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'secondary';
}

export function CallButton({
    userId,
    userName,
    userAvatar,
    size = 'medium',
    variant = 'primary',
}: CallButtonProps) {
    const { startCall, isInitiating } = useCalls();

    const handlePress = () => {
        startCall(userId, userName, userAvatar);
    };

    const sizeStyles = {
        small: { width: 40, height: 40, iconSize: 18 },
        medium: { width: 48, height: 48, iconSize: 20 },
        large: { width: 56, height: 56, iconSize: 24 },
    };

    const variantStyles = {
        primary: styles.primaryButton,
        secondary: styles.secondaryButton,
    };

    const currentSize = sizeStyles[size];

    return (
        <TouchableOpacity
            style={[
                styles.button,
                variantStyles[variant],
                { width: currentSize.width, height: currentSize.height },
            ]}
            onPress={handlePress}
            disabled={isInitiating}
        >
            {isInitiating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
                <Video size={currentSize.iconSize} color="#FFFFFF" />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    primaryButton: {
        backgroundColor: '#10B981',
    },
    secondaryButton: {
        backgroundColor: '#3B82F6',
    },
});
