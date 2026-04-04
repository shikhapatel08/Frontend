import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../Components/Button/Button";
import '../SignUp/SignUp.css'
import login from '../../assets/login.jpg'
import { useDispatch, useSelector } from "react-redux";
import { AddUser } from "../../Redux/Features/SignUpSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { SendOtp } from "../../Redux/Features/OtpSlice";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const { loading } = useSelector(state => state.otp);

    const initialValues = {
        name: "",
        email: "",
        phone: "",
        password: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Name is required")
            .min(3, "Mimimum 3 Character")
            .max(20, "Maximum 20 Character"),
        email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
        phone: Yup.string()
            .matches(/^[0-9]{10}$/, "phone number must be exactly 10 digits")
            .max(10, "Phone number must be 10 character")
            .required("phone Number is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[0-9]/, "Must contain at least one number")
            .required("Password is required"),
    });

    const handleSubmit = async (values) => {
        if (loading) return;
        try {

            await dispatch(AddUser(values)).unwrap();

            await dispatch(
                SendOtp({
                    email: values.email,
                    action: "signup"
                })
            );

            navigate("/OtpPage", {
                state: {
                    email: values.email,
                    from: "signup",
                    action: "signup"
                }
            });

        } catch (err) {

            toast.error(`${err?.message}`)
        }
    };


    return (
        <div className="Signup">
            <div className="signup-conainer">
                <div className="Signup-left">
                    <img
                        src={login}
                        alt="login"
                    />
                </div>
                <div className="auth-box" >
                    <div className="auth-card">
                        <h2 style={{ color: 'black' }}>Sign Up</h2>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            <Form >
                                <Field type="text" name="name" placeholder="Full Name" />
                                <ErrorMessage name="name" component="span" className="error" />

                                <Field type="email" name="email" placeholder="Email" />
                                <ErrorMessage name="email" component="span" className="error" />

                                <Field
                                    type='tel'
                                    name="phone"
                                    placeholder="phone Num"
                                />
                                <ErrorMessage
                                    name="phone"
                                    component="span"
                                    className="error"
                                />

                                <div className="password-field">
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                    />
                                    <span
                                        className="eye-icon"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                                    </span>
                                </div>
                                <ErrorMessage name="password" component="span" className="error" />

                                <br />
                                <Button type="submit" className='Signup-btn'>{loading ? 'Loading...' : 'Create Account'}</Button>
                                <div className="login-footer">
                                    <span className="login-text">
                                        Don't have an account?
                                        <Link to='/' className="login-link">SignIn</Link>
                                    </span>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
