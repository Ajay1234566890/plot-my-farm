import RtcEngine, {
    ChannelProfileType,
    ClientRoleType,
    IRtcEngineEventHandler
} from 'react-native-agora';

class AgoraService {
    private engine: RtcEngine | null = null;
    private initialized: boolean = false;
    private eventHandlers: IRtcEngineEventHandler = {};

    /**
     * Initialize Agora engine
     */
    async init(appId: string): Promise<void> {
        if (this.initialized) {
            console.log('Agora already initialized');
            return;
        }

        try {
            this.engine = await RtcEngine.create(appId);
            await this.engine.enableVideo();
            await this.engine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
            await this.engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

            this.initialized = true;
            console.log('✅ Agora initialized');
        } catch (error) {
            console.error('❌ Agora init error:', error);
            throw error;
        }
    }

    /**
     * Join channel
     */
    async joinChannel(token: string, channel: string, uid: number): Promise<void> {
        if (!this.engine) {
            throw new Error('Agora engine not initialized');
        }

        try {
            await this.engine.joinChannel(token, channel, null, uid);
            console.log(`✅ Joined channel: ${channel} with uid: ${uid}`);
        } catch (error) {
            console.error('❌ Join channel error:', error);
            throw error;
        }
    }

    /**
     * Leave channel
     */
    async leaveChannel(): Promise<void> {
        if (!this.engine) {
            return;
        }

        try {
            await this.engine.leaveChannel();
            console.log('✅ Left channel');
        } catch (error) {
            console.error('❌ Leave channel error:', error);
            throw error;
        }
    }

    /**
     * Enable/disable local video
     */
    async enableLocalVideo(enable: boolean): Promise<void> {
        if (!this.engine) {
            return;
        }

        try {
            await this.engine.enableLocalVideo(enable);
        } catch (error) {
            console.error('❌ Enable local video error:', error);
            throw error;
        }
    }

    /**
     * Enable/disable local audio
     */
    async enableLocalAudio(enable: boolean): Promise<void> {
        if (!this.engine) {
            return;
        }

        try {
            await this.engine.enableLocalAudio(enable);
        } catch (error) {
            console.error('❌ Enable local audio error:', error);
            throw error;
        }
    }

    /**
     * Mute/unmute local audio
     */
    async muteLocalAudio(mute: boolean): Promise<void> {
        if (!this.engine) {
            return;
        }

        try {
            await this.engine.muteLocalAudioStream(mute);
        } catch (error) {
            console.error('❌ Mute local audio error:', error);
            throw error;
        }
    }

    /**
     * Switch camera
     */
    async switchCamera(): Promise<void> {
        if (!this.engine) {
            return;
        }

        try {
            await this.engine.switchCamera();
        } catch (error) {
            console.error('❌ Switch camera error:', error);
            throw error;
        }
    }

    /**
     * Register event handlers
     */
    registerEventHandlers(handlers: IRtcEngineEventHandler): void {
        if (!this.engine) {
            return;
        }

        this.eventHandlers = handlers;
        this.engine.addListener('UserJoined', handlers.UserJoined || (() => { }));
        this.engine.addListener('UserOffline', handlers.UserOffline || (() => { }));
        this.engine.addListener('JoinChannelSuccess', handlers.JoinChannelSuccess || (() => { }));
        this.engine.addListener('LeaveChannel', handlers.LeaveChannel || (() => { }));
        this.engine.addListener('Error', handlers.Error || (() => { }));
    }

    /**
     * Remove event handlers
     */
    removeEventHandlers(): void {
        if (!this.engine) {
            return;
        }

        this.engine.removeAllListeners();
    }

    /**
     * Destroy engine
     */
    async destroy(): Promise<void> {
        if (!this.engine) {
            return;
        }

        try {
            await this.engine.leaveChannel();
            await this.engine.destroy();
            this.engine = null;
            this.initialized = false;
            console.log('✅ Agora destroyed');
        } catch (error) {
            console.error('❌ Destroy error:', error);
        }
    }

    /**
     * Get engine instance
     */
    getEngine(): RtcEngine | null {
        return this.engine;
    }
}

export const agoraService = new AgoraService();
export default agoraService;
