import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Toast } from './ui/toast';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const AuthInterface = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      Toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isSignUp ? '/api/signup' : '/api/signin';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(isSignUp && { name: formData.name }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      Toast({
        title: "Success",
        description: isSignUp ? "Account created successfully" : "Signed in successfully",
      });

      
    } catch (error) {
      Toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            {isSignUp 
              ? 'Sign up to get started with our service' 
              : 'Sign in to access your account'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-200">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    className="pl-9 bg-gray-800 border-gray-700 text-white"
                    onChange={handleChange}
                    value={formData.name}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-9 bg-gray-800 border-gray-700 text-white"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 bg-gray-800 border-gray-700 text-white"
                  onChange={handleChange}
                  value={formData.password}
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 bg-gray-800 border-gray-700 text-white"
                    onChange={handleChange}
                    value={formData.confirmPassword}
                  />
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full relative overflow-hidden group bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              <div className="absolute inset-0 w-3 bg-gradient-to-r from-indigo-400 to-indigo-500 transition-all duration-300 ease-out group-hover:w-full opacity-10" />
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-indigo-700"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AuthInterface;