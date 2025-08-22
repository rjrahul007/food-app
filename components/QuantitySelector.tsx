import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onDecrease,
  onIncrease
}) => {
  return (
    <View 
      className="flex-row items-center bg-gray-50 rounded-2xl"
      style={{ paddingHorizontal: 6, paddingVertical: 6 }}
    >
      <TouchableOpacity 
        onPress={onDecrease}
        className="w-10 h-10 items-center justify-center rounded-xl bg-white"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Text className="text-xl font-bold text-orange-500">−</Text>
      </TouchableOpacity>
      
      <Text className="mx-6 text-2xl font-bold text-gray-900 min-w-[40px] text-center">
        {quantity}
      </Text>
      
      <TouchableOpacity 
        onPress={onIncrease}
        className="w-10 h-10 items-center justify-center rounded-xl bg-white"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Text className="text-xl font-bold text-orange-500">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuantitySelector;