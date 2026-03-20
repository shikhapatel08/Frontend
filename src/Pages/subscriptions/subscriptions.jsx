import { useContext, useEffect } from "react";
import "./subscriptions.css";

import { BackbtnIcon } from "../../Components/Common Components/Icon/Icon";

import { useDispatch, useSelector } from "react-redux";
import { Fetchsubscriptiondata, subscribeToChat, subscriptionCheckout } from "../../Redux/Features/subscriptions";
import { ThemeContext } from "../../Context/ThemeContext";

export default function SubscriptionPlans({ user, onBack }) {

    /* ---------------- HOOKS ---------------- */

    const dispatch = useDispatch();

    const { plans, Data, loading } = useSelector((state) => state.subscriptions);

    const { theme, getThemeStyle } = useContext(ThemeContext);

    const currentPlan = Data?.Plan?.type;
    const userPlan = user?.subscription || "free";

    /* ---------------- FETCH DATA ---------------- */


    // console.log("loading:", loading) ;
// console.log("plans:", plans);
    useEffect(() => {
        dispatch(subscribeToChat());
        dispatch(Fetchsubscriptiondata());
    }, [dispatch]);

    /* ---------------- SUBSCRIBE ---------------- */

    const handleSubscription = async (planId) => {
        try {
            const res = await dispatch(
                subscriptionCheckout(planId)
            ).unwrap();
            if (res?.url) {
                window.location.assign(res.url);
            }
        } catch (err) {
            console.error(err);
        }
    };

    /* ---------------- LOADING ---------------- */

    if (loading || !plans?.data || plans.data.length === 0) {
        return (
            <div className="loader-overlay">
                <div className="dots-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        );
    }

    /* ---------------- UI ---------------- */

    return (

        <div className="plans-container" style={getThemeStyle(theme)}>

            {/* HEADER */}

            <div className="back-button">

                <span
                    className="back-btn"
                    onClick={onBack}
                >
                    <BackbtnIcon />
                </span>

                <h2>Subscription</h2>

            </div>

            {/* TITLE */}

            <div className="plan-header">

                <h2
                    style={{
                        textAlign: "center",
                        color: "gray",
                    }}
                >
                    Find the plan that fits your needs
                </h2>

                <p
                    style={{
                        textAlign: "center",
                        color: "gray",
                    }}
                >
                    Choose a plan and unlock smarter conversations
                </p>

            </div>

            {/* PLANS */}

            <div className="plans-grid">

                {plans?.data.map((plan) => {

                    const isCurrentPlan =
                        currentPlan === plan.type &&
                        Data?.status === "Active";

                    return (

                        <div
                            key={plan.id}
                            className={`plan-card ${userPlan === plan.type ? "active" : ""} ${plan.type === "Premium" ? "most-popular" : ""}`}>

                            {/* PLAN HEADER */}

                            <div className="plan-header">
                                <h3>{plan.type} Plan</h3>
                                <div className="price">
                                    ₹{plan.price}
                                    <span>/mo</span>
                                </div>
                            </div>

                            {/* BUTTON */}

                            <button
                                className="get-started-btn"
                                disabled={isCurrentPlan}
                                onClick={() =>
                                    handleSubscription(plan.id)
                                }
                            >

                                {isCurrentPlan
                                    ? "Your Current Plan"
                                    : "Get Started"}

                            </button>

                            {/* FEATURES */}

                            <ul className="features-list">

                                <li>
                                    {plan.daily_message_limit
                                        ? `${plan.daily_message_limit} messages per day`
                                        : "Unlimited chats"}
                                </li>

                                <li>
                                    {plan.file_sharing_enable
                                        ? "File & media sharing"
                                        : "No file sharing"}
                                </li>

                                <li>
                                    {plan.ads_enabled
                                        ? "Ads enabled"
                                        : "No Ads"}
                                </li>

                                {plan.priority_delivery && (
                                    <li>
                                        Priority message delivery
                                    </li>
                                )}

                                {plan.custom_status && (
                                    <li>
                                        Custom status
                                    </li>
                                )}

                            </ul>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}
