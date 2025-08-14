import { images } from "@/constants";
import React from "react";
import { Image, Text, View } from "react-native";

const Empty = () => {
  return (
     <View className="flex-1 justify-center items-center px-6 ">
      <View className="flex-col items-center justify-center">
        <Image 
          className="mb-2 size-52"
          alt="empty state"
          resizeMode="contain"
          source={images.emptyState} 
        />
        <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
          Nothing matched your search
        </Text>
        <Text className="text-gray-500 text-base text-center">
          Try a different search term or check for typos.
        </Text>
      </View>
    </View>
  );
};

export default Empty;
