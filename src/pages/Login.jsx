
// // import { useState } from 'react';
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { useToast } from '../hooks/use-toast';

// const Login = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login, signup, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // // Redirect if already authenticated
//   // if (isAuthenticated) {
//   //   navigate('/dashboard');
//   // }
//    // Fix: Use useEffect to handle redirection instead of conditionally rendering during render
//    useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/dashboard');
//     }
//   }, [isAuthenticated, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let result;
      
//       if (isLogin) {
//         result = await login(email, password);
//       } else {
//         result = await signup(email, password);
//       }

//       if (result.success) {
//         toast({
//           title: isLogin ? "Login successful" : "Account created",
//           description: isLogin ? "Welcome back" : "Please login with your new account",
//           variant: "default",
//         });
        
//         if (isLogin) {
//           navigate('/dashboard');
//         } else {
//           // Switch to login form after successful signup
//           setIsLogin(true);
//         }
//       } else {
//         toast({
//           title: "Error",
//           description: result.error,
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
//         <div className="absolute top-40 -left-20 w-60 h-60 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
//       </div>
      
//       <div className="glass-card w-full max-w-md p-8 rounded-2xl shadow-lg z-10 animate-fade-in">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-light tracking-tight mb-1">Product Manager</h1>
//           <div className="text-sm text-gray-500 mb-6">
//             {isLogin ? "Sign in to manage your inventory" : "Create an account to get started"}
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//               placeholder="youremail@example.com"
//               required
//             />
//           </div>
          
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//               placeholder="••••••••"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-xl bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 transition-all ${
//               loading ? 'opacity-70 cursor-not-allowed' : ''
//             }`}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 {isLogin ? 'Signing in...' : 'Creating account...'}
//               </span>
//             ) : (
//               <span>{isLogin ? 'Sign in' : 'Create account'}</span>
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <button
//             onClick={() => setIsLogin(!isLogin)}
//             className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
//           >
//             {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '' });
  const [activeTab, setActiveTab] = useState('login');

  // Fix: Use useEffect to handle redirection instead of conditionally rendering during render
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(loginData.email, loginData.password);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "You have successfully logged in!",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: result.error || "Login failed. Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await signup(signupData.email, signupData.password);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Account created successfully! Please log in.",
        });
        setActiveTab('login');
        setLoginData({ email: signupData.email, password: '' });
      } else {
        toast({
          title: "Error",
          description: result.error || "Signup failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Product Manager</CardTitle>
            <CardDescription className="text-center">
              Manage your inventory with ease
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      placeholder="••••••••"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      required
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      required
                      placeholder="••••••••"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            {activeTab === 'login' ? (
              <div>
                Don't have an account?{" "}
                <button 
                  className="text-primary font-medium hover:underline" 
                  onClick={() => setActiveTab('signup')}
                >
                  Sign up
                </button>
              </div>
            ) : (
              <div>
                Already have an account?{" "}
                <button 
                  className="text-primary font-medium hover:underline" 
                  onClick={() => setActiveTab('login')}
                >
                  Log in
                </button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
