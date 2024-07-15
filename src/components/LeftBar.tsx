import { useNavigate } from "react-router-dom";
import styles from "./LeftBar.module.scss";
import categoriesIcon from "../../assets/icons/folder-solid.svg";
import favouritesIcon from "../../assets/icons/star-solid.svg";
import logoutIcon from "../../assets/icons/right-from-bracket-solid.svg";

export interface LeftBarProps {
  selectedCategory: string;
  setSelectedCategory: any;
}

const data = [
  { name: "All categories", icon: categoriesIcon },
  { name: "Favourites", icon: favouritesIcon },
];

export default function LeftBar({
  selectedCategory,
  setSelectedCategory,
}: LeftBarProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.main}>
      <ul className={styles.main}>
        {data.map((val) => {
          return (
            <li
              className={selectedCategory === val.name ? styles.selected : ""}
              onClick={() => setSelectedCategory(val.name)}
              key={val.name}
            >
              <img src={val.icon} alt={val.name} width={24} height={24} />
              <h1>{val.name}</h1>
            </li>
          );
        })}

        <li
          style={{ marginTop: "auto", paddingBottom: ".7rem" }}
          onClick={() => navigate("/")}
        >
          <img src={logoutIcon} alt="Logout" width={24} height={24} />
          <h1>Logout</h1>
        </li>
      </ul>
    </div>
  );
}
