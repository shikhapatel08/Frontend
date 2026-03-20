import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUser } from "../../Redux/Features/UpdateProfileSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import '../ChangePassword/ChangePassword.css'
import { BackbtnIcon } from "../../Components/Common Components/Icon/Icon";
import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

export default function ChangePassword({ onBack }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loading = useSelector((state) => state.updateprofile?.loading);
    const { getThemeStyle, theme } = useContext(ThemeContext);


    // ---------------- VALIDATION ----------------

    const validationSchema = Yup.object({
        oldPassword: Yup.string().required("Old password required"),
        newPassword: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[0-9]/, "Must contain at least one number")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });

    // ---------------- FORMIK ----------------
    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            dispatch(UpdateUser({ type: "resetpassword", data: values }))
                .unwrap()
                .then(() => {
                    toast.success("Password updated successfully");
                    navigate("/Settings");
                    resetForm();
                })
                .catch((err) => {
                    console.log(err)
                    // toast.error(`${err}`)
                    toast.error("Old Password doesn't match!")
                    if (err?.status === 400 || err?.code === 400 || err?.response?.status === 400) {
                        toast.error("Old Password doesn't match!");
                    } else {
                        toast.error("Something went Wrong!")
                    }
                })
        },
    });

    const renderError = (field) =>
        formik.touched[field] && formik.errors[field] && (
            <div className="error">{formik.errors[field]}</div>
        );

    return (
        <div className="changepassword-container" style={getThemeStyle(theme)}>
            <form onSubmit={formik.handleSubmit} style={{ marginTop: "40px", color: 'black' }}>
                <span onClick={onBack} className="back-btn"><BackbtnIcon /></span>
                <span><h3>Change Password</h3></span>

                {/* Old Password */}

                <div className="form-group">
                    <label>Old Password</label>
                    <input type="password" name="oldPassword" onChange={formik.handleChange} value={formik.values.oldPassword} placeholder="Old Password"/>
                    {renderError("oldPassword")}
                </div>

                {/* New Password */}

                <div className="form-group">
                    <label>New Password</label>
                    <input type="password" name="newPassword" onChange={formik.handleChange} value={formik.values.newPassword} placeholder="New Password"/>
                    {renderError("newPassword")}
                </div>

                {/* New Password */}

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" onChange={formik.handleChange} value={formik.values.confirmPassword} placeholder="Confirm Password"/>
                    {renderError("confirmPassword")}
                </div>


                <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    )
}