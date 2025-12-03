import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/utils/supabase';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Offer {
  id: number;
  title: string;
  cropType: string;
  price: string;
  quantity: string;
  image: string;
  status: 'active' | 'sold' | 'expired';
  daysAgo: number;
  buyers: number;
}

interface OffersContextType {
  offers: Offer[];
  loading: boolean;
  refreshOffers: () => Promise<void>;
  addOffer: (offer: Omit<Offer, 'id' | 'daysAgo' | 'buyers' | 'status'>) => Promise<void>;
  updateOffer: (id: number, offer: Partial<Offer>) => Promise<void>;
  deleteOffer: (id: number) => Promise<void>;
}

const OffersContext = createContext<OffersContextType | undefined>(undefined);

export function OffersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('farmer_offers')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching offers:', error);
        return;
      }

      if (data) {
        const mappedOffers: Offer[] = data.map((item: any) => {
          // Calculate days ago
          const createdDate = new Date(item.created_at);
          const today = new Date();
          const diffTime = Math.abs(today.getTime() - createdDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return {
            id: item.id,
            title: item.title,
            cropType: item.crop_type,
            price: `₹${item.price}/${item.unit || 'kg'}`,
            quantity: `${item.quantity} ${item.unit || 'kg'}`,
            image: item.image_url || 'https://via.placeholder.com/150',
            status: item.status,
            daysAgo: diffDays,
            buyers: 0, // Mock for now as we don't have buyers count in offers table yet
          };
        });
        setOffers(mappedOffers);
      }
    } catch (error) {
      console.error('Error in fetchOffers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [user]);

  const refreshOffers = async () => {
    await fetchOffers();
  };

  const addOffer = async (newOffer: Omit<Offer, 'id' | 'daysAgo' | 'buyers' | 'status'>) => {
    // This is now handled directly in add-offer.tsx, but we keep this for compatibility or future use
    // If used, it should insert into Supabase
    await fetchOffers();
  };

  const updateOffer = async (id: number, updatedOffer: Partial<Offer>) => {
    // This is now handled directly in add-offer.tsx
    await fetchOffers();
  };

  const deleteOffer = async (id: number) => {
    try {
      const { error } = await supabase
        .from('farmer_offers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setOffers(prevOffers => prevOffers.filter(offer => offer.id !== id));
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  return (
    <OffersContext.Provider value={{ offers, loading, refreshOffers, addOffer, updateOffer, deleteOffer }}>
      {children}
    </OffersContext.Provider>
  );
}

export function useOffers() {
  const context = useContext(OffersContext);
  if (context === undefined) {
    throw new Error('useOffers must be used within an OffersProvider');
  }
  return context;
}

