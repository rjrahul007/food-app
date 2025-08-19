import { images } from '@/constants';
import { useCartStore } from '@/store/cart.store';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ToppingOption {
  id: string;
  name: string;
  emoji: string;
  selected: boolean;
}

interface SideOption {
  id: string;
  name: string;
  emoji: string;
  selected: boolean;
}

const MenuDetails: React.FC = () => {
  const [quantity, setQuantity] = useState(2);
  const [toppings, setToppings] = useState<ToppingOption[]>([
    { id: '1', name: 'Tomato', emoji: '🍅', selected: true },
    { id: '2', name: 'Onions', emoji: '🧅', selected: false },
    { id: '3', name: 'Cheese', emoji: '🧀', selected: true },
    { id: '4', name: 'Bacon', emoji: '🥓', selected: false },
  ]);
  
  const [sides, setSides] = useState<SideOption[]>([
    { id: '1', name: 'Fries', emoji: '🍟', selected: true },
    { id: '2', name: 'Coleslaw', emoji: '🥗', selected: false },
    { id: '3', name: 'Salad', emoji: '🥬', selected: false },
    { id: '4', name: 'Pringles', emoji: '🥨', selected: false },
  ]);

  const toggleTopping = (id: string) => {
    setToppings(prev => 
      prev.map(topping => 
        topping.id === id ? { ...topping, selected: !topping.selected } : topping
      )
    );
  };

  const toggleSide = (id: string) => {
    setSides(prev => 
      prev.map(side => 
        side.id === id ? { ...side, selected: !side.selected } : side
      )
    );
  };

  const { increaseQty, decreaseQty, removeItem } = useCartStore();
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const totalPrice = (10.02 * quantity).toFixed(2);

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons 
            key={star} 
            name="star" 
            size={14} 
            color="#FFB800" 
            style={{ marginRight: 1 }}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <SafeAreaView>
        <View className="flex-row items-center justify-between px-5 py-3">
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Ionicons name="search" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section - Two Column Layout */}
        <View className="px-5 pb-6">
          <View className="flex-row">
            {/* Left Column - Product Info */}
            <View className="flex-1 pr-4">
              <Text className="text-3xl font-bold text-gray-900 leading-tight">
                Wendy&apos;s Burger
              </Text>
              <Text className="text-gray-500 mt-2 text-base">Cheeseburger</Text>
              
              {/* Rating */}
              <View className="flex-row items-center mt-3">
                {renderStars(4.9)}
                <Text className="ml-2 text-gray-600 font-medium">4.9/5</Text>
              </View>
              
              {/* Price */}
              <Text className="text-4xl font-bold text-orange-500 mt-4">
                $10.02
              </Text>

              {/* Nutrition Info Grid */}
              <View className="mt-6">
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className="text-gray-400 text-sm font-medium">Calories</Text>
                    <Text className="text-gray-900 font-bold text-lg mt-1">365 Cal</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-400 text-sm font-medium">Protein</Text>
                    <Text className="text-gray-900 font-bold text-lg mt-1">35g</Text>
                  </View>
                </View>
                
                <View className="mt-4">
                  <Text className="text-gray-400 text-sm font-medium">Bun Type</Text>
                  <Text className="text-gray-900 font-bold text-lg mt-1">Whole Wheat</Text>
                </View>
              </View>
            </View>

            {/* Right Column - Burger Image */}
            <View className="w-48 h-48">
              <View className="w-full h-full rounded-3xl overflow-hidden shadow-lg">
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&crop=center' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* Delivery Info Cards */}
          <View className="flex-row justify-between mt-8 space-x-3">
            <View className="flex-1 bg-yellow-50 rounded-2xl px-4 py-3 flex-row items-center">
              <Text className="text-2xl mr-2">💰</Text>
              <Text className="text-yellow-800 font-semibold text-sm">Free Delivery</Text>
            </View>
            <View className="flex-1 bg-orange-50 rounded-2xl px-4 py-3 flex-row items-center">
              <Text className="text-2xl mr-2">⏰</Text>
              <Text className="text-orange-800 font-semibold text-sm">20 - 30 mins</Text>
            </View>
            <View className="flex-1 bg-amber-50 rounded-2xl px-4 py-3 flex-row items-center">
              <Text className="text-2xl mr-2">⭐</Text>
              <Text className="text-amber-800 font-semibold text-sm">4.5</Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-gray-600 mt-6 leading-7 text-base">
            The Cheeseburger Wendy&apos;s Burger is a classic fast food burger that packs a punch of flavor in every bite. Made with a juicy beef patty cooked to perfection, it&apos;s topped with melted American cheese, crispy lettuce, tomato, & crunchy pickles.
          </Text>
        </View>

        {/* Toppings Section */}
        <View className="px-5 pb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-5">Toppings</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-4">
              {toppings.map((topping, index) => (
                <View key={topping.id} className="items-center">
                  <TouchableOpacity
                    onPress={() => toggleTopping(topping.id)}
                    className={`w-20 h-20 rounded-2xl items-center justify-center shadow-sm ${
                      topping.selected 
                        ? 'bg-gray-900' 
                        : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Text className="text-3xl">{topping.emoji}</Text>
                  </TouchableOpacity>
                  <View className="flex-row items-center mt-3">
                    <Text className={`font-medium text-sm ${
                      topping.selected ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {topping.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleTopping(topping.id)}
                      className={`ml-3 w-6 h-6 rounded-full items-center justify-center ${
                        topping.selected ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    >
                      <Ionicons 
                        name={topping.selected ? "remove" : "add"} 
                        size={14} 
                        color="white" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Side Options Section */}
        <View className="px-5 pb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-5">Side options</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-4">
              {sides.map((side) => (
                <View key={side.id} className="items-center">
                  <TouchableOpacity
                    onPress={() => toggleSide(side.id)}
                    className={`w-20 h-20 rounded-2xl items-center justify-center shadow-sm ${
                      side.selected 
                        ? 'bg-gray-900' 
                        : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Text className="text-3xl">{side.emoji}</Text>
                  </TouchableOpacity>
                  <View className="flex-row items-center mt-3">
                    <Text className={`font-medium text-sm ${
                      side.selected ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {side.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => toggleSide(side.id)}
                      className={`ml-3 w-6 h-6 rounded-full items-center justify-center ${
                        side.selected ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    >
                      <Ionicons 
                        name={side.selected ? "remove" : "add"} 
                        size={14} 
                        color="white" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Quantity and Add to Cart Section */}
        <View className="px-5 pb-8" style={{ elevation: 5 }}>
          <View className="flex-row items-center justify-between">
            {/* Premium Quantity Selector */}
            <View className="flex-row items-center bg-gray-50 rounded-2xl p-1">
              <TouchableOpacity
                            onPress={() => decreaseQty('burger-id', [])}
                            className="cart-item__actions"
                        >
                            <Image
                                source={images.minus}
                                className="size-5"
                                resizeMode="contain"
                                tintColor={"#FF9C01"}
                            />
                        </TouchableOpacity>
              <Text className="mx-6 text-2xl font-bold text-gray-900">{quantity}</Text>
             <TouchableOpacity
                                        onPress={() => increaseQty('burger-id', [])}
                                        className="cart-item__actions"
                                    >
                                        <Image
                                            source={images.plus}
                                            className="size-5"
                                            resizeMode="contain"
                                            tintColor={"#FF9C01"}
                                        />
                                    </TouchableOpacity>
            </View>

            {/* Premium Add to Cart Button */}
            <TouchableOpacity 
              className="flex-1 ml-6 bg-orange-500 py-4 px-6 rounded-full flex-row items-center justify-center"
              style={{
                shadowColor: '#F97316',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
              onPress={() => router.push('/cart')}
            >
              <Ionicons name="bag-outline" size={18} color="white" />
              <Text className="text-white font-bold sm ml-3">
                Add to cart (${totalPrice})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MenuDetails;