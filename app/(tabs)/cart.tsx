import CartItem from "@/components/CartItem";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import { useCartStore } from "@/store/cart.store";
import { PaymentInfoStripeProps } from '@/type';
import cn from "clsx";
import { FlatList, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentInfoStripe = ({ label,  value,  labelStyle,  valueStyle, }: PaymentInfoStripeProps) => (
    <View className="flex-between flex-row my-1">
        <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
            {label}
        </Text>
        <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
            {value}
        </Text>
    </View>
);

const Cart = () => {
    const { items, getTotalItems, getTotalPrice } = useCartStore();

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={items}
                renderItem={({ item }) => <CartItem item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerClassName="pb-28 px-5 pt-5"
                ListHeaderComponent={() =>
                <View className="py-5 gap-y-5">
                    <CustomHeader title="Your Cart" />
                <View className="flex flex-row justify-between">
                    <View className="flex-start">
                    <Text className="small-bold text-primary">DELIVER TO</Text>
                    <View className="flex-row flex-center gap-x-1 mt-0.5">
                    <Text className="paragraph-bold text-dark-100">India</Text>
                    </View>
                    </View>
                <TouchableOpacity onPress={() => {}} className="border border-primary rounded-full px-3 py-2">
                    <Text className="font-bold text-primary">Change Location</Text>
                </TouchableOpacity>
                </View>
                </View>}
                ListEmptyComponent={() => 
                    <View className="flex-1 items-center justify-center">
                    <View className="bg-white rounded-2xl p-6 shadow-md items-center" style={Platform.OS === 'android' ? {elevation: 5, shadowColor: '#878787'} : {}}>
                        <Text className="text-2xl font-bold text-gray-800 mb-2">🛒 Cart Empty</Text>
                        <Text className="text-gray-500 text-center">
                        Your plate is empty — time to fill it with something tasty! 🍔
                        </Text>
                    </View>
                    </View>
                    }
                ListFooterComponent={() => totalItems > 0 && (
                    <View className="gap-5">
                        <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                            <Text className="h3-bold text-dark-100 mb-5">
                                Payment Summary
                            </Text>

                            <PaymentInfoStripe
                                label={`Total Items (${totalItems})`}
                                value={`$${totalPrice.toFixed(2)}`}
                            />
                            <PaymentInfoStripe
                                label={`Delivery Fee`}
                                value={`$5.00`}
                            />
                            <PaymentInfoStripe
                                label={`Discount`}
                                value={`- $0.50`}
                                valueStyle="!text-success"
                            />
                            <View className="border-t border-gray-300 my-2" />
                            <PaymentInfoStripe
                                label={`Total`}
                                value={`$${(totalPrice + 5 - 0.5).toFixed(2)}`}
                                labelStyle="base-bold !text-dark-100"
                                valueStyle="base-bold !text-dark-100 !text-right"
                            />
                        </View>

                        <CustomButton title="Order Now" />
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default Cart
