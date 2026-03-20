import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { TransactionHistory } from "../../Redux/Features/subscriptions";
import '../Transaction/Transaction.css'
import { useLayoutStyle } from "../../Components/Common Components/Common/CommonComponents";
import { ThemeContext } from "../../Context/ThemeContext";

export default function Transaction({ type }) {
    const { transactionHistory } = useSelector(state => state.subscriptions);
    const dispatch = useDispatch();
    const style = useLayoutStyle();
    const { getThemeStyle, theme } = useContext(ThemeContext);

    useEffect(() => {
        dispatch(TransactionHistory());
    }, []);
    
    return (
        <div className="transactions-container" style={{
            ...(type === "setting" ? {} : style),
            ...getThemeStyle(theme)
        }}>
            <h2 className="transactions-title">Transactions</h2>

            <table>
                <thead>
                    <tr>
                        <th>Plan</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Currency</th>
                        <th>Date</th>
                        <th>Invoice</th>
                    </tr>
                </thead>

                <tbody> 
                    {transactionHistory?.map((item) => (
                        <tr key={item.id}>
                            <td data-label="Plan">{item.Plan?.type}</td>
                            <td data-label="Amount">₹{item.amount}</td>
                            <td
                                data-label="Status"
                                className={`status-${item.status.toLowerCase()}`}
                            >
                                {item.status}
                            </td>
                            <td data-label="Currency">{item.currency}</td>
                            <td data-label="Date">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td data-label="Invoice">
                                {item.invoice_url ? (
                                    <a
                                        href={item.invoice_url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Invoice
                                    </a>
                                ) : (
                                    "-"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    )
}