import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../Components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import '../SignIn/SignIn.css'
import login from '../../assets/login.jpg'
import { useDispatch, useSelector } from "react-redux";
import { FetchUser } from "../../Redux/Features/SignInSlice";
import { toast } from "react-toastify";
import { SendOtp } from "../../Redux/Features/OtpSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

const Signin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const { loading } = useSelector(state => state.signin);


    // ---------------- INITIAL VALUES ----------------

    const initialValues = {
        email: "",
        password: "",
    };

    // ---------------- VALIDATION ----------------

    const validationSchema = Yup.object({
        email: Yup.string()
            // .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[0-9]/, "Must contain at least one number")
            .required("Password is required"),
    });

    // ---------------- LOGIN ----------------

    const handleSubmit = async (values) => {

        try {

            await dispatch(FetchUser(values)).unwrap();

            toast.success("Welcome back!");
            navigate("/MessagePage");

        } catch (err) {

            console.log("LOGIN ERROR", err);

            toast.error(`${err?.message || "Login failed"}`)
            console.log(err?.response?.data?.message)

        }
    };

    // ---------------- FORGOT PASSWORD ----------------

    const handleForgotPassword = async (values) => {
        try {
            if (!values.email) {
                toast.error("Enter Email first");
                return;
            }

            const res = await dispatch(SendOtp({
                email: values.email,
                action: "forgot_password"
            }));

            // optional: check success
            if (res?.payload?.success) {
                navigate("/OtpPage", {
                    state: {
                        email: values.email,
                        from: "forgot_password",
                        action: "forgot_password"
                    }
                });
            } else {
                toast.error("Failed to send OTP");
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        // ================================= SignIn Page ================================= //
        <div className="Signin">
            <div className="signin-conainer">
                <div className="Signin-left">
                    <img
                        src={login}
                        alt="login"
                    />
                </div>
                <div className="auth-box" >
                    <div className="auth-card">
                        <h2 style={{ color: 'black' }}>Sign In</h2>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values }) => (
                                <Form>
                                    <Field type="email" name="email" placeholder="Email" />
                                    <ErrorMessage name="email" component="span" className="error" />

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
                                    <span
                                        className="Forgot-pass"
                                        style={{ color: "blue" }}
                                        onClick={() => {
                                            handleForgotPassword(values)
                                        }}
                                    >
                                        Forgot Password?
                                    </span>
                                    <br></br>
                                    <Button type="submit" className='signin-btn'>{loading ? 'Login...' : 'SignIn'}</Button>
                                    <div className="login-footer">
                                        <span className="login-text">
                                            Don't have an account?
                                            <Link to='/signup' className="login-link" >SignUp</Link>
                                        </span>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
