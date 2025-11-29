import { speechToTextService } from '@/services/speech-to-text-service';
import { useState } from 'react';
import { Alert } from 'react-native';

export interface UseVoiceInputOptions {
    onTranscript?: (text: string) => void;
    language?: string;
}

export const useVoiceInput = (options: UseVoiceInputOptions = {}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const startRecording = async () => {
        try {
            setIsRecording(true);
            await speechToTextService.startRecording();
            console.log('🎤 Voice recording started');
        } catch (error) {
            console.error('Error starting recording:', error);
            Alert.alert('Error', 'Failed to start voice recording');
            setIsRecording(false);
        }
    };

    const stopRecording = async () => {
        try {
            setIsRecording(false);
            setIsProcessing(true);

            const uri = await speechToTextService.stopRecording();
            console.log('🛑 Voice recording stopped');

            if (uri) {
                const text = await speechToTextService.transcribeAudio(
                    uri,
                    options.language || 'en'
                );

                if (text) {
                    console.log('✅ Transcribed text:', text);
                    const cleanText = text.replace(/\.$/, '').trim();

                    if (options.onTranscript) {
                        options.onTranscript(cleanText);
                    }

                    setIsProcessing(false);
                    return cleanText;
                }
            }

            setIsProcessing(false);
            return null;
        } catch (error) {
            console.error('Error stopping recording:', error);
            Alert.alert('Error', 'Failed to process voice input');
            setIsProcessing(false);
            return null;
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            return await stopRecording();
        } else {
            await startRecording();
            return null;
        }
    };

    return {
        isRecording,
        isProcessing,
        startRecording,
        stopRecording,
        toggleRecording,
    };
};
