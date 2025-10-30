'use client';
import React from 'react'
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import FooterLink from "@/components/forms/FooterLink";

const SignIn = () => {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<SignUpFormData>({
        defaultValues: {
            email:'',
            password:''
        },
        mode: 'onBlur'
    });
    const onSubmit = async (data: SignUpFormData) => {
        try {
            console.log(data);
        } catch(e){
            console.log(e);
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <InputField
                name="email"
                label="Email"
                placeholder = "contact@gmail.com"
                register = {register}
                error = {errors.email}
                validation={{required: 'Email name is required', pattern: /^\w+@\w+\.\w+$/, message:'Email address is required'}}
            />
            <InputField
                name="password"
                label="Password"
                placeholder = "Enter a strong password"
                type="password"
                register = {register}
                error = {errors.password}
                validation={{required: 'Password is required', minLength:8}}
            />

            <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                {isSubmitting ? 'Logging in' : 'Login'}
            </Button>

            <FooterLink text="Don't have an account" linkText="Create an account" href="/sign-up"/>
        </form>
    )
}
export default SignIn
