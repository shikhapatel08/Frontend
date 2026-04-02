import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../Components/Button/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../ResetPassword/ResetPassword.css'
import login from '../../assets/login.jpg'
import { useDispatch } from "react-redux";
import { ForgotPassword } from "../../Redux/Features/ForgotPassword";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const email = location.state?.email;

    /* ---------------- GUARD ---------------- */

    useEffect(() => {
        if (!email) {
            navigate("/");
        }
    }, [email, navigate]);

    /* ---------------- FORM ---------------- */

    const initialValues = {
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[0-9]/, "Must contain at least one number")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const handleSubmit = (values) => {
        const payload = {
            email: email,
            newPass: values.password
        }
        dispatch(ForgotPassword(payload))
            .unwrap()
            .then(() => {
                navigate('/');
            })
            .catch((err) => {
                console.log("LOGIN ERROR", err);
            });
    };

    return (
        // ================================= Reset Password ================================= //alues
        <div className="resetpassword">
            <div className="resetpassword-conainer">
                <div className="resetpassword-left">
                    <img
                        src={login}
                        alt="login"
                    />
                </div>
                <div className="auth-box" >
                    <div className="auth-card">
                        <h2 style={{ color: 'black' }}>Forgot Password</h2>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <div className="password-field">
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                    />
                                    <span
                                        className="eye"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </span>
                                </div>
                                <ErrorMessage name="password" component="span" className="error" />
                                <div className="password-field">
                                    <Field
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                    />
                                    <span
                                        className="eye"
                                        onClick={() => setShowConfirmPassword(prev => !prev)}
                                    >
                                        {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                                    </span>
                                </div>
                                <ErrorMessage name="confirmPassword" component="span" className="error" />
                                <Button type="submit" className='signin-btn'>Continue</Button>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};