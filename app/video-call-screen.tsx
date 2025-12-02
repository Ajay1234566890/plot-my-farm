import { useCalls } from '@/hooks/useCalls';
import agoraService from '@/services/agora-service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Camera,
    CameraOff,
    Mic,
    MicOff,
    PhoneOff,
    RefreshCw,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RtcSurfaceView, VideoSourceType } from 'react-native-agora';

export default function VideoCallScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { endCall } = useCalls();

    const [remoteUid, setRemoteUid] = useState<number | null>(null);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [isJoined, setIsJoined] = useState(false);

    const callId = params.callId as string;
    const channel = params.channel as string;
    const token = params.token as string;
    const uid = parseInt(params.uid as string, 10);
    const otherUserName = params.otherUserName as string;

    useEffect(() => {
        setupCall();

        return () => {
            cleanup();
        };
    }, []);

    // Call duration timer
    useEffect(() => {
        if (!isJoined) return;

        const interval = setInterval(() => {
            setCallDuration((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isJoined]);

    const setupCall = async () => {
        try {
            // Register event handlers
            agoraService.registerEventHandlers({
                UserJoined: (connection, remoteUid) => {
                    console.log('User joined:', remoteUid);
                    setRemoteUid(remoteUid);
                },
                UserOffline: (connection, remoteUid, reason) => {
                    console.log('User offline:', remoteUid, reason);
                    setRemoteUid(null);
                },
                JoinChannelSuccess: (connection, elapsed) => {
                    console.log('Join channel success');
                    setIsJoined(true);
                },
                LeaveChannel: (connection, stats) => {
                    console.log('Left channel');
                    setIsJoined(false);
                },
                Error: (err, msg) => {
                    console.error('Agora error:', err, msg);
                },
            });

            // Join channel
            await agoraService.joinChannel(token, channel, uid);
        } catch (error) {
            console.error('Setup call error:', error);
            handleEndCall();
        }
    };

    const cleanup = async () => {
        try {
            agoraService.removeEventHandlers();
            await agoraService.leaveChannel();
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    };

    const handleEndCall = async () => {
        await endCall(callId);
        router.back();
    };

    const toggleAudio = async () => {
        const newState = !isAudioMuted;
        await agoraService.muteLocalAudio(newState);
        setIsAudioMuted(newState);
    };

    const toggleVideo = async () => {
        const newState = !isVideoMuted;
        await agoraService.enableLocalVideo(!newState);
        setIsVideoMuted(newState);
    };

    const switchCamera = async () => {
        await agoraService.switchCamera();
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Remote Video */}
            <View style={styles.remoteVideoContainer}>
                {remoteUid ? (
                    <RtcSurfaceView
                        canvas={{ uid: remoteUid, sourceType: VideoSourceType.VideoSourceRemote }}
                        style={styles.remoteVideo}
                    />
                ) : (
                    <View style={styles.waitingContainer}>
                        <Text style={styles.waitingText}>Waiting for {otherUserName}...</Text>
                    </View>
                )}
            </View>

            {/* Local Video (Picture-in-Picture) */}
            <View style={styles.localVideoContainer}>
                {!isVideoMuted ? (
                    <RtcSurfaceView
                        canvas={{ uid: 0, sourceType: VideoSourceType.VideoSourceCamera }}
                        style={styles.localVideo}
                    />
                ) : (
                    <View style={styles.localVideoOff}>
                        <CameraOff size={32} color="#FFFFFF" />
                    </View>
                )}
            </View>

            {/* Call Info */}
            <View style={styles.callInfo}>
                <Text style={styles.userName}>{otherUserName}</Text>
                <Text style={styles.duration}>{formatDuration(callDuration)}</Text>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                {/* Mute Audio */}
                <TouchableOpacity
                    style={[styles.controlButton, isAudioMuted && styles.controlButtonActive]}
                    onPress={toggleAudio}
                >
                    {isAudioMuted ? (
                        <MicOff size={28} color="#FFFFFF" />
                    ) : (
                        <Mic size={28} color="#FFFFFF" />
                    )}
                </TouchableOpacity>

                {/* End Call */}
                <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
                    <PhoneOff size={32} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Toggle Video */}
                <TouchableOpacity
                    style={[styles.controlButton, isVideoMuted && styles.controlButtonActive]}
                    onPress={toggleVideo}
                >
                    {isVideoMuted ? (
                        <CameraOff size={28} color="#FFFFFF" />
                    ) : (
                        <Camera size={28} color="#FFFFFF" />
                    )}
                </TouchableOpacity>

                {/* Switch Camera */}
                <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
                    <RefreshCw size={28} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    remoteVideoContainer: {
        flex: 1,
    },
    remoteVideo: {
        flex: 1,
    },
    waitingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F2937',
    },
    waitingText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    localVideoContainer: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: 120,
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    localVideo: {
        flex: 1,
    },
    localVideoOff: {
        flex: 1,
        backgroundColor: '#374151',
        justifyContent: 'center',
        alignItems: 'center',
    },
    callInfo: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    duration: {
        color: '#D1D5DB',
        fontSize: 14,
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        paddingHorizontal: 20,
    },
    controlButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(75, 85, 99, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    controlButtonActive: {
        backgroundColor: '#EF4444',
    },
    endCallButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
});
