import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '@/utils/supabase';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

export default function TestDatabase() {
  const [results, setResults] = useState<TestResult[]>([
    { name: 'Database Connection', status: 'pending', message: 'Testing...' },
    { name: 'Users Table', status: 'pending', message: 'Testing...' },
    { name: 'Crops Table', status: 'pending', message: 'Testing...' },
    { name: 'Offers Table', status: 'pending', message: 'Testing...' },
    { name: 'Orders Table', status: 'pending', message: 'Testing...' },
    { name: 'Storage Buckets', status: 'pending', message: 'Testing...' },
  ]);

  useEffect(() => {
    runTests();
  }, []);

  const updateResult = (index: number, status: 'success' | 'error', message: string) => {
    setResults(prev => {
      const newResults = [...prev];
      newResults[index] = { ...newResults[index], status, message };
      return newResults;
    });
  };

  const runTests = async () => {
    try {
      // Test 1: Database Connection
      console.log('Testing database connection...');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });

      if (connectionError) {
        updateResult(0, 'error', `Connection failed: ${connectionError.message}`);
      } else {
        updateResult(0, 'success', 'Connected to Supabase');
      }

      // Test 2: Users Table
      console.log('Testing users table...');
      const { data: users, error: usersError, count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .limit(1);

      if (usersError) {
        updateResult(1, 'error', `Error: ${usersError.message}`);
      } else {
        updateResult(1, 'success', `Found ${usersCount || 0} users`);
      }

      // Test 3: Crops Table
      console.log('Testing crops table...');
      const { data: crops, error: cropsError, count: cropsCount } = await supabase
        .from('crops')
        .select('*', { count: 'exact' })
        .limit(1);

      if (cropsError) {
        updateResult(2, 'error', `Error: ${cropsError.message}`);
      } else {
        updateResult(2, 'success', `Found ${cropsCount || 0} crops`);
      }

      // Test 4: Offers Table
      console.log('Testing offers table...');
      const { data: offers, error: offersError, count: offersCount } = await supabase
        .from('offers')
        .select('*', { count: 'exact' })
        .limit(1);

      if (offersError) {
        updateResult(3, 'error', `Error: ${offersError.message}`);
      } else {
        updateResult(3, 'success', `Found ${offersCount || 0} offers`);
      }

      // Test 5: Orders Table
      console.log('Testing orders table...');
      const { data: orders, error: ordersError, count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .limit(1);

      if (ordersError) {
        updateResult(4, 'error', `Error: ${ordersError.message}`);
      } else {
        updateResult(4, 'success', `Found ${ordersCount || 0} orders`);
      }

      // Test 6: Storage Buckets
      console.log('Testing storage buckets...');
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

      if (bucketsError) {
        updateResult(5, 'error', `Error: ${bucketsError.message}`);
      } else {
        const bucketNames = buckets?.map(b => b.name).join(', ') || 'None';
        updateResult(5, 'success', `Found ${buckets?.length || 0} buckets`);
      }
    } catch (error) {
      console.error('Test error:', error);
      updateResult(0, 'error', `Fatal error: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      default:
        return '#FFC107';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-3xl font-bold mb-2 text-gray-800">Database Tests</Text>
        <Text className="text-gray-600 mb-6">Verify Supabase connectivity and tables</Text>

        {results.map((result, index) => (
          <View
            key={index}
            className="mb-4 p-4 rounded-lg border-2"
            style={{ borderColor: getStatusColor(result.status) }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-semibold text-gray-800">
                {getStatusIcon(result.status)} {result.name}
              </Text>
              {result.status === 'pending' && <ActivityIndicator color="#FFC107" />}
            </View>
            <Text className="text-gray-600">{result.message}</Text>
          </View>
        ))}

        <TouchableOpacity
          onPress={runTests}
          className="mt-6 bg-blue-500 p-4 rounded-lg"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Run Tests Again
          </Text>
        </TouchableOpacity>

        <View className="mt-8 p-4 bg-gray-100 rounded-lg">
          <Text className="text-sm text-gray-700 font-mono">
            {`Supabase URL: ${process.env.EXPO_PUBLIC_SUPABASE_URL?.substring(0, 30)}...`}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

