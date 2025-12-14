import { useState } from "react";
import styles from "./App.module.css";
import Dashboard from "./components/dashboard/Dashboard";
import Transactions from "./components/transactions/Transactions";
import TransactionForm from "./components/transactions/TransactionForm";

type View = "dashboard" | "transactions" | "add";

function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard");

  return (
    <main className={styles.app}>
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <span className={styles.logo}>💰</span>
          <h1 className={styles.navTitle}>Smart Spend AI</h1>
        </div>

        <div className={styles.navLinks}>
          <button
            onClick={() => setCurrentView("dashboard")}
            className={`${styles.navLink} ${
              currentView === "dashboard" ? styles.navLinkActive : ""
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setCurrentView("transactions")}
            className={`${styles.navLink} ${
              currentView === "transactions" ? styles.navLinkActive : ""
            }`}
          >
            Transactions
          </button>

          <button
            onClick={() => setCurrentView("add")}
            className={`${styles.navLink} ${currentView === "add" ? styles.navLinkActive : ""}`}
          >
            + Add Transactions
          </button>
        </div>
      </nav>

      <section className={styles.main}>
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "transactions" && <Transactions />}
        {currentView === "add" && <TransactionForm />}
      </section>
    </main>
  );
}

export default App;
