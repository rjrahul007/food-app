import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";


const SearchBar = () => {
    const params = useLocalSearchParams<{query?: string}>();
    const [query, setQuery] = useState(params.query || '');

    // const debounceSearch = useDebouncedCallback((text: string) => {
    //     // router.setParams({ query: text });
    //     router.push(`/search`)
    // }, 500);

    const handleChange = (text: string) => {
        setQuery(text);
        if(!text.trim()) router.setParams({ query: undefined });
    }

    const handleSubmit = () => {
        if(query.trim()) router.setParams({query});
    }


  return (
    <View className="searchbar">
      <TextInput 
      className="flex-1 p-5"
      placeholder="Search for pizza, burger..."
      value={query}
      onChangeText={handleChange}
      onSubmitEditing={handleSubmit}
      placeholderTextColor={"#B0B0B0"}
      returnKeyType="search"
      />
        <TouchableOpacity
        className="p-5"
        onPress={() => {router.setParams({query})}}
        >
        <Image source={images.search} className="size-6" 
        resizeMode="contain"
        tintColor={"#5d5f6d"}
        />
        </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
