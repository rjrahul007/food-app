import { getMenu } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const {data} = useAppwrite({
    fn: getMenu, 
    params: {
      category: "", 
      query: "", 
      limit: 6
    }});
    
  return (
    <SafeAreaView>
      <Text>search</Text>
  
    </SafeAreaView>
  );
};

export default Search;


{/* <Button title='Seed' onPress={()=> seed().catch((e)=> console.log("Failed to seed the database", e) )}/> */}
