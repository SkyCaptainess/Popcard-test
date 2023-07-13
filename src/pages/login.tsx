import { useCallback, useState, useRef } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";

import { loadFull } from "tsparticles";
import axios from "axios";
import { FiSearch, FiX } from "react-icons/fi";
import Chat from "../components/Chat";
import { useApp, useWallet } from "../contexts";
import PayWithPayPal from "../components/PayWithPayPal";
import PaymentModal from "../components/PaymentModal";


import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from 'swiper';
import { Autoplay, Pagination, Navigation } from "swiper";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import "./styles.css";

import { FcGoogle } from "react-icons/fc";
import { AiFillFacebook } from "react-icons/ai";
import {
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider,
    updateProfile,
} from "firebase/auth";

import { getFirestore, collection, addDoc, setDoc, doc, serverTimestamp, DocumentData, DocumentReference, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, firestore, storage } from "../services/firebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

import { useNavigate } from 'react-router-dom';

export default function Login() {

    let navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        } else {
            navigate("/login");
        }

    }, []);


    const { modalOpen, setModalOpen } = useApp();
    const [signedIn, setSignedIn] = useState<boolean>(false);
    const [paypalModalOpen, setPaypalModalOpen] = useState<boolean>(false);
    const { isConnected } = useWallet();
    const [query, setQuery] = useState<string>("");
    const [method, setMethod] = useState<number>(0);
    const [isYoutube, setIsYoutube] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);
    const [checkout, setCheckout] = useState(false);
    const [userData, setUserData] = useState<object>({});

    const [joinTime, setJoinTime] = useState<number>(0);
    const [signInTime, setSignInTime] = useState<number>(0);
    const [basicUpgradeTime, setBasicUpgradeTime] = useState<number>(0);
    const [professionalUpgradeTime, setProfessionalUpgradeTime] = useState<number>(0);
    const [premierUpgradeTime, setPremierUpgradeTime] = useState<number>(0);

    const firestore = getFirestore();
    const [user, loading] = useAuthState(auth);

    // Sign in with google
    const googleProvider = new GoogleAuthProvider();

    const GoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { user } = result;
            const email = user.email;
            // Add user data to Firestore
            // const usersCollectionRef = collection(firestore, 'users');
            // const userDocRef = doc(usersCollectionRef, user.email);
            // const userData = {
            //   signInTime: serverTimestamp(),
            // };

            // await setDoc(userDocRef, userData);


            if (user && user.email) { // Check if user.email is not null
                const userRef: DocumentReference<DocumentData> = doc(collection(firestore, 'users'), user.email); // Set the document name to user's email

                // Check if the user document already exists
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    // User document already exists, update the signInTime field with current timestamp
                    await updateDoc(userRef, {
                        signInTime: serverTimestamp(),
                    });
                    console.log('Current sign-in timestamp stored successfully!');
                } else {
                    // User document doesn't exist, create a new document with join time and sign-in time
                    const userData: DocumentData = {
                        email: user.email,
                        joinTime: serverTimestamp(),
                        signInTime: serverTimestamp(),
                        basicUpgradeTime: null,
                        professionalUpgradeTime: null,
                        premierUpgradeTime: null,
                    };
                    await setDoc(userRef, userData);
                    console.log('Join time and sign-in timestamp stored successfully!');
                }

                console.log('Sign-in timestamp checked!');


                const fetchUserData = async (email: any) => {
                    const userRef = doc(collection(firestore, 'users'), email);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        // Set the userData state variable
                        setUserData(userData);
                        console.log('User Data:', userData);
                        if (userData.signInTime && userData.signInTime.seconds !== null) {
                            setSignInTime(userData.signInTime.seconds);
                        }
                        if (userData.joinTime && userData.joinTime.seconds !== null) {
                            setJoinTime(userData.joinTime.seconds);
                        }
                        if (userData.basicUpgradeTime && userData.basicUpgradeTime.seconds !== null) {
                            setBasicUpgradeTime(userData.basicUpgradeTime.seconds);
                        }
                        if (userData.professionalUpgradeTime && userData.professionalUpgradeTime.seconds !== null) {
                            setProfessionalUpgradeTime(userData.professionalUpgradeTime.seconds);
                        }
                        if (userData.premierUpgradeTime && userData.premierUpgradeTime.seconds !== null) {
                            setPremierUpgradeTime(userData.premierUpgradeTime.seconds);
                        }
                    } else {
                        console.log('User does not exist');
                    }
                };

                // Assuming you have the logged-in user's email available
                if (user) {
                    const userEmail = user.email;
                    fetchUserData(userEmail);
                }
                if (result) {
                    setSignedIn(true);
                    navigate('/');
                }
            }

        } catch (error) {
            console.log(error);
        }
    };

    const updateBasicUpgradeTime = async (email: any) => {
        try {
            const userRef = doc(firestore, 'users', email);
            const newTime = serverTimestamp();
            await updateDoc(userRef, { basicUpgradeTime: newTime });
            console.log('Basic upgrade time updated successfully!');
        } catch (error) {
            console.error('Error updating basic upgrade time:', error);
        }
    };

    const updateProfessionalUpgradeTime = async (email: any) => {
        try {
            const userRef = doc(firestore, 'users', email);
            const newTime = serverTimestamp();
            await updateDoc(userRef, { professionalUpgradeTime: newTime });
            console.log('Professional upgrade time updated successfully!');
        } catch (error) {
            console.error('Error updating basic upgrade time:', error);
        }
    };

    const updatePremierUpgradeTime = async (email: any) => {
        try {
            const userRef = doc(firestore, 'users', email);
            const newTime = serverTimestamp();
            await updateDoc(userRef, { premierUpgradeTime: newTime });
            console.log('Basic upgrade time updated successfully!');
        } catch (error) {
            console.error('Error updating basic upgrade time:', error);
        }
    };

    useEffect(() => {
        const fetchUserData = async (email: any) => {
            const userRef = doc(collection(firestore, 'users'), email);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                // Set the userData state variable
                setUserData(userData);
                console.log('User Data:', userData);
                if (userData.signInTime && userData.signInTime.seconds !== null) {
                    setSignInTime(userData.signInTime.seconds);
                }
                if (userData.joinTime && userData.joinTime.seconds !== null) {
                    setJoinTime(userData.joinTime.seconds);
                }
                if (userData.basicUpgradeTime && userData.basicUpgradeTime.seconds !== null) {
                    setBasicUpgradeTime(userData.basicUpgradeTime.seconds);
                }
                if (userData.professionalUpgradeTime && userData.professionalUpgradeTime.seconds !== null) {
                    setProfessionalUpgradeTime(userData.professionalUpgradeTime.seconds);
                }
                if (userData.premierUpgradeTime && userData.premierUpgradeTime.seconds !== null) {
                    setPremierUpgradeTime(userData.premierUpgradeTime.seconds);
                }
            } else {
                console.log('User does not exist');
            }
        };

        // Assuming you have the logged-in user's email available
        if (user) {
            const userEmail = user.email;
            fetchUserData(userEmail);
        }

        // Call the fetchUserData function when the component mounts
    }, [user]);

    // // Sign in with Facebook
    // const fbProvider = new FacebookAuthProvider();
    // const FacebookLogin = async () => {
    //   try {
    //     const result = await signInWithPopup(auth, fbProvider);
    //     const credential = await FacebookAuthProvider.credentialFromResult(
    //       result
    //     );
    //     const token = credential?.accessToken;
    //     let photoUrl = result.user.photoURL + "?height=500&access_token=" + token;
    //     updateProfile(auth.currentUser!, { photoURL: photoUrl });
    //     setSignedIn(true);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    const send = async () => {
        if ((user && ((signInTime - joinTime < 259200) || (signInTime - basicUpgradeTime < 2629743) || (signInTime - professionalUpgradeTime < 7889229) || (signInTime - professionalUpgradeTime < 31556926)))) {
            const res = await axios.get(
                `http://127.0.0.1:5000/api/generator?query=${query}&type=${isYoutube ? "Youtube" : "TikTok"
                }`
            );
            if (res.status === 200) setTags(res.data.tags);
            console.log(res.data.tags);
        } else {
            const res = await axios.get(
                `http://127.0.0.1:5000/api/generator?query=${query}&type=${isYoutube ? "Youtube" : "TikTok"
                }`
            );
            if (res.status === 200) setTags(res.data.tags[0]);
            console.log('tags>>>>>>>>>>' + res.data.tags[0]);
        }
    };

    const remove = (i: number) => {
        const newTags = [...tags];
        newTags.splice(i, 1);
        setTags(newTags);
    };

    const particlesInit = useCallback(async (engine: Engine) => {
        // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);

    const handleConfirm = (method: number) => {
        setMethod(method);
    };

    const particlesLoaded = useCallback(
        async (container: Container | undefined) => {
            // await console.log(container);
        },
        []
    );

    const handlePaymentSuccess = (paymentDetails: any) => {
        // Handle the successful payment
        console.log('Payment successful:', paymentDetails);
    };

    const handlePaymentError = (error: any) => {
        // Handle payment error
        console.error('Payment error:', error);
    };


    return (
        <main
            className="flex items-center justify-center"
        >
            <div className="w-full h-screen flex">
                <div className="w-[30%] h-full p-10">
                    {!user &&
                        <>
                            <div className="w-full">

                                <img className="w-[50%] h-auto mb-24  border-b-2" src="logo.jpg" />

                                <div className="mb-12">
                                    <h1 className="text-[40px] font-bold ">Welcome back</h1>

                                    <p className="text-xl">New to here? <a className="text-[#FFC002] hover:text-[#ffa602] transition-all font-bold ml-3 hover:cursor-pointer"> Create an account</a></p>
                                </div>


                                <div className="mb-6">
                                    <p>Email</p>
                                    <input className="bg-white border text-gray-600 p-4 w-full font-bold rounded-lg justify-center flex align-middle gap-2" />
                                </div>


                                <div className="mb-6">
                                    <p>Password</p>
                                    <input type='password' className="bg-white border text-gray-600 p-4 w-full font-bold rounded-lg justify-center flex align-middle gap-2" />
                                </div>


                                <div className="mb-6 flex justify-center items-center">
                                    <input className="w-[20px] h-[20px] hover:cursor-pointer"
                                        type="checkbox"
                                    />
                                    <p className="text-xl ml-3">Remember for 30 days </p>
                                    <a className="text-[#FFC002] hover:text-[#ffa602] transition-all ml-auto text-xl font-bold hover:cursor-pointer"> Forgot Password</a>
                                </div>

                                <button
                                    className="bg-[#FFC002] hover:bg-[#ffa602] transition-all mb-6 border text-xl text-[#ffffff] p-4 w-full font-bold rounded-lg justify-center flex align-middle gap-2"

                                >
                                    Sign in
                                </button>
                                <button
                                    className="bg-white hover:bg-[#eeeeee] transition-all border text-xl text-gray-600 p-4 w-full font-bold rounded-lg justify-center flex align-middle gap-2"
                                    onClick={GoogleLogin}
                                >
                                    <FcGoogle className="text-2xl" />
                                    Sign in with Google
                                </button>
                            </div>
                        </>
                    }
                </div>
                <div className="w-[70%] h-full bg-[#FFC002] flex justify-center">
                    <img className="absolute w-[70%] h-screen" src='img/bg/login-bg.jpg' />
                    <div className="w-full h-screen z-10 bg-[#c7801786]">


                        <Swiper
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            navigation={true}
                            modules={[Autoplay, Pagination, Navigation]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <div className="w-full flex justify-center">
                                    <img className="m-20 w-[60%] h-[60%]" src='img/slide/slide-1.png' />
                                </div>

                                <div className="w-full text-white font-medium text-3xl flex justify-center">
                                    <h3>Introducing AutoReh3orts 2.0</h3>
                                </div>
                                <div className="w-full text-white font-medium mt-3 mb-10  text-xl flex justify-center">
                                    <p className="w-[50%] text-center">You asked and we listened! Faster and More accurate automated reports. Sign in to explore!</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="w-full flex justify-center">
                                    <img className="m-20 w-[60%] h-[60%]" src='img/slide/slide-1.png' />
                                </div>

                                <div className="w-full text-white font-medium text-3xl flex justify-center">
                                    <h3>Introducing AutoReh3orts 2.0</h3>
                                </div>
                                <div className="w-full text-white font-medium mt-3 mb-10  text-xl flex justify-center">
                                    <p className="w-[50%] text-center">You asked and we listened! Faster and More accurate automated reports. Sign in to explore!</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="w-full flex justify-center">
                                    <img className="m-20 w-[60%] h-[60%]" src='img/slide/slide-1.png' />
                                </div>

                                <div className="w-full text-white font-medium text-3xl flex justify-center">
                                    <h3>Introducing AutoReh3orts 2.0</h3>
                                </div>
                                <div className="w-full text-white font-medium mt-3 mb-10  text-xl flex justify-center">
                                    <p className="w-[50%] text-center">You asked and we listened! Faster and More accurate automated reports. Sign in to explore!</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="w-full flex justify-center">
                                    <img className="m-20 w-[60%] h-[60%]" src='img/slide/slide-1.png' />
                                </div>

                                <div className="w-full text-white font-medium text-3xl flex justify-center">
                                    <h3>Introducing AutoReh3orts 2.0</h3>
                                </div>
                                <div className="w-full text-white font-medium mt-3 mb-10  text-xl flex justify-center">
                                    <p className="w-[50%] text-center">You asked and we listened! Faster and More accurate automated reports. Sign in to explore!</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="w-full flex justify-center">
                                    <img className="m-20 w-[60%] h-[60%]" src='img/slide/slide-1.png' />
                                </div>

                                <div className="w-full text-white font-medium text-3xl flex justify-center">
                                    <h3>Introducing AutoReh3orts 2.0</h3>
                                </div>
                                <div className="w-full text-white font-medium mt-3 mb-10  text-xl flex justify-center">
                                    <p className="w-[50%] text-center">You asked and we listened! Faster and More accurate automated reports. Sign in to explore!</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="w-full flex justify-center">
                                    <img className="m-20 w-[60%] h-[60%]" src='img/slide/slide-1.png' />
                                </div>

                                <div className="w-full text-white font-medium text-3xl flex justify-center">
                                    <h3>Introducing AutoReh3orts 2.0</h3>
                                </div>
                                <div className="w-full text-white font-medium mt-3 mb-10  text-xl flex justify-center">
                                    <p className="w-[50%] text-center">You asked and we listened! Faster and More accurate automated reports. Sign in to explore!</p>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>

            </div>
        </main>
    );
}
