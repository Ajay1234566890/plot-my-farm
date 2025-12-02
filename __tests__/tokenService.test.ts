import axios from 'axios';
import { fetchToken } from '../services/token-service';
import { supabase } from '../utils/supabase';

// Mock axios and supabase
jest.mock('axios');
jest.mock('../utils/supabase', () => ({
    supabase: {
        auth: {
            getSession: jest.fn(),
        },
    },
}));

describe('tokenService', () => {
    const mockToken = 'mock-jwt-token';
    const mockSession = { access_token: mockToken };
    const mockResponse = {
        data: {
            appId: 'test-app-id',
            token: 'test-agora-token',
            channel: 'test-channel',
            uid: 12345,
            expiresAt: '2024-01-01T00:00:00Z',
            ttl: 120,
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetchToken should return token data on success', async () => {
        // Mock Supabase session
        (supabase.auth.getSession as jest.Mock).mockResolvedValue({
            data: { session: mockSession },
            error: null,
        });

        // Mock Axios response
        (axios.get as jest.Mock).mockResolvedValue(mockResponse);

        const result = await fetchToken('test-channel', 12345, 'publisher');

        expect(supabase.auth.getSession).toHaveBeenCalled();
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/api/token'),
            expect.objectContaining({
                params: { channel: 'test-channel', uid: 12345, role: 'publisher' },
                headers: { Authorization: `Bearer ${mockToken}` },
            })
        );
        expect(result.data).toEqual(mockResponse.data);
        expect(result.error).toBeNull();
    });

    it('fetchToken should return error if no session', async () => {
        // Mock no session
        (supabase.auth.getSession as jest.Mock).mockResolvedValue({
            data: { session: null },
            error: null,
        });

        const result = await fetchToken('test-channel', 12345);

        expect(axios.get).not.toHaveBeenCalled();
        expect(result.data).toBeNull();
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe('No active session');
    });

    it('fetchToken should return error on API failure', async () => {
        // Mock session
        (supabase.auth.getSession as jest.Mock).mockResolvedValue({
            data: { session: mockSession },
            error: null,
        });

        // Mock API error
        const apiError = new Error('Network Error');
        (axios.get as jest.Mock).mockRejectedValue(apiError);

        const result = await fetchToken('test-channel', 12345);

        expect(result.data).toBeNull();
        expect(result.error).toBe(apiError);
    });
});
