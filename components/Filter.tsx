import { Category } from "@/type";
import cn from 'clsx';
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity } from "react-native";

const Filter = ({categories}:{categories: Category[]}) => {
    const searchParams = useLocalSearchParams<{query?:string, category?:string}>();
    const [active, setActive] = useState(searchParams.category ?? '');

    const handlePress = (id: string) => {
        setActive(id);
        if(id === 'all') {
            // Reset the category filter
            router.setParams({category : undefined});
        } else {
            // Set the selected category
            router.setParams({category : id});
        }
    }

    const filterData: (Category | {$id: string; name: string})[] = categories ? [{$id: 'all', name: 'All'}, ...categories] : [{ $id: 'all', name: 'All' }];
    return(
    <FlatList
    data={filterData}
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerClassName="pb-3 gap-x-5"
    renderItem={({item}) => (
        <TouchableOpacity 
        key={item.$id}
        className={cn('filter', active === item.$id ? 'bg-amber-500': 'bg-white-100')}
        style={Platform.OS === 'android' ? {elevation: 5, shadowColor: '#878787'} : {}}
        onPress={() => handlePress(item.$id)}
        >
            <Text className={cn("body-medium", active === item.$id ? 'text-white' : 'text-gray-200')}>
                {item.name}
            </Text>
        </TouchableOpacity>
    )}
    keyExtractor={(item) => item.$id}  
    >
      <Text>Filter</Text>
    </FlatList>
  );
};

export default Filter;
