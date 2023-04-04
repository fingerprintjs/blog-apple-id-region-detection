import { useCallback } from "react";
import { getDemoState } from "../../state";
import { reloadPage } from "../../utils";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.container}>
      <a className={styles.link} href="#" target="_blank">
        Article
      </a>
      <a className={styles.link} href="#" target="_blank">
        Source code
      </a>
    </footer>
  );
}

export function FooterInProgress() {
  const handleResetClick = useCallback(() => {
    const { resetDemoAndReload } = getDemoState();
    resetDemoAndReload();
  }, []);

  return (
    <footer className={styles.container}>
      <div className={styles.link} onClick={handleResetClick}>
        Reset
      </div>
    </footer>
  );
}
