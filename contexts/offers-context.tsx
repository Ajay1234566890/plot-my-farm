import React, { createContext, ReactNode, useContext, useState } from 'react';

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
  addOffer: (offer: Omit<Offer, 'id' | 'daysAgo' | 'buyers' | 'status'>) => void;
  updateOffer: (id: number, offer: Partial<Offer>) => void;
  deleteOffer: (id: number) => void;
}

const OffersContext = createContext<OffersContextType | undefined>(undefined);

export function OffersProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: 1,
      title: "Fresh Organic Tomatoes",
      cropType: "Tomatoes",
      price: "₹45/kg",
      quantity: "50 kg",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      status: "active",
      daysAgo: 2,
      buyers: 5
    },
    {
      id: 2,
      title: "Farm Fresh Carrots",
      cropType: "Carrots",
      price: "₹30/kg",
      quantity: "30 kg",
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      status: "active",
      daysAgo: 5,
      buyers: 3
    },
    {
      id: 3,
      title: "Premium Wheat",
      cropType: "Wheat",
      price: "₹25/kg",
      quantity: "100 kg",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      status: "sold",
      daysAgo: 7,
      buyers: 8
    },
  ]);

  const addOffer = (newOffer: Omit<Offer, 'id' | 'daysAgo' | 'buyers' | 'status'>) => {
    const offer: Offer = {
      ...newOffer,
      id: Math.max(...offers.map(o => o.id), 0) + 1,
      status: 'active',
      daysAgo: 0,
      buyers: 0,
    };
    setOffers(prevOffers => [offer, ...prevOffers]);
  };

  const updateOffer = (id: number, updatedOffer: Partial<Offer>) => {
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer.id === id ? { ...offer, ...updatedOffer } : offer
      )
    );
  };

  const deleteOffer = (id: number) => {
    setOffers(prevOffers => prevOffers.filter(offer => offer.id !== id));
  };

  return (
    <OffersContext.Provider value={{ offers, addOffer, updateOffer, deleteOffer }}>
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

