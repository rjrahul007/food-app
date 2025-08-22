import CartButton from "@/components/CartButton";
import Empty from "@/components/Empty";
import Filter from "@/components/Filter";
import MenuCard from "@/components/MenuCard";
import SearchBar from "@/components/SearchBar";
import { getCategories, getMenu } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { Category, MenuItem } from "@/type";
import cn from 'clsx';
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const {category, query} = useLocalSearchParams<{query?:string, category?:string}>();

   const { data, refetch, loading, setLoading } = useAppwrite({ fn: getMenu, params: { category: category ?? '', query: query ?? '', limit: 6, } });
  
  const {data: categories} = useAppwrite({fn: getCategories});

  useEffect(() => {
   refetch({category: category ?? '', query: query ?? '', limit: 6});

  }, [category, query]);

   const onRefresh = () => {
    setLoading(true);
    setTimeout(() => {
       refetch();
      setLoading(false);
    }, 250);
  };

  return (
    <SafeAreaView>
      <FlatList
      data={data}
      renderItem={({item, index}) => {
        const isFirstRightColItem = index % 2 === 0 && index !== 0;
        // console.log(JSON.stringify(item, null, 2))
        return(
        <View className={cn("flex-1 max-w-[48%]", !isFirstRightColItem ? 'mt-10' : 'mt-0')}>
          <MenuCard item={item as unknown as MenuItem}/>
        </View>
      )}}
      keyExtractor={(item) => item.$id}
      numColumns={2}
      columnWrapperClassName="gap-7"
      contentContainerClassName="gap-7 px-5 pb-32"
      ListHeaderComponent={
        <View className="my-5 gap-5">
          <View className="flex-between flex-row w-full">
            <View className="flex-start">
              <Text className="small-bold uppercase text-primary">Search Results</Text>
              <View className="flex-start flex-row gap-x-1 mt-0.5">
                <Text className="paragraph-semibold">Find your favorite food</Text>
              </View>
            </View>
            <CartButton/>
          </View>

          <SearchBar/>
          <Filter categories={categories as unknown as Category[]}/>
        </View>
      }
      ListEmptyComponent={()=> !loading && <Empty/>}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      />
     {loading && (
            <View className="absolute inset-0 bg-white/60 justify-center items-center z-50">
              <ActivityIndicator size="large" color="#f97316" />
              <Text className="mt-4 text-gray-500">Loading your favorite food...</Text>
            </View>
          )}
    </SafeAreaView>
  );
};

export default Search;


{/* <Button title='Seed' onPress={()=> seed().catch((e)=> console.log("Failed to seed the database", e) )}/> */}
