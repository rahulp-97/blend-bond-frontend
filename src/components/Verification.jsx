import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isEmptyObject } from "../utils/utils";
import { useDispatch } from "react-redux";
import { addUser } from "../redux-toolkit/userSlice";

const Verification = () => {
    const [searchParams] = useSearchParams();
    const [validationErr, setValidationErr] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const verifiedUser = JSON.parse(localStorage.getItem("auth"));
    const unverifiedUser = JSON.parse(localStorage.getItem("unverified"));
    const emailId = searchParams.get("email");

    const handleVerificaton = async () => {
        const val = inputRef.current.value.trim();
        if(!val || val.length !== 6) {
            setValidationErr("code must be of 6 digits");
            return;
        };
        if(!/.+@.+\..+/.test(emailId) || !emailId) {
            setValidationErr("valid email id required");
            navigate("/login");
            return;
        };

        try {
            const response = await axios.post(`${BASE_URL}/verify`, {
                emailId,
                otp: val
            }, {
                withCredentials: true
            });
            localStorage.removeItem("auth");
            const verifiedUserData = response?.data?.data;
            localStorage.setItem("auth", JSON.stringify(verifiedUserData));
            localStorage.removeItem("unverified");

            dispatch(addUser(verifiedUserData));
            
            navigate("/", {replace: true});
        } catch (error) {
            console.log(error);
            setValidationErr(error?.response?.data?.message);
        }
    };

    const handleBlur = (e) => {
        const otp = e.target.value?.trim();
        if (otp?.length !== 6) {
            setValidationErr("code must be of 6 digits");
        } else if (otp?.length === 6) {
            setValidationErr("");
        }
    };
    const handleChange = (e) => {
        const otp = e.target.value?.trim();
        if (otp?.length === 6) {
            setValidationErr("");
        }
    };

    useEffect(() => {
        if((!unverifiedUser || isEmptyObject(unverifiedUser)) && !verifiedUser) {
            navigate("/login", { replace: true });
        }
        if(verifiedUser && verifiedUser?.isVerified) {
            navigate("/", { replace: true });
        }
    }, []);
    return (
        <div className="flex justify-center mt-24">
            <div className="card bg-neutral text-neutral-content w-[40%]">
                <div className="card-body items-center text-center">
                    <h2 className="card-title tracking-widest">OTP</h2>
                    <p>We’ve sent a 6-digit verification code to your email. Enter it below to verify your account.</p>
                    <input
                        type="number"
                        className="input validator mt-4"
                        required
                        placeholder="verification code"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        ref={inputRef}
                    />
                    {validationErr && <p className="text-red-400">
                        {validationErr}
                    </p>}
                    <div className="card-actions justify-end mt-4">
                        <button
                            className="bg-transparent cursor-pointer hover:bg-white text-white font-semibold hover:text-black py-2 px-4 border border-white hover:border-transparent rounded"
                            onClick={handleVerificaton}
                        >
                            verify
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default Verification;