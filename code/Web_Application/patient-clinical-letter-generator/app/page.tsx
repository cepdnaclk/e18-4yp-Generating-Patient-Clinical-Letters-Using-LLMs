import React from "react";
import Link from "next/link";
import styles from "./Home.module.css"; // Import styles from a CSS module or adjust paths as necessary

const Home = () => {
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", height: "100vh" }}>
        <div
          style={{
            flex: "0 0 50%",
            background: 'url("/images/FYP_Home.jpg") center/cover no-repeat',
          }}
        ></div>

        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <h2 className="text-center">
              Transforming patient care with precision and compassion through
              intelligent clinical letter generation
            </h2>
            <div className={styles.buttonContainer}>
              <Link href="/login" passHref className={styles.loginButton}>
                Login
              </Link>
              <Link href="/register" passHref className={styles.registerButton}>
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
