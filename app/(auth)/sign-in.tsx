import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { singIn } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const SingIn = () => {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const submit = async () => {
    const {email, password} = form;
    if(!email || !password) {
      Alert.alert('Error', 'Please provide email and password');
      return;
    }
    setIsSubmitting(true);
    try {
      await singIn({ email, password });
      // Alert.alert('Success', 'You have signed in successfully');
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }finally{
      setIsSubmitting(false);
    }
  }


  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
          <CustomInput 
              placeholder="Enter you email"
              value={form.email}
              onChangeText={(text) => setForm((prev)=> ({...prev, email: text}))}
              label="Email"
              keyboardType="email-address"
            />
          <CustomInput 
              placeholder="Enter you password"
              value={form.password}
               onChangeText={(text) => setForm((prev)=> ({...prev, password: text}))}
              label="Password"
              secureTextEntry
            />
            <CustomButton
            title='Sign In'
            onPress={submit}
            />
            <View className="flex justify-center mt-5 flex-row gap-2">
              <Text className="base-regular text-gray-100">
                Don't have an account?
                </Text>
                <Link href={'/sign-up'} className="base-bold text-primary">
                  Sign Up
                </Link>
            </View>
    </View>
  );
};

export default SingIn;
