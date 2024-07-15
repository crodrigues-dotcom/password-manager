import React from "react";
import Item from "model/Item";
import generateRandomPassword from "lib/password_utils";
import styles from "./SearchPanel.module.scss";
import searchIcon from "../../assets/icons/magnifying-glass-solid.svg";

export interface SearchPanelProps {
  search: string;
  setSearch: any;
  setItems: React.Dispatch<React.SetStateAction<[Item]>>;
  setSelectedItemIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function SearchPanel({
  search,
  setSearch,
  setItems,
  setSelectedItemIndex,
}: SearchPanelProps) {
  return (
    <div className={styles.main}>
      <div className={styles.search}>
        <img src={searchIcon} width={24} height={24} alt="search" />
        <input
          type="text"
          value={search}
          placeholder="Search..."
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className={styles.buttons}>
        <ul>
          <li
            className={styles.btn}
            onClick={() => {
              setItems((prevItems) => {
                const newItems = prevItems.slice();
                newItems.unshift(
                  new Item("New Item", "username", generateRandomPassword(32))
                );
                setSelectedItemIndex(0);
                return newItems;
              });
            }}
          >
            new password
          </li>
        </ul>
      </div>
    </div>
  );
}
