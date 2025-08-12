import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import useAuthStore from "@/store/auth.store";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignUp = () => {
  const {register} = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name:'',
    email: '',
    password: ''
  });
  const submit = async () => {
    const {name, email, password} = form;
    if(!email || !password || !name) {
      Alert.alert('Error', 'Please provide name, email and password');
      return;
    }
    setIsSubmitting(true);
    try {
      await register( email, password, name);
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
              placeholder="Enter you full name"
              value={form.name}
              onChangeText={(text) => setForm((prev)=> ({...prev, name: text}))}
              label="Name"
            />
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
            title='Sign Up'
            onPress={submit}
            />
            <View className="flex justify-center mt-5 flex-row gap-2">
              <Text className="base-regular text-gray-100">
                Already have an account?
                </Text>
                <Link href={'/sign-in'} className="base-bold text-primary">
                  Sign In
                </Link>
            </View>
    </View>
  );
};

export default SignUp;
