import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface CustomizationItemProps {
  id: string;
  name: string;
  price: number;
  image: any;
  selected: boolean;
  onToggle: (id: string) => void;
}

const CustomizationItem: React.FC<CustomizationItemProps> = ({
  id,
  name,
  price,
  image,
  selected,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onToggle(id)}
      activeOpacity={0.9}
      className="mr-4"
    >
      {/* Card container */}
      <View
        className="w-24 rounded-2xl overflow-hidden bg-neutral-900"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        {/* Top section (image) */}
        <View className="bg-white w-full h-20 items-center justify-center rounded-2xl">
          <Image
            source={image}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </View>

        {/* Bottom section (name + plus button) */}
        <View className="bg-neutral-900 px-2 py-2 flex-row items-center justify-between rounded-b-2xl">
          <Text
            className="text-white text-xs font-medium flex-1"
            numberOfLines={1}
          >
            {name}
          </Text>

          <View
            className={`w-5 h-5 rounded-full items-center justify-center ${
              selected ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <Ionicons
              name={selected ? 'checkmark' : 'add'}
              size={12}
              color="white"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomizationItem;
