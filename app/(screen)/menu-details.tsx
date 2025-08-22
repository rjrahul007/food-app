import CustomizationItem from '@/components/CustomizationItem';
import { images } from '@/constants';
import { useCartStore } from '@/store/cart.store';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

interface CustomizationType {
  id: string;
  name: string;
  price: number;
  type: string;
  image: any;
  selected: boolean;
}

const MenuDetails: React.FC = () => {
  const { 
    id, 
    name, 
    price, 
    image_url, 
    description, 
    calories, 
    protein, 
    type, 
    category, 
    customizations 
  } = useLocalSearchParams<{
    id: string;
    name: string;
    price: string;
    image_url: string;
    description: string;
    calories: string;
    protein: string;
    type: string;
    category: string;
    customizations: string;
  }>();

  // console.log("Menu Details Params:", JSON.stringify({
  //   id,
  //   name,
  //   price,
  //   image_url,
  //   description,
  //   calories,
  //   protein,
  //   type,
  //   category,
  //   customizations
  // }, null, 2));

  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  // Parse customizations with proper error handling for nested structure
  const availableCustomizations = useMemo(() => {
    try {
      const parsed = JSON.parse(customizations || '[]');
      // console.log('Parsed customizations:', parsed);
      
      // Handle the nested structure from your data
      const flattenedCustomizations = parsed.map((item: any) => ({
        id: item.$id || item.id,
        name: item.customizations?.name || item.name,
        price: item.customizations?.price || item.price || 0,
        type: item.customizations?.type || item.type
      }));
      
      // console.log('Flattened customizations:', flattenedCustomizations);
      
      // Filter out any items with missing data
      return flattenedCustomizations.filter((item: any) => item.name && item.type);
    } catch (error) {
      console.error('Error parsing customizations:', error);
      return [];
    }
  }, [customizations]);

  // Parse category with proper error handling
  const categoryData = useMemo(() => {
  try {
    const parsed = JSON.parse(category || '{}');

    return {
      name: parsed?.name || 'Food Item',
      description: parsed?.description || '',
    };
  } catch (error) {
    console.error('Error parsing category:', error);
    return {
      name: 'Food Item',
      description: '',
    };
  }
}, [category]);

  // Filter customizations by type - with better validation
  const availableToppings = useMemo(() => {
    return availableCustomizations.filter(
      (item: { type: string; name: string }) => 
        item.type === 'topping' && item.name
    );
  }, [availableCustomizations]);

  const availableSides = useMemo(() => {
    return availableCustomizations.filter(
      (item: { type: string; name: string }) => 
        item.type === 'side' && item.name
    );
  }, [availableCustomizations]);

  // Static fallback data if no customizations available
  const fallbackToppings = [
    { id: '1', name: 'Tomato', image: images.tomatoes, selected: false, price: 0, type: 'topping' },
    { id: '2', name: 'Onions', image: images.onions, selected: false, price: 0, type: 'topping' },
    { id: '3', name: 'Cheese', image: images.cheese, selected: false, price: 0, type: 'topping' },
    { id: '4', name: 'Bacon', image: images.bacon, selected: false, price: 0, type: 'topping' },
  ];

  const fallbackSides = [
    { id: '5', name: 'Fries', image: images.fries, selected: false, price: 0, type: 'side' },
    { id: '6', name: 'Coleslaw', image: images.coleslaw, selected: false, price: 0, type: 'side' },
    { id: '7', name: 'Salad', image: images.salad, selected: false, price: 0, type: 'side' },
    { id: '8', name: 'Pringles', image: images.onionRings, selected: false, price: 0, type: 'side' },
  ];

  // // Get image for customizations
  const getCustomizationImage = (name: string) => {
    const imageMap: { [key: string]: any } = {
      'tomato': images.tomatoes,
      'tomatoes': images.tomatoes,
      'onions': images.onions,
      'onion': images.onions,
      'cheese': images.cheese,
      'bacon': images.bacon,
      'bacons': images.bacon,
      'fries': images.fries,
      'coleslaw': images.coleslaw,
      'salad': images.salad,
      'onion rings': images.onionRings,
      'pringles': images.onionRings,
      'mozzarella sticks': images.cheese,
      'iced tea': images.coleslaw,
      'coke': images.coke,
      'jalapeños': images.jalapenos,
      'olives': images.olives,
      'extra cheese': images.cheese,
      'garlic bread': images.garlicBread,
      'potato wedges': images.fries,
      'chicken nuggets': images.chickenNuggets,
      'sweet corn': images.sweetCorn,
    };
    return imageMap[name.toLowerCase()] || images.avocado;
  };

  // Initialize customizations state
  const [toppings, setToppings] = useState<CustomizationType[]>(() => {
    if (availableToppings.length > 0) {
      return availableToppings.map((item, index) => ({
        id: item.id || `topping_${index}`,
        name: item.name,
        price: item.price || 0,
        type: 'topping',
        image: getCustomizationImage(item.name),
        selected: false
      }));
    }
    return fallbackToppings;
  });

  const [sides, setSides] = useState<CustomizationType[]>(() => {
    if (availableSides.length > 0) {
      return availableSides.map((item, index) => ({
        id: item.id || `side_${index}`,
        name: item.name,
        price: item.price || 0,
        type: 'side',
        image: getCustomizationImage(item.name),
        selected: false
      }));
    }
    return fallbackSides;
  });

  // Update toppings and sides when availableCustomizations changes
  React.useEffect(() => {
    if (availableToppings.length > 0) {
      setToppings(availableToppings.map((item, index) => ({
        id: item.id || `topping_${index}`,
        name: item.name,
        price: item.price || 0,
        type: 'topping',
        image: getCustomizationImage(item.name),
        selected: false
      })));
    }
  }, [availableToppings]);

  React.useEffect(() => {
    if (availableSides.length > 0) {
      setSides(availableSides.map((item, index) => ({
        id: item.id || `side_${index}`,
        name: item.name,
        price: item.price || 0,
        type: 'side',
        image: getCustomizationImage(item.name),
        selected: false
      })));
    }
  }, [availableSides]);

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

  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const incrementQuantity = () => setQuantity((prev) => prev + 1);

  // Calculate total price with validation
  const totalPrice = useMemo(() => {
    const basePrice = parseFloat(price || '0');
    const toppingsPrice = toppings
      .filter(t => t.selected)
      .reduce((sum, t) => sum + (t.price || 0), 0);
    const sidesPrice = sides
      .filter(s => s.selected)
      .reduce((sum, s) => sum + (s.price || 0), 0);
    
    const itemTotal = basePrice + toppingsPrice + sidesPrice;
    return (itemTotal * quantity).toFixed(2);
  }, [price, toppings, sides, quantity]);

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name="star"
            size={16}
            color="#FFB800"
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  const handleAddToCart = () => {
    const selectedToppings = toppings
      .filter(t => t.selected)
      .map(t => ({
        id: t.id,
        name: t.name,
        price: t.price || 0,
        type: 'topping'
      }));
    
    const selectedSides = sides
      .filter(s => s.selected)
      .map(s => ({
        id: s.id,
        name: s.name,
        price: s.price || 0,
        type: 'side'
      }));

    const customizations = [...selectedToppings, ...selectedSides];
    
    // Calculate the item total price (base + customizations) for a single item
    const basePrice = parseFloat(price || '0');
    // const customizationsPrice = customizations.reduce((sum, custom) => sum + custom.price, 0);
    // const itemTotalPrice = basePrice + customizationsPrice;

    // addItem({
    //   $id: id,
    //   name: name || 'Unknown Item',
    //   image_url: image_url || '',
    //   price: itemTotalPrice,
    //   quantity,
    //   customizations,
    // });



     for (let i = 0; i < quantity; i++) {
      addItem({
        id: id, // Use 'id' instead of '$id' to match your cart store
        name: name || 'Unknown Item',
        image_url: image_url || '',
        price: basePrice, // Only pass the base price
        customizations, // Cart store will calculate total with customizations
      });
    }


    router.push('/cart');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <SafeAreaView>
        <View className="flex-row items-center justify-between px-5 py-3">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Ionicons name="search" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="px-5 pb-6">
          <View className="flex-row">
            {/* Left Column - Product Info */}
            <View className="flex-1 pr-4">
              <Text className="text-3xl font-bold text-gray-900 leading-tight">
                {name || 'Menu Item'}
              </Text>
              <Text className="text-gray-500 mt-2 text-base">{categoryData.name}</Text>

              {/* Rating */}
              <View className="flex-row items-center mt-3">
                {renderStars(4.9)}
                <Text className="ml-2 text-gray-600 font-medium">4.5/5</Text>
              </View>

              {/* Price */}
              <Text className="text-4xl font-bold text-orange-500 mt-4">
                ${price || '0.00'}
              </Text>

              {/* Nutrition Info Grid */}
              <View className="mt-6">
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className="text-gray-400 text-sm font-medium">Calories</Text>
                    <Text className="text-gray-900 font-bold text-lg mt-1">
                      {calories ? `${calories} Cal` : '610 Cal'}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-400 text-sm font-medium">Protein</Text>
                    <Text className="text-gray-900 font-bold text-lg mt-1">
                      {protein ? `${protein}g` : '31g'}
                    </Text>
                  </View>
                </View>
                
                <View className="mt-4">
                  <Text className="text-gray-400 text-sm font-medium">Type</Text>
                  <Text className="text-gray-900 font-bold text-lg mt-1">
                    {name || 'Food Item'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Right Column - Image */}
            <View className="w-52 h-52">
              <View className="w-full h-full rounded-3xl overflow-hidden">
                <Image
                  source={{ uri: image_url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>

          {/* Delivery Info Cards */}
          <View className="flex-row justify-between mt-8 space-x-3 gap-2">
            <View className="flex-1 bg-yellow-50 rounded-2xl px-4 py-3 flex-row items-center justify-center">
              <Text className="text-xl mr-2">💰</Text>
              <Text className="text-yellow-800 font-semibold text-sm">Free Delivery</Text>
            </View>
            <View className="flex-1 bg-orange-50 rounded-2xl px-4 py-3 flex-row items-center justify-center">
              <Text className="text-xl mr-2">⏰</Text>
              <Text className="text-orange-800 font-semibold text-sm">20 - 30 mins</Text>
            </View>
            <View className="flex-1 bg-amber-50 rounded-2xl px-4 py-3 flex-row items-center justify-center">
              <Text className="text-xl mr-2">⭐</Text>
              <Text className="text-amber-800 font-semibold text-sm">4.5</Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-gray-600 mt-6 leading-7 text-base">
            { categoryData.description  + ' with ' + description || `The ${categoryData.name} ${name} is a delicious item made with quality ingredients and prepared fresh for your enjoyment.`}
          </Text>
        </View>

        {/* Toppings Section */}
        {toppings.length > 0 && (
          <View className="px-5 pb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-5">Toppings</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row pl-1">
                {toppings.map((topping) => (
                  <CustomizationItem
                    key={topping.id}
                    id={topping.id}
                    name={topping.name}
                    price={topping.price || 0}
                    image={topping.image}
                    selected={topping.selected}
                    onToggle={toggleTopping}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Side Options Section */}
        {sides.length > 0 && (
          <View className="px-5 pb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-5">Side options</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row pl-1">
                {sides.map((side) => (
                  <CustomizationItem
                    key={side.id}
                    id={side.id}
                    name={side.name}
                    price={side.price || 0}
                    image={side.image}
                    selected={side.selected}
                    onToggle={toggleSide}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Quantity and Add to Cart Section */}
        <View className="px-5 pb-8">
          <View className="flex-row items-center justify-between">
            {/* Quantity Selector */}
            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-2">
              <TouchableOpacity 
                onPress={decrementQuantity}
                className="w-8 h-8 items-center justify-center"
              >
                <Text className="text-2xl font-bold text-orange-500">−</Text>
              </TouchableOpacity>
              <Text className="mx-6 text-2xl font-bold text-gray-900">
                {quantity}
              </Text>
              <TouchableOpacity 
                onPress={incrementQuantity}
                className="w-8 h-8 items-center justify-center"
              >
                <Text className="text-2xl font-bold text-orange-500">+</Text>
              </TouchableOpacity>
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity
              className="flex-1 ml-6 bg-orange-500 py-4 px-6 rounded-full flex-row items-center justify-center"
              style={{
                shadowColor: '#F97316',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
              onPress={handleAddToCart}
            >
              <Ionicons name="bag-outline" size={18} color="white" />
              <Text className="text-white font-bold text-base ml-3">
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