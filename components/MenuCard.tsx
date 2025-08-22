import { useCartStore } from "@/store/cart.store";
import { MenuItem } from "@/type";
import { router } from "expo-router";
import React from "react";
import { Image, Platform, Text, TouchableOpacity } from "react-native";

const MenuCard = ({item: {$id, image_url, name, price, description, calories, protein, type, categories, menuCustomizations }}:{item: MenuItem}) => {
    // const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`
    // console.log("Image URL:", image_url);
    const {addItem} = useCartStore();
  return (
   <TouchableOpacity
  className="menu-card"
  style={Platform.OS==='android' ? {elevation: 10, shadowColor: '#878787'} : {}}
  onPress={() => {
    router.push({
      pathname: "/menu-details",
      params: { 
        id: $id, 
        name, 
        price: price.toString(), // must be string in params
        image_url,
        description, 
        calories, 
        protein, 
        type, 
        category: categories ? JSON.stringify(categories) : "{}",
        customizations: menuCustomizations ? JSON.stringify(menuCustomizations) : "[]"         
      } 
    });
  }}
>
  <Image
    source={{ uri: image_url }}
    alt="image"
    className="size-32 absolute -top-10"
    resizeMode="contain"
  />
  <Text className="text-center base-bold-100 mb-2" numberOfLines={1}>
    {name}
  </Text>
  <Text className="body-regular text-gray-200 mb-4">From ${price}</Text>

  <TouchableOpacity
    onPress={() =>
      addItem({ $id, name, image_url, price, customizations: [] })
    }
  >
    <Text className="paragraph-bold text-primary">Add to Cart +</Text>
  </TouchableOpacity>
</TouchableOpacity>

  );
};

export default MenuCard;
