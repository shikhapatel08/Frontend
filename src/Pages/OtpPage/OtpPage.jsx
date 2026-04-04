import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../Components/Button/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../ResetPassword/ResetPassword.css";
import "../OtpPage/otpPage.css";
import login from "../../assets/login.jpg";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SendOtp, verifyOtp } from "../../Redux/Features/OtpSlice";
import { ForgotPassword } from "../../Redux/Features/ForgotPassword";

export default function OtpPage() {

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.otp);

    const email = location.state?.email;
    const flow = location.state?.from;

    const [timer, setTimer] = useState(120);

    useEffect(() => {
        if (!email || !flow) {
            navigate("/");
        }
    }, [email, flow, navigate]);

    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const initialValues = {
        name: location.state?.name || "",
        email: location.state?.email || "",
        otp: "",
    };

    const validationSchema = Yup.object({
        otp: Yup.string()
            .matches(/^[0-9]{6}$/, "OTP must be 6 digits")
            .required("OTP is required")
    });

    const handleSubmit = (values) => {


        dispatch(verifyOtp({
            email: values.email,
            otp: values.otp,
        }))
            .unwrap()
            .then(() => {
                localStorage.setItem("otpVerified", "true");

                if (flow === "signup") {
                    toast.success("Account created successfully!");
                    navigate("/MessagePage");
                } else if (flow === 'forgot_password') {
                    toast.success("OTP verified");
                    navigate("/ResetPassword",
                        {
                            state: {
                                email: values.email,
                                otp: values.otp
                            }
                        }
                    );
                }
            })
            .catch((err) => {
                toast.error(err?.message || "Invalid OTP");
            });
    };

    const handleResendOtp = () => {
        dispatch(SendOtp({ email, action: flow }));
        setTimer(120);
    };

    return (
        <div className="otpPage">
            <div className="otpPage-conainer">

                <div className="otpPage-left">
                    <img src={login} alt="login" />
                </div>

                <div className="auth-box">
                    <div className="auth-card">
                        <h2 style={{ color: 'black' }}>Verify OTP</h2>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <div className="password-field">
                                    <Field
                                        type="text"
                                        name="otp"
                                        placeholder="Enter OTP"
                                        maxLength="6"
                                    />
                                </div>
                                <ErrorMessage name="otp" component="span" className="error" />

                                {timer > 0 ? (
                                    <p className="timer" style={{ color: 'grey', textAlign: 'right' }}>OTP expires in {formatTime(timer)}</p>
                                ) : (
                                    <p
                                        style={{ textAlign: 'right', marginBottom: '4px', color: 'blue' }}
                                        onClick={handleResendOtp}
                                        className="reset-password"
                                    >
                                        Resend OTP
                                    </p>
                                )}

                                <Button type="submit" className="signin-btn" disabled={timer === 0}>
                                    {loading ? "Please wait..." : "Verify OTP"}
                                </Button>

                            </Form>
                        </Formik>

                    </div>
                </div>

            </div>
        </div>
    );
}
