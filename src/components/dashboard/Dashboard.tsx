import styles from "./Dashboard.module.css";
import { useState } from "react";

const currencies = ["INR", "USD", "EUR", "GBP", "AUD", "CAD"];

const Dashboard = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("INR");
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.headerRow}>
          <p className={styles.subtitle}>Overview of your financial activities</p>
          <select
            name="Currency Selection"
            id="currecySelector"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className={styles.currencySelector}
          >
            {currencies.map((eachCurrency) => (
              <option key={eachCurrency} value={eachCurrency}>
                {eachCurrency}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
