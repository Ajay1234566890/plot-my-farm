import { useCalls } from '@/hooks/useCalls';
import { getUser } from '@/services/chat-service';
import { Call } from '@/services/supabase-calls';
import { Phone, PhoneOff } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IncomingCallModalProps {
    call: Call | null;
    visible: boolean;
    onDismiss: () => void;
}

export function IncomingCallModal({ call, visible, onDismiss }: IncomingCallModalProps) {
    const { acceptCall, declineCall } = useCalls();
    const [callerInfo, setCallerInfo] = useState<{ name: string; avatar?: string } | null>(null);

    useEffect(() => {
        if (call) {
            loadCallerInfo();
        }
    }, [call]);

    const loadCallerInfo = async () => {
        if (!call) return;

        try {
            const { data: caller } = await getUser(call.caller_id);
            if (caller) {
                setCallerInfo({
                    name: caller.name,
                    avatar: caller.avatar,
                });
            }
        } catch (error) {
            console.error('Load caller info error:', error);
        }
    };

    const handleAccept = async () => {
        if (!call || !callerInfo) return;

        onDismiss();
        await acceptCall(call, callerInfo.name, callerInfo.avatar);
    };

    const handleDecline = async () => {
        if (!call) return;

        onDismiss();
        await declineCall(call);
    };

    if (!call || !callerInfo) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleDecline}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Caller Avatar */}
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri: callerInfo.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
                            }}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Caller Name */}
                    <Text style={styles.callerName}>{callerInfo.name}</Text>
                    <Text style={styles.callText}>Incoming Video Call...</Text>

                    {/* Action Buttons */}
                    <View style={styles.buttonsContainer}>
                        {/* Decline Button */}
                        <TouchableOpacity
                            style={[styles.button, styles.declineButton]}
                            onPress={handleDecline}
                        >
                            <PhoneOff size={28} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Decline</Text>
                        </TouchableOpacity>

                        {/* Accept Button */}
                        <TouchableOpacity
                            style={[styles.button, styles.acceptButton]}
                            onPress={handleAccept}
                        >
                            <Phone size={28} color="#FFFFFF" />
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 16,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 4,
        borderColor: '#10B981',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    callerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    callText: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    button: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    declineButton: {
        backgroundColor: '#EF4444',
    },
    acceptButton: {
        backgroundColor: '#10B981',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 8,
    },
});
